require('dotenv').config();
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const extract = require('extract-zip');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');

// Detectar entorno y configurar rutas base
const isProduction = process.env.NODE_ENV === 'production';
const isElectron = !!process.env.RESOURCES_PATH || !!process.env.ELECTRON_RUN_AS_NODE;
const saeDataDir = process.env.SAE_DATA_DIR; // De Electron main.js

// Rutas base dependen del entorno
let projectRoot = path.resolve(__dirname, '..');
let dataDir = projectRoot;

if (isProduction && isElectron && saeDataDir) {
  dataDir = saeDataDir; // %APPDATA%\SAE en Windows
} else if (isProduction && !isElectron) {
  dataDir = process.env.DATA_DIR || projectRoot;
}

const TEMP_DIR = path.join(dataDir, 'temp');
const BACKUP_DIR = path.join(dataDir, 'backups');

// Asegurar directorios
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

if (process.env.NODE_ENV === 'development') {
  console.log(`[BACKUP] TEMP_DIR=${TEMP_DIR} | BACKUP_DIR=${BACKUP_DIR}`);
}

/**
 * Copiar directorio recursivamente (alternativa a fs.cpSync para compatibilidad)
 */
function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Obtener versión del sistema de forma segura
 */
function getSystemVersion() {
  try {
    // Intentar leer desde package.json (fuente de verdad)
    const packageJson = require('../package.json');
    return packageJson.version || '1.0.0';
  } catch (e) {
    // Fallback a version.json si existe
    try {
      if (fs.existsSync(path.join(__dirname, '../backend/config/version.json'))) {
        const config = JSON.parse(
          fs.readFileSync(path.join(__dirname, '../backend/config/version.json'), 'utf8')
        );
        return config.version || '1.0.0';
      }
    } catch (e2) {
      // Si todo falla, retornar versión default
      return '1.0.0';
    }
  }
}


