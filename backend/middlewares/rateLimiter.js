const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para endpoints de autenticación
 * Previene ataques de fuerza bruta
 */
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 5 : 1000, // 5 en producción, 1000 en desarrollo
  message: {
    error: 'Demasiados intentos de inicio de sesión',
    detalle: 'Por favor intenta de nuevo en 15 minutos'
  },
  standardHeaders: true, // Retornar info de rate limit en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar headers `X-RateLimit-*`
  skipSuccessfulRequests: true // No contar requests exitosos
});

/**
 * Rate limiter para endpoints de registro QR
 * Previene spam de escaneos
 */
exports.qrScanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 60, // Máximo 60 escaneos por minuto (1 por segundo)
  message: {
    error: 'Demasiadas solicitudes',
    detalle: 'Por favor espera un momento antes de escanear nuevamente'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter para generación de reportes
 * Previene abuso de recursos del servidor
 */
exports.reportLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // Máximo 10 reportes por ventana
  message: {
    error: 'Límite de generación de reportes alcanzado',
    detalle: 'Por favor espera 5 minutos antes de generar más reportes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter general para API
 */
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 2000, // Aumentado de 100 a 2000 para evitar bloqueos en Electron
  message: {
    error: 'Demasiadas solicitudes',
    detalle: 'Has excedido el límite de solicitudes. Intenta más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Excluir rutas críticas del rate limiting para evitar bootsrap loops
  skip: (req) => {
    const original = req.originalUrl || '';
    return (
      original.includes('/api/health') || 
      original.includes('/api/institucion') ||
      original.includes('/api/auth/me')
    );
  }
});

/**
 * Rate limiter para uploads de archivos (fotos, logos)
 */
exports.uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 20, // Máximo 20 uploads por ventana
  message: {
    error: 'Límite de subida de archivos alcanzado',
    detalle: 'Por favor espera 10 minutos antes de subir más archivos'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter estricto para endpoints de autenticación
 * Protección contra ataques de fuerza bruta
 */
exports.authStrictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos por ventana
  message: {
    error: 'Demasiados intentos de autenticación',
    detalle: 'Por seguridad, espera 15 minutos antes de intentar nuevamente'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter para endpoints de lectura (GET)
 */
exports.readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 lecturas por ventana
  message: {
    error: 'Límite de consultas alcanzado',
    detalle: 'Espera unos minutos antes de continuar'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter para endpoints de escritura (POST/PUT/DELETE)
 */
exports.writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // 30 escrituras por ventana
  message: {
    error: 'Límite de modificaciones alcanzado',
    detalle: 'Espera unos minutos antes de realizar más cambios'
  },
  standardHeaders: true,
  legacyHeaders: false
});
