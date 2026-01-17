const prisma = require('../prismaClient');

/**
 * Generador de carnets automáticos para alumnos y personal
 */

/**
 * Genera el siguiente carnet disponible para alumnos
 * Formato: A-YYYYNNN (ej: A-2026001)
 */
async function generateAlumnoCarnet() {
  const year = new Date().getFullYear();
  const prefix = `A-${year}`;

  // Buscar el último carnet del año actual
  const lastAlumno = await prisma.alumno.findFirst({
    where: {
      carnet: {
        startsWith: prefix
      }
    },
    orderBy: {
      carnet: 'desc'
    }
  });

  let nextNumber = 1;
  if (lastAlumno) {
    // Extraer el número del carnet (últimos 3 dígitos)
    const lastNumber = parseInt(lastAlumno.carnet.slice(-3));
    nextNumber = lastNumber + 1;
  }

  // Formatear con padding de 3 dígitos
  const carnet = `${prefix}${String(nextNumber).padStart(3, '0')}`;
  return carnet;
}

/**
 * Genera el siguiente carnet disponible para personal según cargo
 * Formato: [PREFIJO]-YYYYNNN (ej: D-2026001, DIR-2026001)
 * @param {string} cargo - Cargo del personal
 * @param {object} tx - Cliente de transacción Prisma opcional
 */
async function generatePersonalCarnet(cargo, tx = null) {
  const year = new Date().getFullYear();
  const db = tx || prisma;
  
  // Mapeo de cargos a prefijos
  const prefixMap = {
    'Docente': 'D',
    'Secretaria': 'S',
    'Secretario': 'S',
    // Directores usan DIR, Subdirectores usan SDIR
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

  const prefix = prefixMap[cargo] || 'P'; // P = Personal genérico
  const fullPrefix = `${prefix}-${year}`;

  // Buscar el último carnet con este prefijo del año actual
  const lastPersonal = await db.personal.findFirst({
    where: {
      carnet: {
        startsWith: fullPrefix
      }
    },
    orderBy: {
      carnet: 'desc'
    }
  });

  let nextNumber = 1;
  if (lastPersonal) {
    // Extraer el número del carnet (últimos 3 dígitos)
    const lastNumber = parseInt(lastPersonal.carnet.slice(-3));
    nextNumber = lastNumber + 1;
  }

  // Formatear con padding de 3 dígitos
  const carnet = `${fullPrefix}${String(nextNumber).padStart(3, '0')}`;
  return carnet;
}

/**
 * Valida el formato de un carnet
 * @param {string} carnet - Carnet a validar
 * @param {string} tipo - 'alumno' o 'personal'
 * @returns {object} { valid: boolean, error: string }
 */
function validateCarnetFormat(carnet, tipo) {
  if (!carnet || typeof carnet !== 'string') {
    return { valid: false, error: 'Carnet es requerido' };
  }

  // Formato general: [PREFIJO]-YYYYNNN
  const regex = /^[A-Z]+-\d{7}$/;
  
  if (!regex.test(carnet)) {
    return { 
      valid: false, 
      error: 'Formato inválido. Use: PREFIJO-YYYYNNN (ej: A-2026001)' 
    };
  }

  // Validar año
  const year = parseInt(carnet.split('-')[1].substring(0, 4));
  const currentYear = new Date().getFullYear();
  
  if (year < 2000 || year > currentYear + 1) {
    return { 
      valid: false, 
      error: `Año inválido. Use entre 2000 y ${currentYear + 1}` 
    };
  }

  // Validaciones específicas por tipo
  if (tipo === 'alumno') {
    if (!carnet.startsWith('A-')) {
      return { 
        valid: false, 
        error: 'Carnet de alumno debe iniciar con A-' 
      };
    }
  }

  return { valid: true, error: null };
}

/**
 * Verifica si un carnet está disponible (no existe en la BD)
 * @param {string} carnet - Carnet a verificar
 * @param {string} tipo - 'alumno' o 'personal'
 * @param {number} excludeId - ID a excluir (para ediciones)
 * @returns {Promise<boolean>} true si está disponible
 */
async function isCarnetAvailable(carnet, tipo, excludeId = null) {
  if (tipo === 'alumno') {
    const existing = await prisma.alumno.findFirst({
      where: {
        carnet,
        ...(excludeId && { id: { not: excludeId } })
      }
    });
    return !existing;
  } else if (tipo === 'personal') {
    const existing = await prisma.personal.findFirst({
      where: {
        carnet,
        ...(excludeId && { id: { not: excludeId } })
      }
    });
    return !existing;
  }
  
  return false;
}

/**
 * Valida un carnet completo (formato + disponibilidad)
 * @param {string} carnet - Carnet a validar
 * @param {string} tipo - 'alumno' o 'personal'
 * @param {number} excludeId - ID a excluir (para ediciones)
 * @returns {Promise<object>} { valid: boolean, error: string }
 */
async function validateCarnet(carnet, tipo, excludeId = null) {
  // Validar formato
  const formatValidation = validateCarnetFormat(carnet, tipo);
  if (!formatValidation.valid) {
    return formatValidation;
  }

  // Validar disponibilidad
  const available = await isCarnetAvailable(carnet, tipo, excludeId);
  if (!available) {
    return { 
      valid: false, 
      error: 'Este carnet ya está en uso' 
    };
  }

  return { valid: true, error: null };
}

/**
 * Obtiene el prefijo de carnet según el cargo
 */
function getCarnetPrefix(cargo) {
  const prefixMap = {
    'Docente': 'D',
    'Secretaria': 'S',
    'Secretario': 'S',
    // Todos los directores usan el mismo prefijo DIR
    'Director': 'DIR',
    'Directora': 'DIR',
    'Director General': 'DIR',
    'Directora General': 'DIR',
    'Subdirector': 'DIR',
    'Subdirectora': 'DIR',
    'Administrador': 'ADM',
    'Administradora': 'ADM',
    'Coordinador': 'COORD',
    'Coordinadora': 'COORD',
    'Conserje': 'CON',
    'Guardia': 'GUA',
    'Operativo': 'O',
    'Auxiliar': 'AUX'
  };

  return prefixMap[cargo] || 'P';
}

module.exports = {
  generateAlumnoCarnet,
  generatePersonalCarnet,
  validateCarnet,
  validateCarnetFormat,
  isCarnetAvailable,
  getCarnetPrefix
};
