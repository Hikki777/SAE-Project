const prisma = require('../prismaClient');

/**
 * Generador de carnets automáticos para alumnos y personal
 * Sistema de secuencia global unificada:
 * - Una sola secuencia (carnet_counter_global) para todos los tipos
 * - Alumnos: A-YYYYNNN
 * - Personal: [PREFIJO]-YYYYNNN según cargo
 */

/**
 * Mapeo de cargos a prefijos de carnet
 */
const CARGO_PREFIX_MAP = {
  'Docente': 'D',
  'Secretaria': 'S',
  'Secretario': 'S',
  'Director': 'DIR',
  'Directora': 'DIR',
  'Director General': 'DIR',
  'Directora General': 'DIR',
  'Director Técnico': 'DIR',
  'Directora Técnica': 'DIR',
  'Subdirector': 'SDIR',
  'Subdirectora': 'SDIR',
  'Administrador': 'ADM',
  'Administradora': 'ADM',
  'Coordinador': 'COORD',
  'Coordinadora': 'COORD',
  'Conserje': 'CON',
  'Guardia': 'GUA',
  'Operativo': 'O',
  'Auxiliar': 'AUX'
};

/**
 * Obtener el prefijo de carnet según el cargo
 * @param {string} cargo
 * @returns {string} Prefijo (ej: 'D', 'DIR', 'AUX')
 */
function getCarnetPrefix(cargo) {
  return CARGO_PREFIX_MAP[cargo] || 'P'; // P = Personal genérico
}

/**
 * Genera el siguiente carnet disponible para alumnos
 * Formato: A-YYYYNNN (ej: A-2026001)
 * Usa carnet_counter_global de la tabla institucion (compartido)
 */
async function generateAlumnoCarnet() {
  const institucion = await prisma.institucion.findFirst({
    select: {
      id: true,
      ciclo_escolar: true
    }
  });

  if (!institucion) {
    throw new Error('No se encontró la institución');
  }

  const year = institucion.ciclo_escolar || new Date().getFullYear();

  // Incrementar el contador GLOBAL atómicamente
  const updated = await prisma.institucion.update({
    where: { id: institucion.id },
    data: {
      carnet_counter_global: {
        increment: 1
      }
    },
    select: {
      carnet_counter_global: true
    }
  });

  const nextNumber = updated.carnet_counter_global;

  // Formatear con padding de 3 dígitos
  const carnet = `A-${year}${String(nextNumber).padStart(3, '0')}`;
  return carnet;
}

/**
 * Genera el siguiente carnet disponible para personal según cargo
 * Formato: [PREFIJO]-YYYYNNN (ej: D-2026001, DIR-2026002)
 * Usa carnet_counter_global de la tabla institucion (compartido)
 */
async function generatePersonalCarnet(cargo, tx = null) {
  const db = tx || prisma;

  // Obtener institución
  const institucion = await db.institucion.findFirst({
    select: {
      id: true,
      ciclo_escolar: true
    }
  });

  if (!institucion) {
    throw new Error('No se encontró la institución');
  }

  const year = institucion.ciclo_escolar || new Date().getFullYear();
  const prefix = getCarnetPrefix(cargo);

  // Incrementar el contador GLOBAL atómicamente
  const updated = await db.institucion.update({
    where: { id: institucion.id },
    data: {
      carnet_counter_global: {
        increment: 1
      }
    },
    select: {
      carnet_counter_global: true
    }
  });

  const nextNumber = updated.carnet_counter_global;

  // Formatear con padding de 3 dígitos
  const carnet = `${prefix}-${year}${String(nextNumber).padStart(3, '0')}`;
  return carnet;
}

/**
 * Previsualiza el siguiente carnet disponible para alumnos (SIN INCREMENTAR)
 * Formato: A-YYYYNNN (ej: A-2026003)
 */
