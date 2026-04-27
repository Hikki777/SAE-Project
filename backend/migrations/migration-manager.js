const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const { logger } = require('../utils/logger');

const versionConfigPath = path.join(__dirname, '../config/version.json');
const migrationsBackupDir = path.join(__dirname, '../config/migrations-backup');

// Helper para comparar versiones (v1 > v2)
function isNewer(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return true;
    if (p2 > p1) return false;
  }
  return false;
}

// Definir migraciones disponibles con rollback
const migrations = {
  '1.0.0': { 
    up: async (db) => {
      logger.info('Migración 1.0.0 aplicada (Base)');
    },
    down: async (db) => {
      logger.info('Rollback 1.0.0');
    },
    description: 'Base de datos inicial'
  },
  // Ejemplo para versiones futuras:
  // '1.1.0': {
  //   up: async (db) => { ... },
  //   down: async (db) => { ... },
  //   description: '...'
  // }
};

const MigrationManager = {
  /**
   * Obtener versión actual desde config
   */
  getCurrentVersion: () => {
    if (!fs.existsSync(versionConfigPath)) {
      return '0.0.0';
    }
    try {
      const config = JSON.parse(fs.readFileSync(versionConfigPath, 'utf8'));
      return config.version;
    } catch (e) {
      logger.error({ error: e }, 'Error leyendo versión actual');
      return '0.0.0';
    }
  },

  /**
   * Actualizar versión en config
   */
  updateVersionConfig: (newVersion, migrationDetails = {}) => {
    try {
      fse.ensureDirSync(path.dirname(versionConfigPath));
      
      let config = { version: '0.0.0', migrations: { completed: [], history: [] } };
      if (fs.existsSync(versionConfigPath)) {
        config = JSON.parse(fs.readFileSync(versionConfigPath, 'utf8'));
      }
      
      config.version = newVersion;
      config.lastUpdate = new Date().toISOString();
      
      if (!config.migrations.completed.includes(newVersion)) {
        config.migrations.completed.push(newVersion);
      }

      // Agregar al historial
      config.migrations.history.push({
        version: newVersion,
        timestamp: new Date().toISOString(),
        ...migrationDetails
      });

      // Mantener solo últimas 50 migraciones en historial
      if (config.migrations.history.length > 50) {
        config.migrations.history = config.migrations.history.slice(-50);
      }
      
      fs.writeFileSync(versionConfigPath, JSON.stringify(config, null, 2));
      logger.info({ version: newVersion }, 'Versión actualizada');
    } catch (error) {
      logger.error({ error: error.message }, 'Error actualizando versión');
      throw error;
    }
  },

  /**
   * Crear backup antes de migración
   */
  async createMigrationBackup(fromVersion) {
    try {
      fse.ensureDirSync(migrationsBackupDir);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `migration-${fromVersion}-${timestamp}.json`;
      const backupPath = path.join(migrationsBackupDir, backupName);
      
      const configContent = JSON.parse(fs.readFileSync(versionConfigPath, 'utf8'));
      fs.writeFileSync(backupPath, JSON.stringify(configContent, null, 2));
      
      logger.info({ backup: backupName }, 'Backup de migración creado');
      return backupPath;
    } catch (error) {
      logger.error({ error: error.message }, 'Error creando backup de migración');
      throw error;
    }
  },

  /**
   * Restaurar desde backup de migración
   */
  async restoreMigrationBackup(backupPath) {
    try {
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup no encontrado: ${backupPath}`);
      }

      const backupContent = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      fse.ensureDirSync(path.dirname(versionConfigPath));
      fs.writeFileSync(versionConfigPath, JSON.stringify(backupContent, null, 2));
      
      logger.info({ backup: path.basename(backupPath) }, 'Backup de migración restaurado');
      return backupContent.version;
    } catch (error) {
      logger.error({ error: error.message }, 'Error restaurando backup');
      throw error;
    }
  },

  /**
   * Ejecutar migraciones con validación y rollback
   */
  runMigrations: async (fromVersion, targetVersion, options = {}) => {
    const { 
      validateIntegrity = true, 
      autorollback = true,
      DbValidator = null 
    } = options;

    const result = {
      success: false,
      fromVersion,
      targetVersion,
      appliedMigrations: [],
      errors: [],
      backupPath: null,
      startTime: new Date()
    };

    try {
      logger.info({ from: fromVersion, to: targetVersion }, 'Iniciando migraciones');

      // 1. Validar integridad ANTES de migrar (opcional)
      if (validateIntegrity && DbValidator) {
        logger.info('Validando integridad de BD antes de migraciones...');
        const integrityCheck = await DbValidator.validateFullIntegrity();
        
        if (!integrityCheck.valid) {
          result.errors.push('Validación de integridad falló');
          if (integrityCheck.checks.alumnos?.orphans?.length > 0) {
            result.errors.push(`Alumnos huérfanos detectados: ${integrityCheck.checks.alumnos.orphans.length}`);
          }
          throw new Error('BD en estado inconsistente antes de migración');
        }
        logger.info('✓ Integridad validada');
      }

      // 2. Crear backup de versión actual
      try {
        result.backupPath = await this.createMigrationBackup(fromVersion);
      } catch (backupError) {
        logger.warn('No se pudo crear backup, continuando sin rollback...');
      }

      // 3. Obtener y ordenar migraciones a aplicar
      const versions = Object.keys(migrations).sort((a, b) => isNewer(a, b) ? 1 : -1);
      const toApply = versions.filter(v => isNewer(v, fromVersion) && !isNewer(v, targetVersion));

      if (toApply.length === 0) {
        logger.info('No hay migraciones pendientes');
        result.success = true;
        result.appliedMigrations = [];
        return result;
      }

      logger.info({ count: toApply.length }, `Ejecutando ${toApply.length} migraciones...`);

      // 4. Aplicar migraciones una por una
      for (const version of toApply) {
        try {
          logger.info({ version }, `Aplicando migración ${version}...`);
          
          const migration = migrations[version];
          if (migration.up) {
            await migration.up();
          }

          this.updateVersionConfig(version, {
            status: 'completed',
            description: migration.description || ''
          });

          result.appliedMigrations.push(version);
          logger.info({ version }, `✓ Migración ${version} completada`);
        } catch (error) {
          logger.error({ version, error: error.message }, `✗ Error en migración ${version}`);
          result.errors.push(`Migración ${version}: ${error.message}`);

          // Rollback si está habilitado
          if (autorollback && result.backupPath) {
            logger.warn('Iniciando rollback automático...');
            try {
              const rolledBackVersion = await this.restoreMigrationBackup(result.backupPath);
              logger.info({ restored: rolledBackVersion }, '✓ Rollback exitoso');
              result.errors.push(`Rollback a versión ${rolledBackVersion}`);
            } catch (rollbackError) {
              logger.error({ error: rollbackError.message }, '✗ Error en rollback');
              result.errors.push(`Error crítico en rollback: ${rollbackError.message}`);
            }
          }

          throw error; // Relanzar para salir del bucle
        }
      }

      // 5. Validación final (opcional)
      if (validateIntegrity && DbValidator) {
        logger.info('Validando integridad de BD después de migraciones...');
        const finalCheck = await DbValidator.validateFullIntegrity();
        
        if (!finalCheck.valid) {
          result.errors.push('Validación final de integridad falló');
          throw new Error('BD inconsistente después de migraciones');
        }
        logger.info('✓ Integridad final validada');
      }

      result.success = true;
      result.endTime = new Date();
      result.duration = result.endTime - result.startTime;

      logger.info(
        { 
          migrations: result.appliedMigrations,
          duration: `${result.duration}ms`
        },
        '✓ Migraciones completadas exitosamente'
      );

      return result;
    } catch (error) {
      result.success = false;
      result.endTime = new Date();
      logger.error(
        { 
          error: error.message,
          migrations: result.appliedMigrations,
          errors: result.errors
        },
        '✗ Error en ejecución de migraciones'
      );
      return result;
    }
  },

  /**
   * Obtener historial de migraciones
   */
  getMigrationHistory: () => {
    try {
      if (!fs.existsSync(versionConfigPath)) {
        return [];
      }
      const config = JSON.parse(fs.readFileSync(versionConfigPath, 'utf8'));
      return config.migrations?.history || [];
    } catch (error) {
      logger.error({ error: error.message }, 'Error leyendo historial');
      return [];
    }
  },

  /**
   * Obtener información de migraciones disponibles
   */
  getAvailableMigrations: () => {
    return Object.entries(migrations).map(([version, config]) => ({
      version,
      description: config.description || '',
      hasUp: !!config.up,
      hasDown: !!config.down
    }));
  }
};

module.exports = MigrationManager;
