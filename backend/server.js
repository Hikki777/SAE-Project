const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const NodeCache = require('node-cache');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');
const multer = require('multer');
const { getSSLCertificates } = require('./utils/ssl');

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ─────────────────────────────────────────────
const projectRoot = path.join(__dirname, '..');
const saeDataDir = process.env.SAE_DATA_DIR; // En Electron, = %APPDATA%\SAE
const isProduction = process.env.NODE_ENV === 'production';
const isElectron = !!process.env.RESOURCES_PATH || !!process.env.ELECTRON_RUN_AS_NODE;

// NOTA: Los console.log de esta sección de bootstrap son intencionales.
// El logger Pino se inicializa en la línea 140. Antes de eso, console.log
// es la única forma de emitir mensajes al stdout/Electron.
console.log(`[INIT] Entorno detectado: ${isElectron ? 'Electron (Production)' : 'Development'}`);
console.log(`[INIT] SAE_DATA_DIR: ${saeDataDir || 'N/A'}`);


// EN ELECTRON: SOLO usar SAE_DATA_DIR\.env (ignorar todos los demás)
// EN DESARROLLO: buscar en múltiples ubicaciones
if (isElectron && saeDataDir) {
  // MODO ELECTRON: FORZAR uso de AppData\SAE\.env
  const saeEnvPath = path.join(saeDataDir, '.env');
  
  // 1. Si existe el archivo, cargarlo
  if (fs.existsSync(saeEnvPath)) {
    console.log(`[ENV] Cargando variables desde: ${saeEnvPath}`);
    require('dotenv').config({ path: saeEnvPath, override: false }); // override=false: .env rellena vacíos pero no pisa Electron vars
  } else {
    // 2. Si NO existe, crear uno con secretos aleatorios
    console.log(`[ENV] .env no encontrado. Creando automáticamente en: ${saeEnvPath}`);
    
    try {
      const jwtSecret = crypto.randomBytes(32).toString('hex');
      const hmacSecret = crypto.randomBytes(32).toString('hex');
      const updateSecret = crypto.randomBytes(32).toString('hex');
      
      const envContent = `# SAE - Sistema de Administración Educativa
# Variables de Entorno Generadas Automáticamente
# Fecha: ${new Date().toISOString()}

# Secretos para Autenticación (Generados aleatoriamente)
JWT_SECRET=${jwtSecret}
HMAC_SECRET=${hmacSecret}
UPDATE_SECRET=${updateSecret}

# Configuración del Servidor
# El puerto es gestionado dinámicamente por Electron en producción.
# El valor por defecto para desarrollo es 5000.
# PORT=5000
NODE_ENV=production

# Socket.IO (Web Production - Dejar vacío para Electron)
ALLOWED_ORIGINS=

# Nota: DATABASE_URL se configura automáticamente por Electron
# Ubicación de datos: ${saeDataDir}
`;
      
      // Garantizar que el directorio padre existe antes de escribir
      if (!fs.existsSync(saeDataDir)) {
        fs.mkdirSync(saeDataDir, { recursive: true });
        console.log(`[ENV] Directorio SAE creado: ${saeDataDir}`);
      }
      
      fs.writeFileSync(saeEnvPath, envContent, 'utf8');
      console.log('[ENV] Archivo .env creado automáticamente');
      
      // Cargar el archivo que acaba de crear
      // override=false: el .env rellena los vacíos pero NO pisa lo que Electron pasó
      require('dotenv').config({ path: saeEnvPath, override: false });
    } catch (err) {
      console.error(`[ENV] Error creando .env: ${err.message}`);
      console.error('[ENV] Continuando con variables del sistema (puede fallar)');
    }
  }
} else {
  // MODO DESARROLLO: buscar en múltiples ubicaciones
  const projectRoot = path.join(__dirname, '..');
  const envPaths = [
    path.join(__dirname, '.env'),              // backend/.env
    path.join(projectRoot, '.env'),            // raíz del proyecto
    path.join(projectRoot, 'resources', 'app', '.env'), // legacy
  ];
  
  let envLoaded = false;
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      console.log(`[ENV] Variables cargadas desde: ${envPath}`);
      envLoaded = true;
      break;
    }
  }
  
  if (!envLoaded) {
    console.log('[ENV] Advertencia: No se encontró .env en ubicaciones esperadas');
  }
}

