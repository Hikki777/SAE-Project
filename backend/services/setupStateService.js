/**
 * Setup State Service
 * Gestiona el estado de instalación/configuración inicial del sistema
 * Detecta si es primera ejecución y si el SetupWizard debe ejecutarse
 */

const fs = require('fs-extra');
const path = require('path');
const { logger } = require('../utils/logger');

const SETUP_CONFIG_PATH = path.join(process.env.APPDATA || process.env.HOME, 'SAE', 'setup-state.json');

const DEFAULT_SETUP_STATE = {
  version: '1.0.0',
  installed_at: null,
  setup_completed: false,
  setup_completed_at: null,
  institution_configured: false,
  admin_created: false,
  first_launch: true,
  installations: [],
  migrations_applied: [],
  last_database_check: null
};

class SetupStateService {
  /**
   * Obtener estado de setup actual
   */
  static async getSetupState() {
    try {
      if (fs.existsSync(SETUP_CONFIG_PATH)) {
        const content = await fs.readFile(SETUP_CONFIG_PATH, 'utf8');
        return JSON.parse(content);
      }
      return { ...DEFAULT_SETUP_STATE };
    } catch (error) {
      logger.warn({ error: error.message }, 'Error leyendo setup state, usando default');
      return { ...DEFAULT_SETUP_STATE };
    }
  }

  /**
   * Guardar estado de setup
   */
  static async updateSetupState(updates) {
    try {
      const current = await this.getSetupState();
      const updated = {
        ...current,
        ...updates,
        last_updated: new Date().toISOString()
      };

      await fs.ensureDir(path.dirname(SETUP_CONFIG_PATH));
      await fs.writeFile(SETUP_CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf8');
      logger.info({ updates }, 'Setup state actualizado');
      return updated;
    } catch (error) {
      logger.error({ error: error.message }, 'Error actualizando setup state');
      throw error;
    }
  }

  /**
   * Marcar como primera instalación
   */
  static async markFirstInstallation(version) {
    return this.updateSetupState({
      installed_at: new Date().toISOString(),
      first_launch: true,
      version
    });
  }

  /**
   * Marcar Setup Wizard como completado
   */
  static async markSetupWizardCompleted(institucionData) {
    return this.updateSetupState({
      setup_completed: true,
      setup_completed_at: new Date().toISOString(),
      institution_configured: true,
      admin_created: true,
      first_launch: false,
      institution_name: institucionData?.nombre,
      institution_id: institucionData?.id
    });
  }

  /**
   * ¿Debe mostrar SetupWizard?
   */
  static async shouldShowSetupWizard() {
    const state = await this.getSetupState();
    
    // Mostrar si:
    // 1. Es primera ejecución
    // 2. Setup wizard no fue completado
    // 3. No hay institución configurada
    
    return !state.setup_completed || !state.institution_configured;
  }

  /**
   * Marcar como ya levantada (primera ejecución terminada)
   */
  static async markFirstLaunchComplete() {
    const state = await this.getSetupState();
    return this.updateSetupState({
      first_launch: false,
      first_launch_completed_at: new Date().toISOString()
    });
  }

  /**
   * Resetear setup (para reinstalación)
   */
  static async resetSetupState() {
    try {
      await fs.remove(SETUP_CONFIG_PATH);
      logger.info('Setup state reseteado');
      return { ...DEFAULT_SETUP_STATE };
    } catch (error) {
      logger.error({ error: error.message }, 'Error resetando setup state');
      throw error;
    }
  }

  /**
   * Obtener historial de migraciones aplicadas
   */
  static async addMigrationRecord(migrationName, status = 'success', details = {}) {
    const state = await this.getSetupState();
    const migrationRecord = {
      name: migrationName,
      applied_at: new Date().toISOString(),
      status,
      details
    };
    
    if (!state.migrations_applied) state.migrations_applied = [];
    state.migrations_applied.push(migrationRecord);
    
    return this.updateSetupState({
      migrations_applied: state.migrations_applied,
      last_database_check: new Date().toISOString()
    });
  }

  /**
   * Obtener diagnóstico de setup
   */
  static async getDiagnostics() {
    const state = await this.getSetupState();
    const configPath = SETUP_CONFIG_PATH;
    const exists = fs.existsSync(configPath);

    return {
      setup_state_file_exists: exists,
      setup_state: state,
      diagnostics: {
        is_first_installation: state.installed_at === null,
        setup_wizard_needed: await this.shouldShowSetupWizard(),
        days_since_installation: state.installed_at 
          ? Math.floor((new Date() - new Date(state.installed_at)) / (1000 * 60 * 60 * 24))
          : null,
        migrations_count: state.migrations_applied?.length || 0,
        last_migration: state.migrations_applied?.[state.migrations_applied.length - 1]
      }
    };
  }
}

module.exports = SetupStateService;
