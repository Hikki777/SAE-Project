/**
 * Bootstrap de Base de Datos
 * 
 * Se ejecuta automáticamente en el startup del backend
 * - En desarrollo: Se ejecuta silenciosamente si hay migraciones pendientes
 * - En producción (Electron): NO hacer nada (npx no disponible)
 * 
 * IMPORTANTE: En Electron, npx/node_modules no está disponible
 * Las migraciones se presuponen ya aplicadas en el instalador
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isProduction = !isDev;
const isElectron = !!process.env.RESOURCES_PATH || !!process.env.ELECTRON_RUN_AS_NODE;

/**
 * Log wrapper
 */
function log(msg, type = 'info') {
  const prefix = {
    info: '[DB-INIT]',
    success: '[DB-INIT✓]',
    warn: '[DB-INIT⚠]',
    error: '[DB-INIT✗]'
  }[type];

  // En producción, solo mostrar errores y cambios importantes
  // En desarrollo, mostrar todo
  if (isDev || type === 'error' || type === 'warn') {
    console.log(`${prefix} ${msg}`);
  }
}

/**
 * Inicializar la base de datos
 * En Electron: Sin operación (npx no disponible)
 * En desarrollo: Aplicar migraciones pendientes
 */
async function initializeDatabase() {
  // EN ELECTRON: No hacer nada (npx no existe)
  if (isElectron) {
    log('Base de datos en Electron - sin verificación de migraciones', 'info');
    return true;
  }

  // EN DESARROLLO: Verificar y aplicar migraciones pendientes
  if (isDev) {
    try {
      // Verificar si hay migraciones pendientes sin mostrar output
      const projectRoot = path.resolve(__dirname, '..');
      const statusOutput = execSync(
        'npx prisma migrate status 2>&1',
        { cwd: projectRoot, encoding: 'utf-8', stdio: 'pipe' }
      );

      if (statusOutput.includes('Pending migrations')) {
        log('Aplicando migraciones pendientes...', 'warn');
        
        try {
          execSync('npx prisma migrate deploy', {
            cwd: projectRoot,
            stdio: 'pipe'
          });
          log('Migraciones aplicadas correctamente', 'success');
        } catch (e) {
          log('No se pudieron aplicar migraciones, intentando db push...', 'warn');
          try {
            execSync('npx prisma db push --skip-generate', {
              cwd: projectRoot,
              stdio: 'pipe'
            });
            log('Schema sincronizado con db push', 'success');
          } catch (dbPushErr) {
            log(`Error sincronizando BD: ${dbPushErr.message}`, 'error');
          }
        }
      } else {
        log('Base de datos ya está actualizada', 'info');
      }
    } catch (e) {
      // Silencio si hay error verificando estado
      // Las migraciones se aplicarán en la próxima petición a la BD
      log('No se pudo verificar estado de migraciones (continuando)', 'warn');
    }
  }

  return true;
}

module.exports = {
  initializeDatabase
};