// ─────────────────────────────────────────────
// VALIDAR VARIABLES DE ENTORNO CRÍTICAS
// ─────────────────────────────────────────────
const requiredEnvVars = ['JWT_SECRET', 'HMAC_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`\n❌ ERROR CRÍTICO: Faltan variables de entorno requeridas:`);
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error(`\n   Por favor, configura estas variables en tu archivo .env`);
  console.error(`   Ver .env.example para referencia.\n`);
  process.exit(1);
}

// Inicializar caché en memoria (TTL: 10 minutos)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// CORRECCIÓN AUTOMÁTICA DE RUTA DE BD (Absolute Path Fix)
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('file:')) {
  // Si es una ruta relativa de SQLite (ej: file:./prisma/dev.db), convertirla a absoluta
  let dbPathRelative = process.env.DATABASE_URL.replace('file:', '').trim();

  if (dbPathRelative.startsWith('./') || dbPathRelative.startsWith('../')) {
    // Si la ruta es ./dev.db (convención Prisma), la mapeamos a ./prisma/dev.db real
    if (dbPathRelative === './dev.db') {
      dbPathRelative = './prisma/dev.db';
    }

    // Asumimos que la ruta es relativa a la RAÍZ del proyecto (donde está package.json)
    // __dirname es backend/, así que la raíz es path.join(__dirname, '..')
    const projectRoot = path.join(__dirname, '..');
    const absoluteDbPath = path.resolve(projectRoot, dbPathRelative);
    process.env.DATABASE_URL = `file:${absoluteDbPath}`;
    console.log(`[DB] Ruta de base de datos corregida a absoluta: ${process.env.DATABASE_URL}`);
  }
}

// Importar logger PRIMERO
const { logger, logSystemStart, setupGlobalErrorHandlers } = require('./utils/logger');
const { requestLogger, attachRequestId } = require('./middlewares/requestLogger');
const { UPLOADS_DIR, FRONTEND_DIR } = require('./utils/paths');

// ─────────────────────────────────────────────
// CREAR DIRECTORIOS NECESARIOS EN APPDATA\SAE
// ─────────────────────────────────────────────
if (isElectron && saeDataDir) {
  const requiredDirs = [
    saeDataDir,                                    // AppData\SAE
    path.join(saeDataDir, 'prisma'),              // AppData\SAE\prisma
    path.join(saeDataDir, 'logs'),                // AppData\SAE\logs
    path.join(saeDataDir, 'uploads'),             // AppData\SAE\uploads
    path.join(saeDataDir, 'uploads', 'alumnos'),
    path.join(saeDataDir, 'uploads', 'docentes'),
    path.join(saeDataDir, 'uploads', 'directores'),
    path.join(saeDataDir, 'uploads', 'personal'),
    path.join(saeDataDir, 'uploads', 'qr'),
    path.join(saeDataDir, 'uploads', 'justificaciones'),
    path.join(saeDataDir, 'uploads', 'logos'),    // ← Importante para subir logos
    path.join(saeDataDir, 'uploads', 'usuarios'),
    path.join(saeDataDir, 'backups'),             // AppData\SAE\backups
    path.join(saeDataDir, 'temp'),                // AppData\SAE\temp
  ];
  
  for (const dir of requiredDirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`[DIRS] Directorio creado: ${dir}`);
      }
    } catch (err) {
      console.error(`[DIRS] Error creando directorio ${dir}: ${err.message}`);
    }
  }
}

