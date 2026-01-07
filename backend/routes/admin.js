const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const { verifyJWT, verifyAdmin } = require('../middlewares/auth');
const { logger } = require('../utils/logger');

// Middleware de seguridad
router.use(verifyJWT);
router.use(verifyAdmin);

/**
 * POST /api/admin/reset-factory
 * Reiniciar sistema borrando datos transaccionales, manteniendo configuración y usuarios
 */
router.post('/reset-factory', async (req, res) => {
  try {
    const { masterKey } = req.body;
    
    if (!masterKey) {
      return res.status(400).json({ error: 'Se requiere la Clave Maestra de Recuperación para confirmar el reset' });
    }

    // Obtener la clave maestra de la institución
    const institucion = await prisma.institucion.findFirst({
      select: { master_recovery_key: true }
    });

    if (!institucion || !institucion.master_recovery_key) {
      return res.status(500).json({ error: 'No se ha configurado una clave maestra en el sistema' });
    }

    // Verificar clave usando bcrypt.compare (ahora se almacena hasheada)
    const isValid = await bcrypt.compare(masterKey.trim(), institucion.master_recovery_key);
    
    if (!isValid) {
      logger.warn({ user: req.user.id }, '[WARNING] Intento de reset de fábrica con Clave Maestra incorrecta');
      return res.status(401).json({ error: 'Clave Maestra incorrecta' });
    }

    logger.warn({ user: req.user.id }, '[WARNING] INICIANDO RESET DE FÁBRICA CON CLAVE MAESTRA');

    await prisma.$transaction([
      // 1. Borrar datos transaccionales
      prisma.asistencia.deleteMany(),
      prisma.excusa.deleteMany(),
      prisma.codigoQr.deleteMany(),
      prisma.diagnosticResult.deleteMany(),
      prisma.auditoria.deleteMany(), 

      // 2. Borrar entidades (Alumnos, Personal)
      prisma.alumno.deleteMany(),
      prisma.personal.deleteMany(),

      // 3. Opcional: Podríamos querer actualizar 'inicializado' a false si se quisiera un reinicio TOTAL del wizard, 
      // pero el usuario especificó "mantener configuración y usuarios".
    ]);

    logger.info('[SUCCESS] Sistema restablecido de fábrica exitosamente');
    res.json({ success: true, message: 'Sistema restablecido correctamente' });

  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error en Factory Reset');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
