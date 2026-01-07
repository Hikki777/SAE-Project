const prisma = require('../prismaClient');
const { logger } = require('../utils/logger');

/**
 * Middleware de seguridad de red
 * Verifica si la IP del cliente está en la lista de equipos aprobados.
 */
const verifyNetworkClient = async (req, res, next) => {
  try {
    // En entornos de desarrollo con proxies (como Vite), la IP puede venir de x-forwarded-for
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Normalizar IP (quitar ::ffff: si existe)
    const normalizedIP = clientIP.replace(/^.*:/, '');

    // 1. Verificar si existen equipos aprobados en la base de datos
    const totalAprobados = await prisma.equipo.count({
      where: { aprobado: true }
    });

    // Si no hay equipos aprobados configurados, permitimos acceso (Modo de Instalación/Setup)
    if (totalAprobados === 0) {
      return next();
    }

    // 2. Si hay equipos aprobados, verificar si esta IP es uno de ellos
    const equipo = await prisma.equipo.findFirst({
      where: {
        ip: normalizedIP,
        aprobado: true
      }
    });

    if (!equipo) {
      logger.warn({ ip: normalizedIP }, '[SECURITY] Intento de acceso desde IP no autorizada');
      return res.status(403).json({
        error: 'Acceso No Autorizado',
        message: 'Este equipo no ha sido aprobado para acceder al sistema. Contacte al administrador.'
      });
    }

    // 3. Registrar última conexión
    await prisma.equipo.update({
      where: { id: equipo.id },
      data: { ultima_conexion: new Date() }
    });

    // Adjuntar info del equipo al request
    req.equipo = equipo;
    next();
  } catch (error) {
    logger.error({ err: error }, '[ERROR] En middleware de seguridad de red');
    next(); // Fallback: permitir acceso en caso de error de BD para no bloquear el sistema
  }
};

module.exports = { verifyNetworkClient };