// Bootstrap automático de migraciones (se ejecuta en startup)
const { initializeDatabase } = require('./db/bootstrap');

const prisma = require('./prismaClient');
const qrService = require('./services/qrService');

const { apiLimiter } = require('./middlewares/rateLimiter');

// Importar rutas
const qrRoutes = require('./routes/qr');
const usuariosRoutes = require('./routes/usuarios');

const authRoutes = require('./routes/auth');
const alumnosRoutes = require('./routes/alumnos');
const asistenciasRoutes = require('./routes/asistencias');
const docentesRoutes = require('./routes/docentes');
const reportesRoutes = require('./routes/reportes');
const institucionRoutes = require('./routes/institucion');
const metricsRoutes = require('./routes/metrics');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard'); // Import Dashboard Routes
const documentosRoutes = require('./routes/documentos'); // Import Documentos Routes
const promocionRoutes = require('./routes/promocion'); // Import Promocion Routes

// Verificar variables de entorno críticas
const checkEnv = () => {
  const required = ['JWT_SECRET', 'HMAC_SECRET'];
  const missing = required.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    logger.fatal({ missing }, '[ERROR] Faltan variables de entorno críticas');
    process.exit(1);
  }
  logger.info({ variables: required }, '[OK] Variables de entorno verificadas');
};

checkEnv();

// Configurar handlers globales de errores
setupGlobalErrorHandlers();

logger.info({ uploadsDir: UPLOADS_DIR, dbUrl: process.env.DATABASE_URL?.substring(0, 20) + '...' }, '[CONFIG] Configuración del servidor');

const app = express();
const PORT = process.env.PORT || 5000;

// Hacer caché accesible desde las rutas
app.locals.cache = cache;

// Configuración para proxies
app.set('trust proxy', 1);

// ============ MIDDLEWARE DE LOGGING ============
app.use(attachRequestId);
app.use(requestLogger);

// ============ MIDDLEWARE DE SEGURIDAD ============

// Helmet: Protección de headers HTTP
app.use(
  helmet({
    contentSecurityPolicy: false, // Deshabilitado para permitir inline scripts en HTML
    crossOriginEmbedderPolicy: false,
  })
);

// CORS: Configuración segura
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) =>{
      // Permitir requests sin origin (móviles, Postman, Electron con file://, etc.)
      if (!origin) return callback(null, true);
      
      // Permitir file:// protocol (Electron)
      if (origin.startsWith('file://')) return callback(null, true);
      
      // Permitir localhost en cualquier versión (127.0.0.1 o localhost)
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }

      // Permitir conexiones de red local (LAN) para móviles y otros equipos (HTTP y HTTPS)
      const isLanIp = /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin);
      if (isLanIp) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn({ origin, allowedOrigins }, '[CORS] CORS bloqueo origen no permitido');
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Middleware adicional para asegurar CORS en todas las respuestas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Si hay un origen (browser request), lo devolvemos específicamente para permitir credentials
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Rate limiting general para toda la API
app.use('/api', apiLimiter);

// Compresión gzip/brotli para todas las respuestas
app.use(compression());

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Detectar errores de JSON malformado (body-parser)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error({ err, body: req.body }, '[JSON ERROR] JSON malformado recibido');
    return res.status(400).json({ error: 'JSON inválido o malformado. Verifique que no esté enviando archivos con el header Content-Type: application/json.' });
  }
  next(err);
});

// MIDDLEWARE DE REDIRECCIÓN: /uploads/* -> /api/uploads/* (Compatibilidad)
app.use('/uploads', (req, res) => {
  res.redirect(301, `/api/uploads${req.url}`);
});

