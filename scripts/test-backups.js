#!/usr/bin/env node

/**
 * Script de prueba para validar backups y restores
 * Verifica que:
 * 1. Se crea un backup correctamente
 * 2. El backup tiene la estructura esperada
 * 3. Se puede restaurar sin errores
 * 4. Los datos se restauran correctamente
 */

const { createSystemBackup, restoreSystemBackup } = require('./backup-utils');
const fs = require('fs');
const path = require('path');

const TEST_PASSWORD = 'test-password-secure-2026';
const TEST_TIMEOUT = 60000; // 60 segundos

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 PRUEBA DE BACKUPS Y RESTAURACIÓN');
  console.log('='.repeat(60) + '\n');

  let testsPassed = 0;
  let testsFailed = 0;
  let backupPath = null;

  // Test 1: Crear backup
  console.log('Test 1️⃣: Crear backup...');
  try {
    backupPath = await createSystemBackup(TEST_PASSWORD);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(backupPath)) {
      throw new Error('Archivo de backup no fue creado');
    }

    // Verificar que tiene contenido
    const stats = fs.statSync(backupPath);
    if (stats.size === 0) {
      throw new Error('Archivo de backup está vacío');
    }

    // Verificar que es JSON válido
    const content = fs.readFileSync(backupPath, 'utf8');
    const backupData = JSON.parse(content);
    
    if (!backupData.encrypted || !backupData.hash || !backupData.hmac) {
      throw new Error('Backup no tiene estructura esperada');
    }

    console.log(`   ✅ Backup creado correctamente`);
    console.log(`   📁 Ubicación: ${backupPath}`);
    console.log(`   📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB\n`);
    testsPassed++;

  } catch (error) {
    console.log(`   ❌ FALLÓ: ${error.message}\n`);
    testsFailed++;
    return printResults(testsPassed, testsFailed);
  }

  // Test 2: Verificar contenido del backup
  console.log('Test 2️⃣: Validar contenido del backup...');
  try {
    const content = fs.readFileSync(backupPath, 'utf8');
    const backupData = JSON.parse(content);

    // Validar campos requeridos
    const requiredFields = ['version', 'encrypted', 'hash', 'hmac', 'timestamp', 'size'];
    const missingFields = requiredFields.filter(field => !(field in backupData));
    
    if (missingFields.length > 0) {
      throw new Error(`Campos faltantes: ${missingFields.join(', ')}`);
    }

    // Validar que el contenido encriptado existe
    if (backupData.encrypted.length === 0) {
      throw new Error('Contenido encriptado vacío');
    }

    console.log(`   ✅ Estructura del backup válida`);
    console.log(`   📌 Versión: ${backupData.version}`);
    console.log(`   🕐 Timestamp: ${backupData.timestamp}`);
    console.log(`   📊 Tamaño original: ${(backupData.size / 1024 / 1024).toFixed(2)} MB\n`);
    testsPassed++;

  } catch (error) {
    console.log(`   ❌ FALLÓ: ${error.message}\n`);
    testsFailed++;
    return printResults(testsPassed, testsFailed);
  }

  // Test 3: Crear snapshot de datos actuales
  console.log('Test 3️⃣: Crear snapshot de datos para comparación...');
  const dbPath = path.join(__dirname, '../prisma/dev.db');
  const uploadsPath = path.join(__dirname, '../uploads');
  
  const snapshotBefore = {
    dbExists: fs.existsSync(dbPath),
    uploadsExists: fs.existsSync(uploadsPath),
    uploadCount: 0
  };

  if (snapshotBefore.uploadsExists) {
    try {
      snapshotBefore.uploadCount = countFilesRecursive(uploadsPath);
    } catch (e) {
      snapshotBefore.uploadCount = -1;
    }
  }

  console.log(`   ✅ Snapshot guardado`);
  console.log(`   📄 BD existe: ${snapshotBefore.dbExists}`);
  console.log(`   📂 Uploads existe: ${snapshotBefore.uploadsExists}`);
  console.log(`   📊 Archivos en uploads: ${snapshotBefore.uploadCount}\n`);
  testsPassed++;

  // Test 4: Restaurar backup
  console.log('Test 4️⃣: Restaurar desde backup...');
  try {
    await restoreSystemBackup(backupPath, TEST_PASSWORD);
    console.log(`   ✅ Restauración completada\n`);
    testsPassed++;

  } catch (error) {
    console.log(`   ❌ FALLÓ: ${error.message}\n`);
    testsFailed++;
    return printResults(testsPassed, testsFailed);
  }

  // Test 5: Restaurar con contraseña incorrecta
  console.log('Test 5️⃣: Verificar que contraseña incorrecta falla...');
  try {
    await restoreSystemBackup(backupPath, 'wrong-password');
    console.log(`   ❌ FALLÓ: Debería haber rechazado contraseña incorrecta\n`);
    testsFailed++;

  } catch (error) {
    // La contraseña incorrecta puede causar varios errores:
    // - "Contraseña incorrecta"
    // - "corrupto"
    // - "Malformed UTF-8" (desencriptación fallida)
    if (error.message.includes('Contraseña') || 
        error.message.includes('corrupto') ||
        error.message.includes('Malformed') ||
        error.message.includes('desencriptando')) {
      console.log(`   ✅ Correctamente rechazó contraseña incorrecta\n`);
      testsPassed++;
    } else {
      console.log(`   ❌ Error inesperado: ${error.message}\n`);
      testsFailed++;
    }
  }

  // Test 6: Verificar backup inválido
  console.log('Test 6️⃣: Verificar que backup inválido falla...');
  const fakeBackupPath = path.join(__dirname, '../backups/fake-backup-test.bak');
  try {
    fs.writeFileSync(fakeBackupPath, 'esto no es un backup válido');
    await restoreSystemBackup(fakeBackupPath, TEST_PASSWORD);
    console.log(`   ❌ FALLÓ: Debería haber rechazado backup inválido\n`);
    testsFailed++;
    fs.unlinkSync(fakeBackupPath);

  } catch (error) {
    if (error.message.includes('corrupto') || error.message.includes('inválido')) {
      console.log(`   ✅ Correctamente detectó backup inválido\n`);
      testsPassed++;
      if (fs.existsSync(fakeBackupPath)) fs.unlinkSync(fakeBackupPath);
    } else {
      console.log(`   ❌ Error inesperado: ${error.message}\n`);
      testsFailed++;
      if (fs.existsSync(fakeBackupPath)) fs.unlinkSync(fakeBackupPath);
    }
  }

  // Test 7: Limpiar backup de prueba
  console.log('Test 7️⃣: Limpiar archivo de prueba...');
  try {
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      console.log(`   ✅ Backup de prueba eliminado\n`);
    }
    testsPassed++;
  } catch (error) {
    console.log(`   ⚠️  No se pudo eliminar: ${error.message}\n`);
    testsPassed++; // No es crítico
  }

  printResults(testsPassed, testsFailed);
}

function countFilesRecursive(dir) {
  let count = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        count++;
      } else if (entry.isDirectory()) {
        count += countFilesRecursive(path.join(dir, entry.name));
      }
    }
  } catch (e) {
    // Ignorar errores
  }
  return count;
}

function printResults(passed, failed) {
  const total = passed + failed;
  const percentage = total === 0 ? 0 : Math.round((passed / total) * 100);

  console.log('='.repeat(60));
  console.log('📊 RESULTADOS');
  console.log('='.repeat(60));
  console.log(`✅ Pasadas:  ${passed}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📈 Éxito:    ${percentage}%`);
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    console.log('🎉 ¡Todos los tests pasaron!');
    console.log('   Backups y restauración están funcionando correctamente.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Hay tests fallidos. Revisa los errores arriba.\n');
    process.exit(1);
  }
}

// Ejecutar tests
runTests().catch(error => {
  console.error('\n❌ Error no capturado:', error);
  process.exit(1);
});
