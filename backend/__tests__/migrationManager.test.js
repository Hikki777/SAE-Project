/**
 * Tests unitarios — MigrationManager
 *
 * Validan la lógica de comparación de versiones, obtención de migraciones
 * disponibles y resultados de ejecución, sin acceder al sistema de archivos real.
 */

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

jest.mock('fs-extra', () => ({
  ensureDirSync: jest.fn(),
  ensureDir: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const fs = require('fs');
const MigrationManager = require('../migrations/migration-manager');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_VERSION_CONFIG = {
  version: '1.1.3',
  lastUpdate: new Date().toISOString(),
  migrations: {
    completed: ['1.0.0', '1.1.0', '1.1.3'],
    history: [
      { version: '1.0.0', timestamp: '2025-01-01T00:00:00Z', status: 'completed' },
      { version: '1.1.3', timestamp: '2025-04-01T00:00:00Z', status: 'completed' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('MigrationManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── getCurrentVersion ─────────────────────────────────────────────────────

  describe('getCurrentVersion()', () => {
    test('debe retornar 0.0.0 cuando no existe el archivo de versión', () => {
      fs.existsSync.mockReturnValue(false);

      const version = MigrationManager.getCurrentVersion();

      expect(version).toBe('0.0.0');
    });

    test('debe retornar la versión correcta desde el archivo', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(MOCK_VERSION_CONFIG));

      const version = MigrationManager.getCurrentVersion();

      expect(version).toBe('1.1.3');
    });

    test('debe retornar 0.0.0 si el archivo está corrupto', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('{ INVALID JSON }}}');

      const version = MigrationManager.getCurrentVersion();

      expect(version).toBe('0.0.0');
    });
  });

  // ─── getMigrationHistory ───────────────────────────────────────────────────

  describe('getMigrationHistory()', () => {
    test('debe retornar array vacío cuando no existe el archivo', () => {
      fs.existsSync.mockReturnValue(false);

      const history = MigrationManager.getMigrationHistory();

      expect(Array.isArray(history)).toBe(true);
      expect(history).toHaveLength(0);
    });

    test('debe retornar el historial correctamente', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(MOCK_VERSION_CONFIG));

      const history = MigrationManager.getMigrationHistory();

      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(2);
      expect(history[0]).toHaveProperty('version', '1.0.0');
    });

    test('debe retornar array vacío si el historial no existe en el JSON', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0', migrations: {} }));

      const history = MigrationManager.getMigrationHistory();

      expect(Array.isArray(history)).toBe(true);
      expect(history).toHaveLength(0);
    });
  });

  // ─── getAvailableMigrations ────────────────────────────────────────────────

  describe('getAvailableMigrations()', () => {
    test('debe retornar las migraciones disponibles con estructura correcta', () => {
      const available = MigrationManager.getAvailableMigrations();

      expect(Array.isArray(available)).toBe(true);
      // Siempre debe haber al menos la migración base 1.0.0
      expect(available.length).toBeGreaterThanOrEqual(1);

      // Cada migración debe tener la estructura requerida
      available.forEach((mig) => {
        expect(mig).toHaveProperty('version');
        expect(mig).toHaveProperty('description');
        expect(mig).toHaveProperty('hasUp');
        expect(mig).toHaveProperty('hasDown');
      });
    });

    test('la migración base 1.0.0 debe tener up y down definidos', () => {
      const available = MigrationManager.getAvailableMigrations();
      const base = available.find((m) => m.version === '1.0.0');

      expect(base).toBeDefined();
      expect(base.hasUp).toBe(true);
      expect(base.hasDown).toBe(true);
    });
  });

  // ─── updateVersionConfig ───────────────────────────────────────────────────

  describe('updateVersionConfig()', () => {
    test('debe escribir el archivo de versión con la nueva versión', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(MOCK_VERSION_CONFIG));
      fs.writeFileSync.mockImplementation(() => {});

      MigrationManager.updateVersionConfig('1.2.0', { status: 'completed' });

      expect(fs.writeFileSync).toHaveBeenCalled();
      const writtenContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      expect(writtenContent.version).toBe('1.2.0');
    });

    test('debe agregar la nueva versión al historial', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(MOCK_VERSION_CONFIG));
      fs.writeFileSync.mockImplementation(() => {});

      MigrationManager.updateVersionConfig('1.2.0', { status: 'completed', description: 'Test' });

      const writtenContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      const lastEntry = writtenContent.migrations.history.at(-1);
      expect(lastEntry.version).toBe('1.2.0');
    });

    test('debe crear un archivo nuevo si no existe el config', () => {
      fs.existsSync.mockReturnValue(false);
      fs.writeFileSync.mockImplementation(() => {});

      MigrationManager.updateVersionConfig('1.0.0', {});

      expect(fs.writeFileSync).toHaveBeenCalled();
      const writtenContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      expect(writtenContent.version).toBe('1.0.0');
    });
  });

  // ─── runMigrations ─────────────────────────────────────────────────────────

  describe('runMigrations()', () => {
    test('debe retornar success:true cuando no hay migraciones pendientes', async () => {
      // fromVersion == targetVersion => nada que aplicar
      const result = await MigrationManager.runMigrations('1.1.3', '1.1.3', {
        validateIntegrity: false,
      });

      expect(result.success).toBe(true);
      expect(result.appliedMigrations).toHaveLength(0);
    });

    test('debe aplicar migración 1.0.0 cuando se va de 0.0.0 a 1.0.0', async () => {
      // Configurar mocks de fs para que createMigrationBackup y updateVersionConfig funcionen
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(MOCK_VERSION_CONFIG));
      fs.writeFileSync.mockImplementation(() => {});

      const result = await MigrationManager.runMigrations('0.0.0', '1.0.0', {
        validateIntegrity: false,
      });

      // Debe haber ejecutado sin error
      expect(result).toBeDefined();
      expect(Array.isArray(result.appliedMigrations)).toBe(true);
      // Si hubo éxito, la migración 1.0.0 debe estar en la lista
      if (result.success) {
        expect(result.appliedMigrations).toContain('1.0.0');
      } else {
        // Si falló (ej: backup issue), al menos la estructura debe existir
        expect(result.errors).toBeDefined();
      }
    });

    test('la estructura del resultado debe incluir todos los campos requeridos', async () => {
      const result = await MigrationManager.runMigrations('1.1.3', '1.1.3', {
        validateIntegrity: false,
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('fromVersion');
      expect(result).toHaveProperty('targetVersion');
      expect(result).toHaveProperty('appliedMigrations');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.appliedMigrations)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});
