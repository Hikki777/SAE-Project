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
  // Recuperar URL de entorno
  let url = process.env.DATABASE_URL;

  // Si no hay URL, usar default relativa (pero será corregida abajo)
  if (!url) {
    url = 'file:./prisma/dev.db';
  }

  // Si es SQLite con ruta relativa, convertir a absoluta basada en __dirname
  if (url.startsWith('file:') && (url.includes('./') || url.includes('../'))) {
    // Si estamos en producción (RESOURCES_PATH definido o app empacada), 
    // pero la URL sigue siendo relativa, algo falló en la transferencia de env vars.
    // IMPORTANTE: En producción NO debemos usar rutas relativas ya que apuntan a Program Files (Read-only)
    if (process.env.NODE_ENV === 'production' || process.env.RESOURCES_PATH) {
      console.error('[PrismaClient] ERROR: Detectada ruta relativa en PRODUCCIÓN. Forzando AppData.');
      // Intentar recuperar de variable SAE_DATA_DIR pasada por Electron
      const dataDir = process.env.SAE_DATA_DIR || path.join(process.env.APPDATA || '', 'SAE');
      const absoluteDbPath = path.join(dataDir, 'prisma', 'dev.db').replace(/\\/g, '/');
      return `file:${absoluteDbPath}`;
    }

    const relativePath = url.replace('file:', '').trim();
    const projectRoot = path.resolve(__dirname, '..');
    const absoluteDbPath = path.resolve(projectRoot, 'prisma', 'dev.db');
    
    console.log(`[PrismaClient] Corrigiendo ruta relativa a absoluta: ${absoluteDbPath}`);
    return `file:${absoluteDbPath}`;
  }

  return url;
}

if (!prismaInstance) {
  const url = getDatabaseUrl();

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
