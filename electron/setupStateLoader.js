/**
 * setupStateLoader.js
 * Cargador dinámico del SetupStateService para el proceso main de Electron.
 * Resuelve la ruta correcta tanto en desarrollo como en producción (asar.unpacked).
 *
 * Razón de existir: En producción el backend está empaquetado en app.asar.unpacked,
 * y la ruta relativa '../backend/services/...' no funciona desde electron/main.js
 * porque el punto de referencia cambia según si se ejecuta desde asar o no.
 */

const path = require('path');
const fs = require('fs');

function resolveService() {
  const candidates = [
    // Producción: empaquetado en asar.unpacked
    process.resourcesPath
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'services', 'setupStateService.js')
      : null,
    // Desarrollo: raíz del proyecto
    path.join(__dirname, '..', 'backend', 'services', 'setupStateService.js'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return require(candidate);
    }
  }

  console.warn('[setupStateLoader] No se encontró setupStateService.js en ninguna ruta candidata.');
  return null;
}

module.exports = resolveService();
