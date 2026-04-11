const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const prisma = require('./prismaClient');

/**
 * Middleware de autenticación para WebSocket
 */
async function verifySocketAuth(socket, next) {
  try {
    const { token, equipoId } = socket.handshake.auth;
    
    if (!token) {
      return next(new Error('Token no proporcionado'));
    }

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    
    // Si es un cliente, verificar que el equipo existe
    if (equipoId) {
      const equipo = await prisma.equipo.findUnique({
        where: { id: parseInt(equipoId) }
      });
      
      if (!equipo) {
        return next(new Error('Equipo no encontrado'));
      }
      
      // Permitir conexión incluso si no está aprobado (para recibir notificación de aprobación)
      socket.equipoId = equipoId;
      socket.equipoNombre = equipo.nombre;
      socket.equipoAprobado = equipo.aprobado;
    }
    
    next();
  } catch (error) {
    console.error('Error en autenticación de socket:', error);
    next(new Error('Autenticación fallida'));
  }
}

/**
 * Inicializar servidor de Socket.IO
 */
function initializeSocketServer(httpServer) {
  const isDev = process.env.NODE_ENV === 'development';
  const isElectron = !!process.env.RESOURCES_PATH || !!process.env.ELECTRON_RUN_AS_NODE;
  
  let corsOrigin = '*';
  if (isDev) {
    corsOrigin = ['http://localhost:5173', 'http://localhost:5000'];
  } else if (isElectron) {
    corsOrigin = true;
  } else if (process.env.ALLOWED_ORIGINS) {
    corsOrigin = process.env.ALLOWED_ORIGINS.split(',');
  } else {
    console.warn('⚠️  CORS no configurado. En producción, define ALLOWED_ORIGINS=domain.com en .env');
  }
  
  const io = socketIO(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10
  });

  // ============================================
  // NAMESPACE: /client (Equipos Cliente)
  // ============================================
  const clientNamespace = io.of('/client');
  
  // 🔥 FIX: Aplicar middleware de autenticación específicamente al namespace /client
  // Esto previene crasheos al evitar que el middleware se ejecute globalmente
  clientNamespace.use(verifySocketAuth);
  
  clientNamespace.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.equipoNombre} (${socket.equipoId}) - Socket: ${socket.id}`);
    
    // Unirse a room del equipo
    socket.join(`equipo-${socket.equipoId}`);
    
    // Evento: Cliente notifica cambio de datos
    socket.on('data-changed', (data) => {
      console.log(`📤 Cambio de datos desde ${socket.equipoNombre}:`, data);
      
      // Broadcast a todos los demás clientes (no al que envió)
      socket.broadcast.emit('sync-required', {
        type: data.type,
        id: data.id,
        action: data.action, // 'create', 'update', 'delete'
        from: socket.equipoNombre
      });
    });
    
    // Evento: Heartbeat (cliente sigue vivo)
    // Con timeout y validación para evitar sincronización perdida
    socket.on('heartbeat', async () => {
      const equipoId = parseInt(socket.equipoId);
      if (!equipoId) {
        console.warn('Heartbeat sin equipoId válido');
        return;
      }

      const updateWithRetry = async (retries = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            // Timeout de 5 segundos para la actualización
            const updatePromise = prisma.equipo.update({
              where: { id: equipoId },
              data: { ultima_conexion: new Date() }
            });

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), 5000)
            );

            await Promise.race([updatePromise, timeoutPromise]);
            return true; // Éxito
          } catch (error) {
            if (attempt === retries) {
              console.error(`Error final en heartbeat para equipo ${equipoId}:`, error.message);
              return false;
            }
            // Esperar antes de reintentar (exponential backoff: 100ms, 200ms, 400ms)
            await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt - 1)));
          }
        }
      };

      await updateWithRetry();
    });
    
    socket.on('disconnect', (reason) => {
      console.log(`❌ Cliente desconectado: ${socket.equipoNombre} - Razón: ${reason}`);
    });
    
    socket.on('error', (error) => {
      console.error(`⚠️ Error en socket de ${socket.equipoNombre}:`, error);
    });
  });

  // ============================================
  // NAMESPACE: /admin (Administradores)
  // ============================================
  const adminNamespace = io.of('/admin');
  
  // 🔥 FIX: Aplicar middleware de autenticación específicamente al namespace /admin
  adminNamespace.use(verifySocketAuth);
  
  adminNamespace.on('connection', (socket) => {
    console.log(`👤 Admin conectado: ${socket.userEmail} - Socket: ${socket.id}`);
    
    // Unirse a room de administradores
    socket.join('admins');
    
    socket.on('disconnect', () => {
      console.log(`👤 Admin desconectado: ${socket.userEmail}`);
    });
  });

  // ============================================
  // Funciones de Broadcast (para usar desde rutas)
  // ============================================
  
  /**
   * Notificar a todos los clientes sobre un cambio de datos
   */
  io.broadcastDataChange = (type, id, action) => {
    clientNamespace.emit('sync-required', {
      type,
      id,
      action,
      from: 'server'
    });
  };

  /**
   * Notificar a admins sobre nuevo equipo pendiente
   */
  io.notifyNewEquipment = (equipoData) => {
    adminNamespace.to('admins').emit('new-equipment-request', equipoData);
  };

  /**
   * Notificar a un equipo específico sobre su aprobación
   */
  io.notifyEquipmentApproval = (equipoId, aprobado) => {
    clientNamespace.to(`equipo-${equipoId}`).emit('approval-status', { aprobado });
  };

  console.log('🚀 Socket.IO server initialized');
  console.log('   - Namespace /client: Para equipos cliente');
  console.log('   - Namespace /admin: Para administradores');
  
  return io;
}

module.exports = { initializeSocketServer };
