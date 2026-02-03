#!/usr/bin/env node

/**
 * Script de verificación del instalador
 * Verifica que todos los componentes estén correctamente configurados
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

console.log('\n' + '='.repeat(50));
console.log('VERIFICACIÓN DE CONFIGURACIÓN DEL INSTALADOR');
console.log('='.repeat(50) + '\n');

const checks = [];

// Verificación 1: Logo
console.log('1. Verificando logo del instalador...');
const logoPath = path.join(projectRoot, 'frontend', 'public', 'logo.ico');
if (fs.existsSync(logoPath)) {
    const stats = fs.statSync(logoPath);
    console.log(`   ✓ Logo encontrado: ${(stats.size / 1024).toFixed(2)} KB\n`);
    checks.push(true);
} else {
    console.log(`   ✗ Logo NO encontrado en: ${logoPath}\n`);
    checks.push(false);
}

// Verificación 2: Script NSIS
console.log('2. Verificando script NSIS...');
const nsisPath = path.join(projectRoot, 'build', 'installer.nsh');
if (fs.existsSync(nsisPath)) {
    const content = fs.readFileSync(nsisPath, 'utf8');
    if (content.includes('customHeader') && content.includes('customInit')) {
        console.log('   ✓ Script NSIS configurado correctamente\n');
        checks.push(true);
    } else {
        console.log('   ✗ Script NSIS incompleto\n');
        checks.push(false);
    }
} else {
    console.log(`   ✗ Script NSIS NO encontrado en: ${nsisPath}\n`);
    checks.push(false);
}

// Verificación 3: package.json - build.nsis
console.log('3. Verificando configuración NSIS en package.json...');
const packagePath = path.join(projectRoot, 'package.json');
const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const nsisConfig = packageContent.build?.nsis;
if (nsisConfig) {
    const requiredFields = ['installerIcon', 'uninstallerIcon', 'installerHeaderIcon', 'include'];
    const allPresent = requiredFields.every(field => nsisConfig[field]);
    
    if (allPresent) {
        console.log('   ✓ Configuración NSIS completa\n');
        checks.push(true);
    } else {
        console.log('   ✗ Configuración NSIS incompleta\n');
        checks.push(false);
    }
} else {
    console.log('   ✗ No hay configuración NSIS en package.json\n');
    checks.push(false);
}

// Verificación 4: prismaClient.js
console.log('4. Verificando configuración de Prisma...');
const prismaClientPath = path.join(projectRoot, 'backend', 'prismaClient.js');
if (fs.existsSync(prismaClientPath)) {
    const content = fs.readFileSync(prismaClientPath, 'utf8');
    if (content.includes('NODE_ENV') && content.includes('appData')) {
        console.log('   ✓ Prisma configurado para producción\n');
        checks.push(true);
    } else {
        console.log('   ⚠ Prisma podría necesitar configuración adicional\n');
        checks.push(false);
    }
} else {
    console.log(`   ✗ archivo prismaClient.js NO encontrado\n`);
    checks.push(false);
}

// Verificación 5: electron/main.js
console.log('5. Verificando configuración de Electron...');
const electronMainPath = path.join(projectRoot, 'electron', 'main.js');
if (fs.existsSync(electronMainPath)) {
    const content = fs.readFileSync(electronMainPath, 'utf8');
    if (content.includes('app.getPath') && content.includes('NODE_ENV')) {
        console.log('   ✓ Electron configurado para manejo de entorno\n');
        checks.push(true);
    } else {
        console.log('   ⚠ Electron podría necesitar mejoras\n');
        checks.push(false);
    }
} else {
    console.log(`   ✗ archivo electron/main.js NO encontrado\n`);
    checks.push(false);
}

// Verificación 6: Frontend dist
console.log('6. Verificando build del frontend...');
const distPath = path.join(projectRoot, 'frontend', 'dist');
if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    if (files.length > 0) {
        console.log(`   ✓ Frontend compilado (${files.length} archivos)\n`);
        checks.push(true);
    } else {
        console.log('   ✗ Carpeta dist está vacía\n');
        checks.push(false);
    }
} else {
    console.log('   ⚠ Frontend aún no ha sido compilado (necesita npm run build:frontend)\n');
    checks.push(false);
}

// Verificación 7: extraResources
console.log('7. Verificando extraResources en package.json...');
const extraResources = packageContent.build?.extraResources;
if (extraResources && Array.isArray(extraResources)) {
    const hasPrisma = extraResources.some(res => res.from?.includes('.prisma'));
    const hasSchema = extraResources.some(res => res.from?.includes('schema.prisma'));
    
    if (hasPrisma && hasSchema) {
        console.log('   ✓ Prisma está incluido en extraResources\n');
        checks.push(true);
    } else {
        console.log('   ✗ Prisma NO está correctamente incluido\n');
        checks.push(false);
    }
} else {
    console.log('   ✗ extraResources no configurado\n');
    checks.push(false);
}

// Resumen
console.log('='.repeat(50));
const passedChecks = checks.filter(c => c === true).length;
const totalChecks = checks.length;
const percentage = Math.round((passedChecks / totalChecks) * 100);

console.log(`RESULTADO: ${passedChecks}/${totalChecks} verificaciones pasadas (${percentage}%)\n`);

if (percentage === 100) {
    console.log('✓ EXCELENTE: Todo está configurado correctamente'.green);
    console.log('\nPasos siguientes:');
    console.log('1. Ejecuta: npm run build:frontend');
    console.log('2. Ejecuta: npm run dist:win');
    console.log('3. Busca el instalador en la carpeta "release"');
} else if (percentage >= 80) {
    console.log('⚠ ADVERTENCIA: Hay algunos problemas menores');
    console.log('\nRecomendaciones:');
    console.log('1. Revisa las verificaciones que fallaron');
    console.log('2. Completa la configuración antes de generar el instalador');
} else {
    console.log('✗ ERROR: Hay problemas significativos');
    console.log('\nDebes resolver todos los problemas antes de generar el instalador');
}

console.log('\n' + '='.repeat(50) + '\n');

process.exit(percentage === 100 ? 0 : 1);
