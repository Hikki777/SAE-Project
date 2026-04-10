/**
 * Bootstrap de Base de Datos
 * 
 * Se ejecuta automáticamente en el startup del backend
 * - En desarrollo: Se ejecuta silenciosamente si hay migraciones pendientes
 * - En producción (Electron): Asegura que las migraciones se apliquen al actualizar
 * 
 * NO requiere intervención del usuario - completamente automático
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

  const isDev = process.env.NODE_ENV === 'development';
  // En producción, solo mostrar errores y cambios importantes
  // En desarrollo, mostrar todo
  if (isDev || type === 'error' || type === 'warn') {
    console.log(`${prefix} ${msg}`);
  }
}

/**
 * Ejecutar migraciones de forma segura
 * Retorna true si se ejecutaron sin error
 */
async function runMigrations() {
  try {
    const projectRoot = path.resolve(__dirname, '..');

    // 1. Verificar que Prisma esté disponible
    try {
      execSync('npx prisma --version', { 
        stdio: 'ignore',
        cwd: projectRoot 
      });
    } catch (e) {
      log('Prisma no disponible - migraciones se saltarán', 'warn');
      return false;
    }

    // 2. Intentar aplicar migraciones con migrate deploy
    // Este comando es seguro - solo aplica lo que falta
    try {
      log('Verificando estado de migraciones...', 'info');
      
      execSync('npx prisma migrate deploy --skip-generate', {
        cwd: projectRoot,
        stdio: 'pipe' // Capturar output en dev, silencioso en prod
      });
      
      log('Base de datos sincronizada correctamente', 'success');
      return true;
    } catch (migrateError) {
      // Si migrate deploy falla, intentar db push como fallback
      // Esto ocurre en la primera instalación cuando no hay migraciones aún
      const errorMsg = migrateError.message || '';
      
      if (errorMsg.includes('No pending migrations') || 
          errorMsg.includes('already in sync')) {
        log('Base de datos ya está actualizada', 'info');
        return true;
      }

      // Fallback: db push (safe en primera instalación, conservative en updates)
      log('Intentando sincronización de schema...', 'info');
      try {
        execSync('npx prisma db push --skip-generate', {
          cwd: projectRoot,
          stdio: 'pipe'
        });
        log('Schema sincronizado correctamente', 'success');
        return true;
      } catch (dbPushError) {
        log(`Error sincronizando BD: ${dbPushError.message}`, 'error');
        return false;
      }
    }

  } catch (error) {
    log(`Error crítico en bootstrap de BD: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Inicializar la base de datos
 * Se llama una sola vez en el startup del servidor
 */
async function initializeDatabase() {
  // En producción Electron, SIEMPRE ejecutar migraciones
  // (pueden haber cambios nuevos después de una actualización)
  if (isElectron) {
    log('Ejecutando migraciones automáticas (Electron)', 'info');
    const success = await runMigrations();
    if (!success) {
      log('Advertencia: No se pudieron aplicar todas las migraciones', 'warn');
      log('La aplicación intentará continuar, pero puede haber inconsistencias', 'warn');
    }
    return;
  }

  // En desarrollo, ejecutar silenciosamente si hay migraciones pendientes
  if (isDev) {
    try {
      // Verificar si hay migraciones pendientes sin mostrar output
      const projectRoot = path.resolve(__dirname, '..');
      const statusOutput = execSync(
        'npx prisma migrate status --skip-generate 2>&1',
        { cwd: projectRoot, encoding: 'utf-8', stdio: 'pipe' }
      );

      if (statusOutput.includes('Pending migrations')) {
        log('Aplicando migraciones pendientes...', 'warn');
        await runMigrations();
      }
    } catch (e) {
      // Silencio si hay error verificando estado
      // Las migraciones se aplicarán en la próxima petición a la BD
    }
  }
}

module.exports = {
  initializeDatabase,
  runMigrations
};
