const path = require('path');
// Path configuration

const isProduction = process.env.NODE_ENV === 'production';

// En producccion Electron, main.js pasa SAE_DATA_DIR = %APPDATA%\SAE (siempre escribible)
// Nunca usamos resources/ para datos mutables porque puede estar en Program Files (solo lectura)
const resourcesPath = process.env.RESOURCES_PATH;
const saeDataDir = process.env.SAE_DATA_DIR; // = %APPDATA%\SAE (pasado por main.js)

// Uploads: en produccion van a AppData\SAE\uploads (escribible)
// En desarrollo usan la carpeta local del proyecto
const UPLOADS_DIR = (isProduction && saeDataDir)
  ? path.join(saeDataDir, 'uploads')
  : path.join(__dirname, '../../uploads');

// Temporal: en produccion van a AppData\SAE\temp (escribible)
// En desarrollo usan la carpeta local
const TEMP_DIR = (isProduction && saeDataDir)
  ? path.join(saeDataDir, 'temp')
  : path.join(__dirname, '../../temp');

// Base de datos: en produccion la gestiona main.js (copia inicial a AppData y pasa DATABASE_URL)
// DB_PATH solo se usa en desarrollo; en produccion se usa process.env.DATABASE_URL directamente
const DB_PATH = (isProduction && saeDataDir)
  ? path.join(saeDataDir, 'prisma', 'dev.db')
  : path.join(__dirname, '../../prisma/dev.db');

// Frontend: en produccion Electron lo carga directamente desde el ASAR con loadFile()
// Express no necesita servir el frontend en produccion
const FRONTEND_DIR = isProduction
  ? null
  : path.join(__dirname, '../../frontend/dist');

if (!isProduction) {
  console.log(`[PATHS] UPLOADS=${UPLOADS_DIR} | TEMP=${TEMP_DIR} | DB=${DB_PATH} | ENV=${process.env.NODE_ENV || 'development'}`);
}

module.exports = {
  UPLOADS_DIR,
  TEMP_DIR,
  DB_PATH,
  FRONTEND_DIR
};
