const path = require('path');

/**
 * Determina la carpeta de upload según el cargo
 * @param {string} cargo - Cargo del personal
 * @returns {string} - Nombre de la carpeta
 */
function getFolderByCargo(cargo) {
  if (!cargo) return 'personal';
  
  const cargoLower = cargo.toLowerCase();
  
  // Directores y subdirectores
  if (cargoLower.includes('director') || cargoLower.includes('subdirector')) {
    return 'directores';
  }
  
  // Docentes
  if (cargoLower === 'docente') {
    return 'docentes';
  }
  
  // Personal administrativo
  const personalCargos = ['secretaria', 'secretario', 'auxiliar', 'operativo'];
  if (personalCargos.some(c => cargoLower.includes(c))) {
    return 'personal';
  }
  
  // Por defecto (fallback)
  return 'personal';
}

/**
 * Determina si un cargo es de usuario del sistema
 * @param {string} cargo - Cargo
 * @returns {boolean}
 */
function isSystemUser(cargo) {
  if (!cargo) return false;
  const cargoLower = cargo.toLowerCase();
  return cargoLower === 'admin' || cargoLower === 'administrador' || cargoLower === 'operador';
}

module.exports = { 
  getFolderByCargo,
  isSystemUser
};
