/**
 * Tests unitarios — SetupStateService
 *
 * Validan la lógica del servicio de estado de setup sin acceder
 * al sistema de archivos real.
 *
 * NOTA: El service usa 'fs-extra' pero llama a:
 *   - fs.existsSync  (sincrono)
 *   - fs.readFile    (async, nativo de fs-extra re-exportado)
 *   - fs.writeFile   (async, nativo de fs-extra re-exportado)
 *   - fs.ensureDir   (async, propio de fs-extra)
 *   - fs.remove      (async, propio de fs-extra)
 */

// Mock de fs-extra con las funciones que realmente usa el servicio
jest.mock('fs-extra', () => ({
  existsSync:   jest.fn(),
  readFile:     jest.fn(),
  writeFile:    jest.fn().mockResolvedValue(undefined),
  ensureDir:    jest.fn().mockResolvedValue(undefined),
  remove:       jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const fs = require('fs-extra');
const SetupStateService = require('../services/setupStateService');

// ─────────────────────────────────────────────────────────────────────────────
// Estados de mock
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_STATE_INITIAL = JSON.stringify({
  version: '1.0.0',
  installed_at: null,
  setup_completed: false,
  setup_completed_at: null,
  institution_configured: false,
  admin_created: false,
  first_launch: true,
});

const MOCK_STATE_COMPLETED = JSON.stringify({
  version: '1.0.0',
  installed_at: '2025-01-01T00:00:00Z',
  setup_completed: true,
  setup_completed_at: '2025-01-01T01:00:00Z',
  institution_configured: true,
  admin_created: true,
  first_launch: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('SetupStateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── shouldShowSetupWizard ─────────────────────────────────────────────────

  describe('shouldShowSetupWizard()', () => {
    test('debe retornar true cuando el archivo no existe (primera instalación)', async () => {
      fs.existsSync.mockReturnValue(false);

      const result = await SetupStateService.shouldShowSetupWizard();

      expect(result).toBe(true);
    });

    test('debe retornar true cuando setup_completed es false', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_INITIAL);

      const result = await SetupStateService.shouldShowSetupWizard();

      expect(result).toBe(true);
    });

    test('debe retornar false cuando setup ya fue completado', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_COMPLETED);

      const result = await SetupStateService.shouldShowSetupWizard();

      expect(result).toBe(false);
    });

    test('debe retornar true si el archivo está corrupto (JSON inválido)', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue('{ INVALID JSON }}}');

      const result = await SetupStateService.shouldShowSetupWizard();

      // Ante error de parseo, debe mostrar setup por seguridad
      expect(result).toBe(true);
    });
  });

  // ─── getSetupState ─────────────────────────────────────────────────────────

  describe('getSetupState()', () => {
    test('debe retornar estado por defecto cuando no existe el archivo', async () => {
      fs.existsSync.mockReturnValue(false);

      const state = await SetupStateService.getSetupState();

      expect(state).toBeDefined();
      expect(state.setup_completed).toBe(false);
      expect(state.first_launch).toBe(true);
    });

    test('debe retornar el estado guardado correctamente', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_COMPLETED);

      const state = await SetupStateService.getSetupState();

      expect(state.setup_completed).toBe(true);
      expect(state.institution_configured).toBe(true);
      expect(state.first_launch).toBe(false);
    });

    test('debe retornar estado con todas las propiedades requeridas', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_COMPLETED);

      const state = await SetupStateService.getSetupState();

      ['setup_completed', 'first_launch', 'institution_configured'].forEach((prop) => {
        expect(state).toHaveProperty(prop);
      });
    });

    test('debe usar estado por defecto si el JSON está corrupto', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue('CORRUPTED JSON');

      const state = await SetupStateService.getSetupState();

      expect(state.setup_completed).toBe(false);
    });
  });

  // ─── markSetupWizardCompleted ──────────────────────────────────────────────

  describe('markSetupWizardCompleted()', () => {
    test('debe escribir setup_completed: true', async () => {
      // getSetupState necesita existsSync+readFile, updateSetupState necesita writeFile+ensureDir
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_INITIAL);

      await SetupStateService.markSetupWizardCompleted({ nombre: 'Test School', id: 1 });

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writtenContent.setup_completed).toBe(true);
      expect(writtenContent.first_launch).toBe(false);
      expect(writtenContent.institution_configured).toBe(true);
    });

    test('debe incluir setup_completed_at como fecha ISO', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_INITIAL);

      const before = new Date();
      await SetupStateService.markSetupWizardCompleted();
      const after = new Date();

      const writtenContent = JSON.parse(fs.writeFile.mock.calls[0][1]);
      const ts = new Date(writtenContent.setup_completed_at);
      expect(ts >= before && ts <= after).toBe(true);
    });

    test('debe incluir el nombre e id de la institución si se proveen', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_INITIAL);

      await SetupStateService.markSetupWizardCompleted({ nombre: 'Instituto Nacional', id: 42 });

      const writtenContent = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writtenContent.institution_name).toBe('Instituto Nacional');
      expect(writtenContent.institution_id).toBe(42);
    });
  });

  // ─── updateSetupState ──────────────────────────────────────────────────────

  describe('updateSetupState()', () => {
    test('debe fusionar updates con el estado actual', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_INITIAL);

      await SetupStateService.updateSetupState({ admin_created: true });

      const writtenContent = JSON.parse(fs.writeFile.mock.calls[0][1]);
      // Debe tener el campo nuevo
      expect(writtenContent.admin_created).toBe(true);
      // Y mantener los existentes
      expect(writtenContent.version).toBe('1.0.0');
    });

    test('debe agregar last_updated en cada actualización', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_INITIAL);

      await SetupStateService.updateSetupState({ admin_created: true });

      const writtenContent = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writtenContent).toHaveProperty('last_updated');
      expect(new Date(writtenContent.last_updated).toString()).not.toBe('Invalid Date');
    });
  });

  // ─── getDiagnostics ────────────────────────────────────────────────────────

  describe('getDiagnostics()', () => {
    test('debe retornar objeto de diagnóstico estructurado', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_COMPLETED);

      const diag = await SetupStateService.getDiagnostics();

      expect(diag).toHaveProperty('setup_state_file_exists', true);
      expect(diag).toHaveProperty('setup_state');
      expect(diag).toHaveProperty('diagnostics');
    });

    test('debe indicar setup_wizard_needed: false cuando completado', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue(MOCK_STATE_COMPLETED);

      const diag = await SetupStateService.getDiagnostics();

      expect(diag.diagnostics.setup_wizard_needed).toBe(false);
    });

    test('no debe lanzar excepción aunque el archivo no exista', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(SetupStateService.getDiagnostics()).resolves.toBeDefined();
    });
  });
});