// Endpoint para servir imágenes con CORS correcto (solución para Electron)
app.get('/api/uploads/*', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params[0]);
  
  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
  
  // Configurar headers CORS explícitamente para permitir credentials
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Range, Origin');
  res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Content-Range');
  
  // Headers para no requerir permisos CORS en Electron
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  
  // Cache control (las imágenes no cambian frecuentemente)
  res.header('Cache-Control', 'public, max-age=86400');
  
  // Enviar el archivo
  res.sendFile(filePath);
});

// Servir frontend HTML (solo en desarrollo — en producción Electron usa loadFile())
if (FRONTEND_DIR) {
  app.use(express.static(FRONTEND_DIR));
}

// Servir qr-mobile.html para celular (SIN LOGO)
app.get('/qr-mobile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../qr-mobile.html'));
});

// Servir qr-mobile-con-logo.html para celular (CON LOGO)
app.get('/qr-mobile-con-logo.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../qr-mobile-con-logo.html'));
});

// Servir mobile-scanner.html — Lector de asistencias por QR para celular
// Accesible desde cualquier dispositivo en la red local:
//   http://IP_SERVIDOR:PUERTO/mobile-scanner.html
app.get('/mobile-scanner.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../mobile-scanner.html'));
});

// Endpoint para descargar el certificado SSL auto-firmado en dispositivos móviles.
// Permite instalar el cert en Android/iOS para eliminar las advertencias de seguridad
// y habilitar la cámara en HTTPS sin servidores externos.
app.get('/api/certs/download', (req, res) => {
  const certsDir = saeDataDir
    ? path.join(saeDataDir, 'certs')
    : path.join(__dirname, 'certs');
  const certPath = path.join(certsDir, 'server.crt');

  if (!fs.existsSync(certPath)) {
    return res.status(404).json({
      error: 'Certificado SSL no disponible. SAE lo genera automáticamente al iniciar si OpenSSL (Git) está instalado.'
    });
  }

  // Leer y enviar el archivo de forma binaria para evitar restricciones de res.sendFile
  fs.readFile(certPath, (err, data) => {
    if (err) {
      return res.status(500).json({
        error: 'No se pudo leer el archivo de certificado en el servidor.',
        details: err.message
      });
    }
    // Content-Type específico para instalación automática en Android e iOS
    res.setHeader('Content-Type', 'application/x-x509-ca-cert');
    res.setHeader('Content-Disposition', 'attachment; filename="SAE-certificado.crt"');
    res.send(data);
  });
});


// Servir imprimir-qr.html para imprimir QR codes
app.get('/imprimir-qr.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../imprimir-qr.html'));
});

// Servir test-qr-display.html para pruebas
app.get('/test-qr-display.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../test-qr-display.html'));
});

// Nota: La inicialización de directorios se realiza dentro de iniciar()
// para garantizar el orden correcto del startup y el manejo de errores.

// ============ RUTAS PÚBLICAS (sin protección inicialmente para desarrollo) ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Fallback root route
app.get('/', (req, res, next) => {
  // Si existe el frontend, express.static lo servirá antes.
  // Si no, respondemos esto para evitar 404.
  res.send('Backend de Sistema de Asistencia Institucional - Funcionando [READY]');
});

// ============ RUTAS DE INICIALIZACIÓN ============
// (Las rutas de institución se manejan en routes/institucion.js)

// ============ RUTAS ESPECÍFICAS MONTADAS ============

