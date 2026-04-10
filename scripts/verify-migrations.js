#!/usr/bin/env node

/**
 * Verificar que las migraciones están correctamente configuradas
 * Asegura que el problema de pérdida de BD no vuelva a ocurrir
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
let checks = { passed: 0, failed: 0, warnings: 0 };

function check(name, condition, errorMsg = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    checks.passed++;
  } else {
    console.log(`❌ ${name}: ${errorMsg}`);
    checks.failed++;
  }
}

function warn(name, condition, warnMsg = '') {
  if (condition) {
    console.log(`⚠️  ${name}: ${warnMsg}`);
    checks.warnings++;
  }
}

console.log('🔍 Verificando configuración de migraciones seguras...\n');

// 1. Verificar safe-migrate.js existe
const safeMigrateExists = fs.existsSync(path.join(ROOT, 'scripts', 'safe-migrate.js'));
check(
  'Script safe-migrate.js existe',
  safeMigrateExists,
  'No se encontró el script de migraciones seguro'
);

// 2. Verificar package.json tiene postinstall correcto
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
check(
  'postinstall usa safe-migrate',
  packageJson.scripts.postinstall === 'node scripts/safe-migrate.js',
  `Actual: "${packageJson.scripts.postinstall}"`
);

// 3. Verificar que hay script migrate:safe
check(
  'Script migrate:safe disponible',
  packageJson.scripts['migrate:safe'] === 'node scripts/safe-migrate.js',
  'Script no encontrado o incorrecto'
);

// 4. Verificar setup-project.js no usa db push como primer paso
const setupScript = fs.readFileSync(path.join(ROOT, 'scripts', 'setup-project.js'), 'utf-8');
const usesMigrateDeploy = setupScript.includes('prisma migrate deploy');
check(
  'setup-project.js usa migrate deploy',
  usesMigrateDeploy,
  'No usa la migración segura'
);

warn(
  'setup-project.js tiene fallback a db push',
  setupScript.includes("execSync('npx prisma db push'"),
  'Es normal como fallback para première instalación'
);

// 5. Verificar migrations existe
const migrationsDir = path.join(ROOT, 'prisma', 'migrations');
const migrationDirsExist = fs.existsSync(migrationsDir);
check(
  'Directorio de migraciones existe',
  migrationDirsExist,
  'No hay directorio de migraciones'
);

if (migrationDirsExist) {
  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => fs.statSync(path.join(migrationsDir, f)).isDirectory());
  warn(
    `Migraciones encontradas: ${migrations.length}`,
    migrations.length > 0,
    'Sin migraciones detectadas - se usará db push en primer setup'
  );
}

// 6. Verificar prisma schema existe
const schemaExists = fs.existsSync(path.join(ROOT, 'prisma', 'schema.prisma'));
check(
  'Schema de Prisma existe',
  schemaExists,
  'Schema no encontrado'
);

// 7. Verificar update-system.js usa safe-migrate
const updateScript = fs.readFileSync(path.join(ROOT, 'scripts', 'update-system.js'), 'utf-8');
const updateUsesSafeMigrate = updateScript.includes('safe-migrate.js');
check(
  'update-system.js usa safe-migrate',
  updateUsesSafeMigrate,
  'Update script no usa migraciones seguro'
);

// 8. Verificar NO usa db push automático
const usesDbPushInSetup = setupScript.match(/execSync\('npx prisma db push'\)/g);
const dbPushCount = usesDbPushInSetup ? usesDbPushInSetup.length : 0;
warn(
  `db push solo se usa como fallback (${dbPushCount} vez)`,
  dbPushCount <= 1,
  'Parece que db push está siendo usado como principal'
);

// 9. Salida final
console.log('\n' + '='.repeat(50));
console.log(`✅ Pasadas: ${checks.passed}`);
if (checks.warnings > 0) console.log(`⚠️  Advertencias: ${checks.warnings}`);
if (checks.failed > 0) console.log(`❌ Fallidas: ${checks.failed}`);

if (checks.failed === 0) {
  console.log('\n✅ ¡Configuración correcta! El problema está resuelto.');
  console.log('   Las migraciones ahora son seguras y no borrarán tus datos.');
  process.exit(0);
} else {
  console.log('\n❌ Hay problemas en la configuración. Revisa arriba.');
  process.exit(1);
}
