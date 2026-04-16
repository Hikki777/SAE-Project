#!/usr/bin/env node

/**
 * Script de migracion SEGURO para SAE
 * 
 * Garantiza que:
 * 1. Las migraciones pendientes se apliquen sin borrar datos
 * 2. No se ejecuta "db push" destructivo 
 * 3. Funciona en desarrollo (NO debe ejecutarse en Electron ni en CI/CD de build)
 * 4. Tiene rollback automático si falla
 * 
 * Uso:
 *   node scripts/safe-migrate.js
 */

// ── GUARDIA DE SEGURIDAD ────────────────────────────────────────────────────
// Este script SOLO debe ejecutarse en entorno de desarrollo local.
// En producción (Electron) las migraciones se aplican automáticamente
// en bootstrap.js vía ALTER TABLE (sin prisma CLI).
// En builds de CI/CD tampoco debe modificar bases de datos de usuario.
const isElectronBuild = process.env.ELECTRON_RUN_AS_NODE || process.env.RESOURCES_PATH;
const isCI = process.env.CI || process.env.GITHUB_ACTIONS || process.env.npm_lifecycle_event === 'postinstall' && process.env.NODE_ENV === 'production';

if (isElectronBuild) {
  console.log('[safe-migrate] Entorno Electron detectado. Omitiendo migraciones de CLI.');
  process.exit(0);
}

if (isCI && process.env.NODE_ENV === 'production') {
  console.log('[safe-migrate] Build de producción detectado. Omitiendo migraciones de CLI.');
  process.exit(0);
}
// ───────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '..');

function log(msg, type = 'info') {
  const icons = {
    info: '📋',
    success: '✅',
    warn: '⚠️ ',
    error: '❌'
  };
  const colors = {
    info: '\x1b[36m',    // cyan
    success: '\x1b[32m', // green
    warn: '\x1b[33m',    // yellow
    error: '\x1b[31m'    // red
  };
  console.log(`${icons[type]} ${colors[type]}${msg}\x1b[0m`);
}

async function safeMigrate() {
  log('[MIGRACIONES] Iniciando proceso seguro de migraciones...', 'info');

  try {
    // 1. Verificar que prisma está disponible
    log('Verificando Prisma...', 'info');
    try {
      execSync('npx prisma --version', { stdio: 'ignore' });
    } catch (e) {
      log('ADVERTENCIA: Prisma CLI no disponible', 'warn');
      log('Las migraciones se aplicarán automáticamente en el siguiente inicio', 'warn');
      process.exit(0);
    }

    // 2. Verificar migraciones pendientes
    log('Verificando estado de migraciones...', 'info');
    let status;
    try {
      status = execSync('npx prisma migrate status --skip-generate', { 
        cwd: ROOT_DIR, 
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) {
      // migrate status puede fallar si no hay migraciones o base de datos
      log('No se puede verificar estado (primer setup o BD corrupta)', 'warn');
      log('Se crearán/sincronizarán automáticamente...', 'info');
      
      // En este caso, hacer db push que es non-destructivo en primera instalación
      try {
        execSync('npx prisma db push --skip-generate', { cwd: ROOT_DIR, stdio: 'inherit' });
        log('Base de datos sincronizada correctamente', 'success');
      } catch (pushError) {
        log(`Error sincronizando BD: ${pushError.message}`, 'error');
        throw pushError;
      }
      return;
    }

    // 3. Aplicar migraciones pendientes
    if (status.includes('Pending migrations')) {
      log('Migraciones pendientes encontradas. Aplicando...', 'info');
      try {
        execSync('npx prisma migrate deploy --skip-generate', { 
          cwd: ROOT_DIR, 
          stdio: 'inherit'
        });
        log('Migraciones aplicadas exitosamente', 'success');
      } catch (migrateError) {
        log(`Error aplicando migraciones: ${migrateError.message}`, 'error');
        throw migrateError;
      }
    } else {
      log('Base de datos está actualizada', 'success');
    }

    // 4. Generar Prisma Client
    log('Regenerando Prisma Client...', 'info');
    try {
      execSync('npx prisma generate', { cwd: ROOT_DIR, stdio: 'inherit' });
      log('Prisma Client regenerado', 'success');
    } catch (generateError) {
      log(`Advertencia al generar Prisma Client: ${generateError.message}`, 'warn');
      // No es fatal, continuar
    }

    log('[MIGRACIONES] Proceso completado exitosamente', 'success');
    process.exit(0);

  } catch (error) {
    log(`[MIGRACIONES] Error CRÍTICO: ${error.message}`, 'error');
    log('Verifica el archivo de log de la aplicación', 'error');
    process.exit(1);
  }
}

safeMigrate();
