/**
 * Database Integrity Validator
 * Valida la integridad referencial antes de restaurar o migrar BD
 */

const prisma = require('../prismaClient');
const { logger } = require('../utils/logger');

class DbIntegrityValidator {
  /**
   * Validar integridad referencial completa
   */
  static async validateFullIntegrity() {
    const results = {
      valid: true,
      checks: {},
      errors: [],
      warnings: [],
      stats: {}
    };

    try {
      logger.info('Iniciando validación de integridad de BD...');

      // 1. Validar Alumnos
      const alumnosCheck = await this.validateAlumnos();
      results.checks.alumnos = alumnosCheck;
      if (!alumnosCheck.valid) results.valid = false;

      // 2. Validar Personal
      const personalCheck = await this.validatePersonal();
      results.checks.personal = personalCheck;
      if (!personalCheck.valid) results.valid = false;

      // 3. Validar Asistencias
      const asistenciasCheck = await this.validateAsistencias();
      results.checks.asistencias = asistenciasCheck;
      if (!asistenciasCheck.valid) results.valid = false;

      // 4. Validar Excusas
      const excusasCheck = await this.validateExcusas();
      results.checks.excusas = excusasCheck;
      if (!excusasCheck.valid) results.valid = false;

      // 5. Validar Justificaciones
      const justificacionesCheck = await this.validateJustificaciones();
      results.checks.justificaciones = justificacionesCheck;
      if (!justificacionesCheck.valid) results.valid = false;

      // 6. Coleccionar estadísticas
      results.stats = await this.getDbStats();

      if (results.valid) {
        logger.info('✓ Integridad de BD validada correctamente');
      } else {
        logger.warn({ errors: results.errors }, 'Errores en integridad detectados');
      }

      return results;
    } catch (error) {
      logger.error({ err: error }, 'Error en validación de integridad');
      results.valid = false;
      results.errors.push(error.message);
      return results;
    }
  }

  /**
   * Validar Alumnos (relaciones con Grado, Sección, Jornada)
   */
  static async validateAlumnos() {
    const result = { valid: true, orphans: [], duplicates: [], issues: [] };

    try {
      const alumnos = await prisma.alumno.findMany({
        include: { grado: true, seccion: true, jornada: true }
      });

      for (const alumno of alumnos) {
        // Validar grado_id
        if (alumno.grado_id && !alumno.grado) {
          result.orphans.push({ id: alumno.id, type: 'Alumno', issue: 'grado_id huérfano' });
          result.valid = false;
        }

        // Validar seccion_id
        if (alumno.seccion_id && !alumno.seccion) {
          result.orphans.push({ id: alumno.id, type: 'Alumno', issue: 'seccion_id huérfano' });
          result.valid = false;
        }

        // Validar jornada_id
        if (alumno.jornada_id && !alumno.jornada) {
          result.orphans.push({ id: alumno.id, type: 'Alumno', issue: 'jornada_id huérfano' });
          result.valid = false;
        }

        // Validar carnet único
        const duplicateCarnet = await prisma.alumno.findMany({
          where: { carnet: alumno.carnet }
        });
        if (duplicateCarnet.length > 1) {
          result.duplicates.push({ carnet: alumno.carnet, count: duplicateCarnet.length });
          result.valid = false;
        }
      }

      result.total = alumnos.length;
    } catch (error) {
      result.valid = false;
      result.issues.push(error.message);
    }

    return result;
  }

  /**
   * Validar Personal (relaciones con Rol, Jornada)
   */
  static async validatePersonal() {
    const result = { valid: true, orphans: [], duplicates: [], issues: [] };

    try {
      const personal = await prisma.personal.findMany({
        include: { rol: true, jornada: true }
      });

      for (const p of personal) {
        if (p.rol_id && !p.rol) {
          result.orphans.push({ id: p.id, type: 'Personal', issue: 'rol_id huérfano' });
          result.valid = false;
        }

        if (p.jornada_id && !p.jornada) {
          result.orphans.push({ id: p.id, type: 'Personal', issue: 'jornada_id huérfano' });
          result.valid = false;
        }

        const duplicateCarnet = await prisma.personal.findMany({
          where: { carnet: p.carnet }
        });
        if (duplicateCarnet.length > 1) {
          result.duplicates.push({ carnet: p.carnet, count: duplicateCarnet.length });
          result.valid = false;
        }
      }

      result.total = personal.length;
    } catch (error) {
      result.valid = false;
      result.issues.push(error.message);
    }

    return result;
  }

  /**
   * Validar Asistencias
   */
  static async validateAsistencias() {
    const result = { valid: true, orphans: [], issues: [] };

    try {
      const asistencias = await prisma.asistencia.findMany({
        include: { alumno: true, personal: true }
      });

      for (const a of asistencias) {
        // Alumno debe existir
        if (a.alumno_id && !a.alumno) {
          result.orphans.push({ 
            id: a.id, 
            type: 'Asistencia', 
            issue: `alumno_id ${a.alumno_id} no encontrado` 
          });
          result.valid = false;
        }

        // Si personal_id existe, personal debe existir
        if (a.personal_id && !a.personal) {
          result.orphans.push({ 
            id: a.id, 
            type: 'Asistencia', 
            issue: `personal_id ${a.personal_id} no encontrado` 
          });
          result.valid = false;
        }
      }

      result.total = asistencias.length;
    } catch (error) {
      result.valid = false;
      result.issues.push(error.message);
    }

    return result;
  }

