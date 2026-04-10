require('dotenv').config();
const { execSync } = require('child_process');
const { createSystemBackup, restoreSystemBackup } = require('./backup-utils');
const MigrationManager = require('../backend/migrations/migration-manager');
const path = require('path');
const fs = require('fs');

const SYSTEM_PASSWORD = process.env.UPDATE_SECRET || 'sys-update-safe-key-2026';
const VERSION_FILE = path.join(__dirname, '../backend/config/version.json');
const PACKAGE_FILE = path.join(__dirname, '../package.json');

function readJsonVersion(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content).version;
    }
  } catch (e) {
    return null;
  }
  return '0.0.0';
}

async function main() {
  console.log('🚀 Iniciando proceso de actualización del sistema...');
  let backupPath = null;
  const currentVersion = readJsonVersion(VERSION_FILE) || '1.0.0';
  
  console.log(`Versión actual del sistema: ${currentVersion}`);

  try {
    // 1. Crear Backup
    console.log('📦 Paso 1: Creando respaldo de seguridad...');
    backupPath = await createSystemBackup(SYSTEM_PASSWORD);
    
    // 2. Descargar Actualizaciones (Git Pull)
    console.log('⬇️ Paso 2: Descargando archivos...');
    try {
      execSync('git pull', { stdio: 'inherit' });
    } catch (e) {
      console.warn('⚠️ No se pudo ejecutar git pull. Continuando con archivos locales...');
    }
    
    // 3. Instalar Dependencias
    console.log('📚 Paso 3: Actualizando dependencias...');
    try {
        execSync('npm install', { stdio: 'inherit' });
    } catch (e) {
        console.warn('⚠️ Error en npm install, intentando continuar...');
    }
    
    // 4. Leer Nueva Versión
    const targetVersion = readJsonVersion(PACKAGE_FILE);
    console.log(`Versión objetivo: ${targetVersion}`);
    
    // 5. Ejecutar Migraciones (manera segura)
    console.log('🔄 Paso 5: Aplicando migraciones de base de datos...');
    try {
      execSync('node scripts/safe-migrate.js', { stdio: 'inherit' });
      console.log('✅ Migraciones aplicadas.');
    } catch (e) {
      console.warn('⚠️ Error en migraciones, pero continuando...');
    }
    
    console.log('✅ Actualización completada exitosamente.');
    console.log(`Nueva versión instalada: ${targetVersion}`);
    console.log('Por favor reinicia la aplicación.');

  } catch (error) {
    console.error('❌ Error crítico durante la actualización:', error.message);
    
    if (backupPath) {
      console.log('⚠️ Iniciando ROLLBACK automático...');
      try {
        await restoreSystemBackup(backupPath, SYSTEM_PASSWORD);
        console.log('✅ Sistema restaurado al estado anterior.');
      } catch (restoreError) {
        console.error('📛 FALLÓ EL ROLLBACK:', restoreError);
        console.error(`Tus datos están seguros en: ${backupPath}. Contacta soporte.`);
      }
    }
    process.exit(1);
  }
}

main();
