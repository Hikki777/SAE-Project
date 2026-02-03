#!/usr/bin/env node

/**
 * Script de verificación post-compilación del instalador
 */

const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\Kevin\\Documents\\Proyectos\\Sistema de Administración Educativa';
const releaseDir = path.join(projectRoot, 'release');

console.log('\n' + '='.repeat(60));
console.log('VERIFICACIÓN DEL INSTALADOR GENERADO');
console.log('='.repeat(60) + '\n');

// 1. Verificar que el instalador existe
console.log('1. Buscando instalador...');
const installers = fs.readdirSync(releaseDir)
    .filter(f => f.endsWith('.exe') && !f.includes('uninstaller'));

if (installers.length > 0) {
    installers.forEach(installer => {
        const fullPath = path.join(releaseDir, installer);
        const stats = fs.statSync(fullPath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        
        console.log(`   ✓ ${installer}`);
        console.log(`     Tamaño: ${sizeMB} MB`);
        console.log(`     Ruta: ${fullPath}\n`);
    });
} else {
    console.log('   ✗ No se encontró instalador\n');
    process.exit(1);
}

// 2. Verificar que win-unpacked existe
console.log('2. Verificando contenidos extraídos...');
const winUnpackedDir = path.join(releaseDir, 'win-unpacked');
if (fs.existsSync(winUnpackedDir)) {
    const contents = fs.readdirSync(winUnpackedDir);
    console.log(`   ✓ Directorio win-unpacked existe con ${contents.length} elementos\n`);
    
    // Verificar que los directorios principales existen
    const requiredDirs = ['resources', 'node_modules'];
    requiredDirs.forEach(dir => {
        const dirPath = path.join(winUnpackedDir, dir);
        if (fs.existsSync(dirPath)) {
            console.log(`   ✓ Directorio "${dir}" presente`);
        } else {
            console.log(`   ⚠ Directorio "${dir}" no encontrado`);
        }
    });
    console.log('');
} else {
    console.log('   ✗ No se encontró directorio win-unpacked\n');
}

// 3. Verificar Prisma
console.log('3. Verificando Prisma...');
const prismaPath = path.join(winUnpackedDir, 'resources', 'node_modules', '.prisma');
if (fs.existsSync(prismaPath)) {
    const files = fs.readdirSync(prismaPath);
    console.log(`   ✓ Prisma incluido (${files.length} elementos)\n`);
} else {
    console.log('   ⚠ Prisma no encontrado en ruta esperada\n');
}

// 4. Verificar frontend dist
console.log('4. Verificando frontend compilado...');
const distPath = path.join(winUnpackedDir, 'resources', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`   ✓ Frontend dist incluido (${files.length} archivos)\n`);
} else {
    console.log('   ⚠ Frontend dist no encontrado\n');
}

console.log('='.repeat(60));
console.log('✓ INSTALADOR GENERADO EXITOSAMENTE');
console.log('='.repeat(60) + '\n');

console.log('Próximos pasos:');
console.log('1. Ejecuta el instalador:');
installers.forEach(installer => {
    console.log(`   "${path.join(releaseDir, installer)}"`);
});
console.log('\n2. Verifica que el instalador muestre:');
console.log('   - Logo de SAE en la ventana');
console.log('   - Detalles de los archivos siendo instalados');
console.log('   - Barra de progreso que avance coherentemente');
console.log('\n3. Después de instalar, verifica que:');
console.log('   - La aplicación se ejecute sin errores');
console.log('   - Los datos se almacenen en AppData\\Roaming\\SAE');
console.log('');