async function previewAlumnoCarnet() {
  const institucion = await prisma.institucion.findFirst({
    select: {
      carnet_counter_global: true,
      ciclo_escolar: true
    }
  });

  if (!institucion) {
    throw new Error('No se encontró la institución');
  }

  const year = institucion.ciclo_escolar || new Date().getFullYear();

  // Preview: valor actual + 1 (sin modificar BD)
  const nextNumber = (institucion.carnet_counter_global || 0) + 1;
  const carnet = `A-${year}${String(nextNumber).padStart(3, '0')}`;
  return carnet;
}

/**
 * Previsualiza el siguiente carnet disponible para personal (SIN INCREMENTAR)
 */
async function previewPersonalCarnet(cargo) {
  const institucion = await prisma.institucion.findFirst({
    select: {
      carnet_counter_global: true,
      ciclo_escolar: true
    }
  });

  if (!institucion) {
    throw new Error('No se encontró la institución');
  }

  const year = institucion.ciclo_escolar || new Date().getFullYear();
  const prefix = getCarnetPrefix(cargo);
  const nextNumber = (institucion.carnet_counter_global || 0) + 1;

  const carnet = `${prefix}-${year}${String(nextNumber).padStart(3, '0')}`;
  return carnet;
}

/**
 * Validar el formato de un carnet
 * Formatos válidos: A-YYYYNNN, D-YYYYNNN, DIR-YYYYNNN, etc.
 * @param {string} carnet
 * @returns {{ valid: boolean, error?: string }}
 */
function validateCarnetFormat(carnet) {
  if (!carnet || typeof carnet !== 'string') {
    return { valid: false, error: 'El carnet es requerido' };
  }

  const trimmed = carnet.trim().toUpperCase();

  // Formato: PREFIJO-YYYYNNN (prefijo 1-5 letras, año 4 dígitos, número 3+ dígitos)
  const regex = /^[A-Z]{1,5}-\d{4}\d{3,}$/;
  if (!regex.test(trimmed)) {
    return {
      valid: false,
      error: 'Formato de carnet inválido. Use: PREFIJO-YYYYNNN (ej: A-2026001, D-2026002)'
    };
  }

  return { valid: true };
}

/**
 * Verificar si un carnet está disponible (no existe en BD)
 * @param {string} carnet
 * @param {string} tipo - 'alumno' o 'personal'
 * @param {number|null} excludeId - ID a excluir (para edición)
 * @returns {Promise<boolean>}
 */
async function isCarnetAvailable(carnet, tipo, excludeId = null) {
  if (tipo === 'alumno') {
    const existing = await prisma.alumno.findFirst({
      where: {
        carnet: { equals: carnet, mode: 'insensitive' },
        ...(excludeId ? { id: { not: excludeId } } : {})
      }
    });
    return !existing;
  } else {
    const existing = await prisma.personal.findFirst({
      where: {
        carnet: { equals: carnet, mode: 'insensitive' },
        ...(excludeId ? { id: { not: excludeId } } : {})
      }
    });
    return !existing;
  }
}

/**
 * Validar un carnet completo: formato + disponibilidad
 * @param {string} carnet
 * @param {string} tipo - 'alumno' o 'personal'
 * @param {number|null} excludeId - ID a excluir (para edición)
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
async function validateCarnet(carnet, tipo, excludeId = null) {
  // 1. Validar formato
  const formatResult = validateCarnetFormat(carnet);
  if (!formatResult.valid) {
    return formatResult;
  }

  // 2. Verificar disponibilidad
  const available = await isCarnetAvailable(carnet, tipo, excludeId);
  if (!available) {
    return {
      valid: false,
      error: `El carnet "${carnet}" ya está en uso`
    };
  }

  return { valid: true };
}

module.exports = {
  generateAlumnoCarnet,
  generatePersonalCarnet,
  validateCarnet,
  validateCarnetFormat,
  isCarnetAvailable,
  getCarnetPrefix,
  previewAlumnoCarnet,
  previewPersonalCarnet
};