const excusasRoutes = require('./routes/excusas');
app.use('/api/qr', qrRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/docentes', docentesRoutes);
app.use('/api/personal', docentesRoutes); // Alias para compatibilidad con JustificacionesPanel
app.use('/api/reportes', reportesRoutes);
app.use('/api/institucion', institucionRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/excusas', excusasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes); // Mount Dashboard Routes
app.use('/api/documentos', documentosRoutes); // Mount Documentos Routes
app.use('/api/migracion', promocionRoutes); // Mount Migracion Routes
app.use('/api/equipos', require('./routes/equipos'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/sync', require('./routes/sync'));

// ============ ERROR HANDLER ============

app.use((err, req, res, next) => {
  // Manejar errores de Multer específicamente
  if (err instanceof multer.MulterError) {
    logger.warn({ err, url: req.url }, '[MULTER] Error en subida de archivo');
    return res.status(400).json({ 
      error: 'Error en la subida del archivo', 
      detalle: err.message,
      codigo: err.code 
    });
  }

  logger.error(
    {
      err,
      requestId: req.id,
      url: req.url,
      method: req.method,
    },
    '[ERROR] Error no capturado en la aplicacion'
  );
  
  // Log adicional a consola para debug en caliente
  console.error('[CRITICAL ERROR]', err);

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Ha ocurrido un error interno' : err.message,
    requestId: req.id,
  });
});

// ============ INICIAR SERVIDOR ============

async function iniciar() {
  try {
    // 0. BOOTSTRAP: Ejecutar migraciones automáticamente (antes de conectar a BD)
    // - En desarrollo: silenciosamente si hay pendientes
    // - En Electron: SIEMPRE (puede haber actualizaciones de versión)
    await initializeDatabase();

    // Conectar BD
    logger.info('[DB] Probando conexión a base de datos...');

    // DEBUG: Verificar formato de URL (sin revelar credenciales)
    const dbUrl = process.env.DATABASE_URL || '';
    const maskedUrl = dbUrl.length > 15 ? `${dbUrl.substring(0, 15)}...` : 'TOO_SHORT';
    logger.info({ urlPrefix: maskedUrl, length: dbUrl.length }, '[DEBUG] Debug DATABASE_URL');

    await prisma.$queryRaw`SELECT 1`;
    logger.info('[OK] Base de datos conectada correctamente');

    // Iniciar servidor HTTP con Promise
    return new Promise((resolve, reject) => {
      // 3. Iniciar servidor HTTP
      const http = require('http');
      const server = http.createServer(app);
      
      // Inicializar Socket.IO
      const { initializeSocketServer } = require('./socketServer');
      const io = initializeSocketServer(server);
      
      // Hacer io accesible desde las rutas
      app.set('io', io);
      
      // 4. Iniciar servidor HTTPS (Opcional si hay certificados)
      let httpsServer = null;
      const HTTPS_PORT = parseInt(PORT) + 1;

      getSSLCertificates(saeDataDir, logger).then(certs => {
        if (certs) {
          const https = require('https');
          httpsServer = https.createServer(certs, app);
          
          // Vincular Socket.IO también al servidor HTTPS
          io.attach(httpsServer);
          
          httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
            logger.info({ port: HTTPS_PORT }, '[OK] Servidor HTTPS iniciado (Auto-firmado)');
          });
          
          httpsServer.on('error', (err) => {
            logger.error({ err }, '[ERROR] No se pudo iniciar el servidor HTTPS');
          });
        }
      }).catch(err => {
        logger.error({ err }, '[ERROR] Error durante la configuración de SSL');
      });

      // Escuchar en 0.0.0.0 para permitir conexiones desde otros equipos en la red local.
      server.listen(PORT, '0.0.0.0', () => {
        logSystemStart({
          port: PORT,
          databaseUrl: process.env.DATABASE_URL,
        });

        resolve(server);
      });

      server.on('error', (err) => {
        logger.fatal({ err }, '[FATAL] Error al iniciar servidor');
        reject(err);
      });
    });
  } catch (error) {
    logger.fatal({ err: error }, '[FATAL] Error critico durante el inicio');
    process.exit(1);
  }
}

iniciar().catch((err) => {
  logger.fatal({ err }, '[FATAL] Fallo al iniciar el servidor');
  process.exit(1);
});

// Manejar salida limpia
process.on('SIGINT', async () => {
  logger.info('[Server] SIGINT recibido — cerrando servidor de forma segura...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('[Server] SIGTERM recibido — cerrando servidor de forma segura...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;

