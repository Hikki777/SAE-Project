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
  const io = socketIO(httpServer, {
    cors: {
      origin: "*", // En producción, especificar orígenes permitidos
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'], // WebSocket primero, polling como fallback
    pingTimeout: 60000,
    pingInterval: 25000
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
    socket.on('heartbeat', async () => {
      try {
        await prisma.equipo.update({
          where: { id: parseInt(socket.equipoId) },
          data: { ultima_conexion: new Date() }
        });
      } catch (error) {
        console.error('Error actualizando heartbeat:', error);
      }
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
