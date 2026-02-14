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
    const relativePath = url.replace('file:', '').trim();
    // __dirname es backend/, db debería estar en backend/../prisma/dev.db
    // Independientemente de lo que diga la ruta relativa (ej ./prisma/dev.db), 
    // sabemos dónde DEBE estar la DB en relación a este archivo.
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
