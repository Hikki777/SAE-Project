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
    logger.debug({ user: req.user.id }, '[DEBUG_RESET] Validando Clave Maestra de recuperación');
    
    const isValid = await bcrypt.compare(masterKey.trim(), institucion.master_recovery_key);
    logger.debug({ user: req.user.id, isValid }, '[DEBUG_RESET] Resultado de validación');

    if (!isValid) {
      logger.warn({ user: req.user.id }, '[WARNING] Intento de reset de fábrica con Clave Maestra incorrecta');
      return res.status(401).json({ 
        error: 'Clave Maestra incorrecta. Verifique la clave generada durante el SetupWizard.'
      });
    }

    logger.warn({ user: req.user.id }, '[WARNING] INICIANDO RESET DE FÁBRICA CON CLAVE MAESTRA');

    await prisma.$transaction([
      // 1. Borrar datos transaccionales
      prisma.historialAcademico.deleteMany(),
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

/**
 * ─────────────────────────────────────────────────────────
 * RUTAS DE INTEGRIDAD Y DIAGNÓSTICO DE BD
 * ─────────────────────────────────────────────────────────
 */

const DbIntegrityValidator = require('../services/dbIntegrityValidator');
const SetupStateService = require('../services/setupStateService');
const MigrationManager = require('../migrations/migration-manager');

/**
 * GET /api/admin/db/integrity
 * Validar integridad de la base de datos
 */
router.get('/db/integrity', async (req, res) => {
  try {
    logger.info({ user: req.user.email }, 'Iniciando validación de integridad');
    const report = await DbIntegrityValidator.generateReport();
    
    res.json({
      valid: report.valid,
      summary: report.summary,
      details: report.details,
      stats: report.stats,
      timestamp: report.timestamp
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error en validación de integridad');
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/db/diagnostics
 * Obtener diagnóstico completo del sistema
 */
router.get('/db/diagnostics', async (req, res) => {
  try {
    const setupDiag = await SetupStateService.getDiagnostics();
    const migrations = MigrationManager.getMigrationHistory();
    const integrityReport = await DbIntegrityValidator.generateReport();

    res.json({
      setup: setupDiag,
      migrations: {
        current_version: MigrationManager.getCurrentVersion(),
        history: migrations,
        available: MigrationManager.getAvailableMigrations()
      },
      integrity: integrityReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error en diagnóstico');
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/db/validate-compatibility
 * Validar compatibilidad antes de restaurar backup
 */
router.post('/db/validate-compatibility', async (req, res) => {
  try {
    const { backupVersion } = req.body;
    
    if (!backupVersion) {
      return res.status(400).json({ error: 'backupVersion requerido' });
    }

    const currentVersion = MigrationManager.getCurrentVersion();
    
    // Verificar compatibilidad
    const isCompatible = !backupVersion.startsWith('0.'); // Rechazar v0.x.x

    res.json({
      compatible: isCompatible,
      currentVersion,
      backupVersion,
      message: isCompatible 
        ? 'Backup compatible, puede restaurarse'
        : 'Backup incompatible con esta versión',
      action: isCompatible ? 'proceed' : 'reject'
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error validando compatibilidad');
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/setup/state
 * Obtener estado de setup
 */
router.get('/setup/state', async (req, res) => {
  try {
    const state = await SetupStateService.getSetupState();
    const shouldShowWizard = await SetupStateService.shouldShowSetupWizard();

    res.json({
      ...state,
      shouldShowWizard,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error leyendo setup state');
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/setup/complete
 * Marcar setup como completado
 */
router.post('/setup/complete', async (req, res) => {
  try {
    const { institucionData } = req.body;
    
    const updated = await SetupStateService.markSetupWizardCompleted(institucionData);
    
    logger.info({ user: req.user.email }, 'Setup wizard marcado como completado');

    res.json({
      success: true,
      state: updated,
      message: 'Setup completado exitosamente'
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error completando setup');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