async function createSystemBackup(password) {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const tempZipPath = path.join(TEMP_DIR, `auto-backup-${timestamp}.zip`);
  
  console.log('📦 Iniciando respaldo del sistema...');

  try {
    // 1. Crear ZIP
    const output = fs.createWriteStream(tempZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
      archive.pipe(output);

      // DB
      const dbPath = path.join(__dirname, '../prisma/dev.db');
      if (fs.existsSync(dbPath)) {
        console.log('   ✓ Incluyendo base de datos...');
        archive.file(dbPath, { name: 'dev.db' });
      }

      // Uploads
      const uploadsPath = path.join(__dirname, '../uploads');
      if (fs.existsSync(uploadsPath)) {
        console.log('   ✓ Incluyendo archivos subidos...');
        archive.directory(uploadsPath, 'uploads');
      }

      // Config & Version
      const configPath = path.join(__dirname, '../backend/config');
      if (fs.existsSync(configPath)) {
        console.log('   ✓ Incluyendo configuración...');
        archive.directory(configPath, 'config');
      }
      
      // Metadata
      const metadata = {
        fecha: new Date().toISOString(),
        type: 'auto-update',
        version: getSystemVersion(),
        sistema: 'SAE',
        nodeVersion: process.version
      };
      console.log('   ✓ Añadiendo metadatos...');
      archive.append(JSON.stringify(metadata, null, 2), { name: 'backup-info.json' });

      archive.finalize();
    });

    console.log('   ✓ ZIP comprimido correctamente');

    // 2. Encrypt & Package
    const zipData = fs.readFileSync(tempZipPath);
    console.log('   ✓ Calculando integridad...');
    
    const hash = crypto.createHash('sha256').update(zipData).digest('hex');
    const hmac = crypto.createHmac('sha256', process.env.HMAC_SECRET || 'default-secret')
      .update(zipData)
      .digest('hex');
    
    console.log('   ✓ Encriptando contenido...');
    const zipBase64 = zipData.toString('base64');
    const encrypted = CryptoJS.AES.encrypt(zipBase64, password).toString();

    const finalBackup = JSON.stringify({
      version: '1.0',
      encrypted,
      hash,
      hmac,
      timestamp: new Date().toISOString(),
      size: zipData.length,
      compressedSize: zipData.length,
      metadata: { 
        type: 'auto-update',
        systemVersion: getSystemVersion()
      }
    }, null, 2);

    const backupPath = path.join(BACKUP_DIR, `update-backup-${timestamp}.bak`);
    fs.writeFileSync(backupPath, finalBackup);
    
    console.log(`\n✅ Respaldo creado exitosamente`);
    console.log(`   📁 Ubicación: ${backupPath}`);
    console.log(`   📊 Tamaño: ${(zipData.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Cleanup
    if (fs.existsSync(tempZipPath)) {
      fs.unlinkSync(tempZipPath);
    }
    
    return backupPath;
  } catch (error) {
    console.error('❌ Error creando backup:', error.message);
    // Cleanup en caso de error
    if (fs.existsSync(tempZipPath)) {
      fs.unlinkSync(tempZipPath);
    }
    throw error;
  }
}

async function restoreSystemBackup(backupPath, password) {
  console.log(`\n🔄 Restaurando desde: ${backupPath}`);
  
  try {
    // 1. Validar que el archivo existe
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Archivo de backup no encontrado: ${backupPath}`);
    }

    // 2. Leer y parsear el backup
    console.log('   ✓ Leyendo archivo de backup...');
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    let backupData;
    
    try {
      backupData = JSON.parse(backupContent);
    } catch (e) {
      throw new Error('Archivo de backup corrupto o inválido');
    }

    // 3. Validar estructura del backup
    if (!backupData.encrypted || !backupData.hash) {
      throw new Error('Backup inválido - estructura corrupta');
    }

    // 4. Decrypt con mejor manejo de errores
    console.log('   ✓ Desencriptando backup...');
    let decrypted;
    try {
      const bytes = CryptoJS.AES.decrypt(backupData.encrypted, password);
      decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      // Validar que la desencriptación fue exitosa
      if (!decrypted || decrypted.length === 0) {
        throw new Error('Contraseña incorrecta o backup corrupto');
      }
    } catch (decryptError) {
      throw new Error(`Error desencriptando: ${decryptError.message}`);
    }

    // 5. Convertir a buffer y verificar integridad
    console.log('   ✓ Convirtiendo contenido...');
    let zipBuffer;
    try {
      zipBuffer = Buffer.from(decrypted, 'base64');
    } catch (e) {
      throw new Error('Backup inválido - datos base64 corrupto');
    }

    // 6. Verificar hash para integridad
    console.log('   ✓ Verificando integridad...');
    const calculatedHash = crypto.createHash('sha256').update(zipBuffer).digest('hex');
    if (calculatedHash !== backupData.hash) {
      throw new Error('Backup corrupto - hash no coincide. Datos pueden estar dañados.');
    }

    // 7. Extraer ZIP
    console.log('   ✓ Extrayendo contenido...');
    const tempZipPath = path.join(TEMP_DIR, `restore-${Date.now()}.zip`);
    const extractPath = path.join(TEMP_DIR, `restore-data-${Date.now()}`);
    
    try {
      fs.writeFileSync(tempZipPath, zipBuffer);
      await extract(tempZipPath, { dir: extractPath });
      console.log('   ✓ Contenido extraído correctamente');
    } catch (extractError) {
      throw new Error(`Error extrayendo backup: ${extractError.message}`);
    }

    // 8. Restaurar componentes
    console.log('   ✓ Restaurando base de datos...');
    const dbPath = path.join(__dirname, '../prisma/dev.db');
    const backupDbPath = path.join(extractPath, 'dev.db');
    if (fs.existsSync(backupDbPath)) {
      try {
        fs.copyFileSync(backupDbPath, dbPath);
        console.log('   ✓ Base de datos restaurada');
      } catch (e) {
        console.warn('   ⚠️  Advertencia al restaurar BD:', e.message);
      }
    }

    console.log('   ✓ Restaurando archivos subidos...');
    const uploadsPath = path.join(__dirname, '../uploads');
    const backupUploadsPath = path.join(extractPath, 'uploads');
    if (fs.existsSync(backupUploadsPath)) {
      try {
        if (fs.existsSync(uploadsPath)) {
          fs.rmSync(uploadsPath, { recursive: true, force: true });
        }
        // Usar setTimeout para permitir que el sistema libere locks
        await new Promise(resolve => setTimeout(resolve, 100));
        // Usar función manual en lugar de fs.cpSync para mejor compatibilidad
        copyDirectoryRecursive(backupUploadsPath, uploadsPath);
        console.log('   ✓ Archivos restaurados');
      } catch (e) {
        console.warn('   ⚠️  Advertencia al restaurar archivos:', e.message);
        // No es fatal, continuar
      }
    }
    
    console.log('   ✓ Restaurando configuración...');
    const backupConfigPath = path.join(extractPath, 'config');
    if (fs.existsSync(backupConfigPath)) {
      try {
        const configPath = path.join(__dirname, '../backend/config');
        if (fs.existsSync(configPath)) {
          fs.rmSync(configPath, { recursive: true, force: true });
        }
        // Usar setTimeout para permitir que el sistema libere locks
        await new Promise(resolve => setTimeout(resolve, 100));
        // Usar función manual en lugar de fs.cpSync para mejor compatibilidad
        copyDirectoryRecursive(backupConfigPath, configPath);
        console.log('   ✓ Configuración restaurada');
      } catch (e) {
        console.warn('   ⚠️  Advertencia al restaurar configuración:', e.message);
        // No es fatal, continuar
      }
    }

    // 9. Cleanup
    try {
      if (fs.existsSync(tempZipPath)) fs.unlinkSync(tempZipPath);
      if (fs.existsSync(extractPath)) fs.rmSync(extractPath, { recursive: true, force: true });
    } catch (e) {
      console.warn('⚠️  No se pudo limpiar archivos temporales:', e.message);
    }
    
    console.log('\n✅ Sistema restaurado exitosamente.');
    console.log(`   📁 Backup: ${backupPath}`);
    
    // Mostrar metadatos si están disponibles
    if (backupData.metadata) {
      console.log(`   📌 Versión del sistema: ${backupData.metadata.systemVersion || 'desconocida'}`);
    }
    if (backupData.timestamp) {
      const backupTime = new Date(backupData.timestamp);
      console.log(`   🕐 Fecha del backup: ${backupTime.toLocaleString('es-ES')}`);
    }

  } catch (error) {
    console.error('\n❌ Error restaurando sistema:', error.message);
    throw error;
  }
}

module.exports = { createSystemBackup, restoreSystemBackup };