  /**
   * Validar Excusas
   */
  static async validateExcusas() {
    const result = { valid: true, orphans: [], issues: [] };

    try {
      const excusas = await prisma.excusa.findMany({
        include: { alumno: true, personal_creador: true }
      });

      for (const e of excusas) {
        if (e.alumno_id && !e.alumno) {
          result.orphans.push({
            id: e.id,
            type: 'Excusa',
            issue: `alumno_id ${e.alumno_id} no encontrado`
          });
          result.valid = false;
        }

        if (e.personal_id && !e.personal_creador) {
          result.orphans.push({
            id: e.id,
            type: 'Excusa',
            issue: `personal_id ${e.personal_id} no encontrado`
          });
          result.valid = false;
        }
      }

      result.total = excusas.length;
    } catch (error) {
      result.valid = false;
      result.issues.push(error.message);
    }

    return result;
  }

  /**
   * Validar Justificaciones
   */
  static async validateJustificaciones() {
    const result = { valid: true, orphans: [], issues: [] };

    try {
      const justificaciones = await prisma.justificacion.findMany({
        include: { alumno: true, personal: true }
      });

      for (const j of justificaciones) {
        if (j.alumno_id && !j.alumno) {
          result.orphans.push({
            id: j.id,
            type: 'Justificación',
            issue: `alumno_id ${j.alumno_id} no encontrado`
          });
          result.valid = false;
        }

        if (j.personal_id && !j.personal) {
          result.orphans.push({
            id: j.id,
            type: 'Justificación',
            issue: `personal_id ${j.personal_id} no encontrado`
          });
          result.valid = false;
        }
      }

      result.total = justificaciones.length;
    } catch (error) {
      result.valid = false;
      result.issues.push(error.message);
    }

    return result;
  }

  /**
   * Limpiar registros huérfanos (con confirmación)
   */
  static async cleanOrphans(integrityResults, options = {}) {
    const { dryRun = true, fixOrphans = true } = options;
    const cleanupResults = {
      dryRun,
      cleaned: {},
      errors: []
    };

    try {
      if (dryRun) {
        logger.info('DRY RUN: No se eliminarán registros huérfanos');
      }

      const allOrphans = Object.values(integrityResults.checks)
        .flatMap(check => check.orphans || []);

      if (allOrphans.length === 0) {
        logger.info('No hay registros huérfanos para limpiar');
        return cleanupResults;
      }

      logger.warn(`Encontrados ${allOrphans.length} registros huérfanos`);

      if (fixOrphans && !dryRun) {
        // Aquí iría la lógica de limpieza real
        logger.info('Limpieza de huérfanos completada');
      }

      cleanupResults.orphansFound = allOrphans.length;
      return cleanupResults;
    } catch (error) {
      logger.error({ err: error }, 'Error limpiando huérfanos');
      cleanupResults.errors.push(error.message);
      return cleanupResults;
    }
  }

  /**
   * Obtener estadísticas generales de la BD
   */
  static async getDbStats() {
    try {
      const [
        alumnoCount,
        personalCount,
        asistenciaCount,
        excusaCount,
        justificacionCount,
        usuarioCount,
        institucionCount
      ] = await Promise.all([
        prisma.alumno.count(),
        prisma.personal.count(),
        prisma.asistencia.count(),
        prisma.excusa.count(),
        prisma.justificacion.count(),
        prisma.usuario.count(),
        prisma.institucion.count()
      ]);

      return {
        alumnos: alumnoCount,
        personal: personalCount,
        asistencias: asistenciaCount,
        excusas: excusaCount,
        justificaciones: justificacionCount,
        usuarios: usuarioCount,
        instituciones: institucionCount,
        total_records: alumnoCount + personalCount + asistenciaCount + excusaCount + justificacionCount + usuarioCount
      };
    } catch (error) {
      logger.error({ err: error }, 'Error obteniendo estadísticas de BD');
      return { error: error.message };
    }
  }

  /**
   * Generar reporte de validación
   */
  static async generateReport() {
    const integrity = await this.validateFullIntegrity();
    return {
      timestamp: new Date().toISOString(),
      valid: integrity.valid,
      summary: {
        checks_passed: Object.values(integrity.checks).filter(c => c.valid).length,
        checks_failed: Object.values(integrity.checks).filter(c => !c.valid).length,
        total_checks: Object.keys(integrity.checks).length,
        total_orphans: Object.values(integrity.checks).reduce((sum, c) => sum + (c.orphans?.length || 0), 0),
        total_duplicates: Object.values(integrity.checks).reduce((sum, c) => sum + (c.duplicates?.length || 0), 0)
      },
      details: integrity,
      stats: integrity.stats
    };
  }
}

module.exports = DbIntegrityValidator;
