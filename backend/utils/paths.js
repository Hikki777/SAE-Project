const path = require('path');
// Path configuration

const isProduction = process.env.NODE_ENV === 'production';

// En producción (Electron), RESOURCES_PATH es pasado por el proceso principal
// En desarrollo, usamos rutas relativas desde este archivo (backend/utils/paths.js)
const resourcesPath = process.env.RESOURCES_PATH;

const UPLOADS_DIR = (isProduction && resourcesPath)
  ? path.join(resourcesPath, 'uploads')
  : path.join(__dirname, '../../uploads');

// Base de datos
const DB_PATH = (isProduction && resourcesPath)
  ? path.join(resourcesPath, 'backend/prisma/dev.db')
  : path.join(__dirname, '../../prisma/dev.db');

// Frontend estático (para servir desde Express en prod)
// En producción empaquetada, el frontend está en resources/app/frontend/dist
const FRONTEND_DIR = (isProduction && resourcesPath)
  ? path.join(resourcesPath, 'app', 'frontend', 'dist')
  : path.join(__dirname, '../../frontend/dist');

console.log('[PATHS] Configuración:');
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  - isProduction: ${isProduction}`);
console.log(`  - resourcesPath: ${resourcesPath}`);
console.log(`  - UPLOADS_DIR: ${UPLOADS_DIR}`);
console.log(`  - FRONTEND_DIR: ${FRONTEND_DIR}`);
console.log(`  - DB_PATH: ${DB_PATH}`);

module.exports = {
  UPLOADS_DIR,
  DB_PATH,
  FRONTEND_DIR
};

