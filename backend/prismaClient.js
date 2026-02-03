const { PrismaClient } = require('./prisma-client');
const path = require('path');
const fs = require('fs');

/*
 * Wrapper robusto para Prisma Client en Electron
 * Maneja automáticamente la ruta de la base de datos para asegurar
 * que sea escribible (AppData) en producción.
 */

let prismaInstance = null;

function getDatabaseUrl() {
  // Si ya viene inyectada desde main.js, usarla
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Detectar si estamos en Electron (por variable inyectada o rutas)
  const isElectron = process.env.RESOURCES_PATH || process.versions.electron;

  if (isElectron) {
    // EN PRODUCION: Usar AppData (inyectado idealmente, o calculado)
    // Nota: El proceso Node no tiene acceso a app.getPath,
    // por eso main.js DEBE inyectar DATABASE_URL o ARTIFACTS_PATH.
    // Si no está inyectado, fallback a relativo (peligroso en Program Files)
    return 'file:./prisma/dev.db';
  }

  // DESARROLLO
  return 'file:./prisma/dev.db';
}

  if (!prismaInstance) {
  const url = getDatabaseUrl();
  
  // DEBUG PATH
  if (url.startsWith('file:')) {
      const relativePath = url.replace('file:', '');
      const absolutePath = path.resolve(process.cwd(), relativePath);
      console.log(`[DEBUG_PRISMA] URL=${url}`);
      console.log(`[DEBUG_PRISMA] CWD=${process.cwd()}`);
      console.log(`[DEBUG_PRISMA] Absolute DB Path=${absolutePath}`);
  }

  console.log(`[PrismaClient] Inicializando con URL: ${url}`);
  
  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
    // Log querys en desarrollo para debug
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}

module.exports = prismaInstance;
