/**
 * Tests unitarios — DbIntegrityValidator
 *
 * Validan la lógica de verificación de integridad referencial sin
 * necesidad de una BD real, usando mocks de Prisma.
 */

// Mock de Prisma antes de cualquier import
jest.mock('../prismaClient', () => ({
  alumno:        { findMany: jest.fn(), count: jest.fn() },
  personal:      { findMany: jest.fn(), count: jest.fn() },
  asistencia:    { findMany: jest.fn(), count: jest.fn() },
  excusa:        { findMany: jest.fn(), count: jest.fn() },
  justificacion: { findMany: jest.fn(), count: jest.fn() },
  usuario:       { findMany: jest.fn(), count: jest.fn() },
  institucion:   { findMany: jest.fn(), count: jest.fn() },
  codigoQr:      { findMany: jest.fn() },
}));

jest.mock('../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const prisma = require('../prismaClient');
const DbIntegrityValidator = require('../services/dbIntegrityValidator');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Configurar mocks "limpios" (sin datos = sin problemas)
// ─────────────────────────────────────────────────────────────────────────────
function setupCleanMocks() {
  // findMany vacío = no hay registros = no hay problemas de integridad
  prisma.alumno.findMany.mockResolvedValue([]);
  prisma.personal.findMany.mockResolvedValue([]);
  prisma.asistencia.findMany.mockResolvedValue([]);
  prisma.excusa.findMany.mockResolvedValue([]);
  prisma.justificacion.findMany.mockResolvedValue([]);
  prisma.usuario.findMany.mockResolvedValue([]);
  prisma.institucion.findMany.mockResolvedValue([]);
  // count para stats
  prisma.alumno.count.mockResolvedValue(0);
  prisma.personal.count.mockResolvedValue(0);
  prisma.asistencia.count.mockResolvedValue(0);
  prisma.excusa.count.mockResolvedValue(0);
  prisma.justificacion.count.mockResolvedValue(0);
  prisma.usuario.count.mockResolvedValue(0);
  prisma.institucion.count.mockResolvedValue(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('DbIntegrityValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupCleanMocks();
  });

  // ─── validateFullIntegrity ─────────────────────────────────────────────────

  describe('validateFullIntegrity()', () => {
    test('debe retornar válido cuando no hay registros', async () => {
      const result = await DbIntegrityValidator.validateFullIntegrity();

      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('debe retornar estructura correcta en el resultado', async () => {
      const result = await DbIntegrityValidator.validateFullIntegrity();

      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('checks');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('stats');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    test('debe retornar valid:false si hay una asistencia con alumno_id huérfano', async () => {
      // Una asistencia que tiene alumno_id pero alumno=null (huérfano)
      prisma.asistencia.findMany.mockResolvedValue([
        { id: 1, alumno_id: 99, alumno: null, personal_id: null, personal: null }
      ]);

      const result = await DbIntegrityValidator.validateFullIntegrity();

      expect(result.valid).toBe(false);
      expect(result.checks.asistencias.orphans.length).toBeGreaterThan(0);
    });

    test('debe marcar invalid si un alumno tiene carnet duplicado', async () => {
      const alumno = { id: 1, carnet: 'A001', grado_id: null, seccion_id: null, jornada_id: null, grado: null, seccion: null, jornada: null };
      // findMany para el alumno y para la búsqueda de carnet duplicado
      prisma.alumno.findMany
        .mockResolvedValueOnce([alumno])               // validateAlumnos: listar todos
        .mockResolvedValue([alumno, { ...alumno, id: 2 }]); // búsqueda por carnet => 2 resultados

      const result = await DbIntegrityValidator.validateFullIntegrity();

      expect(result.valid).toBe(false);
      expect(result.checks.alumnos.duplicates.length).toBeGreaterThan(0);
    });

    test('debe manejar errores de Prisma sin lanzar excepción', async () => {
      prisma.alumno.findMany.mockRejectedValue(new Error('DB connection lost'));

      const result = await DbIntegrityValidator.validateFullIntegrity();

      // No debe propagarse — debe retornar resultado
      expect(result).toBeDefined();
      // El check de alumnos fallido hace que valid sea false
      expect(result.valid).toBe(false);
      // Los errores pueden estar en el check hijo o en el errors global
      const hasAnyError =
        (result.errors && result.errors.length > 0) ||
        (result.checks?.alumnos?.issues && result.checks.alumnos.issues.length > 0);
      expect(hasAnyError).toBe(true);
    });

  });  // end describe validateFullIntegrity()

  // ─── generateReport ────────────────────────────────────────────────────────

  describe('generateReport()', () => {
    test('debe generar reporte con timestamp válido', async () => {
      const report = await DbIntegrityValidator.generateReport();

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('valid');
      expect(report).toHaveProperty('summary');
      expect(new Date(report.timestamp).toString()).not.toBe('Invalid Date');
    });

    test('summary debe incluir checks_passed y checks_failed como números', async () => {
      prisma.alumno.count.mockResolvedValue(10);
      prisma.personal.count.mockResolvedValue(5);
      prisma.asistencia.count.mockResolvedValue(50);

      const report = await DbIntegrityValidator.generateReport();

      expect(typeof report.summary.checks_passed).toBe('number');
      expect(typeof report.summary.checks_failed).toBe('number');
      expect(typeof report.summary.total_checks).toBe('number');
    });

    test('en BD limpia, checks_failed debe ser 0', async () => {
      const report = await DbIntegrityValidator.generateReport();

      expect(report.summary.checks_failed).toBe(0);
      expect(report.valid).toBe(true);
    });
  });
});
