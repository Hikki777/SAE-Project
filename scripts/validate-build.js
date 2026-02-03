const fs = require('fs');
const path = require('path');

const releaseDir = path.join(__dirname, '../release/win-unpacked/resources');
const appUnpacked = path.join(releaseDir, 'app.asar.unpacked');

console.log('🔍 Validando Build en:', releaseDir);

const checks = [
  { name: 'Node.exe externo', path: path.join(releaseDir, 'node.exe') },
  { name: 'Backend Folder', path: path.join(appUnpacked, 'backend') },
  { name: 'Server.js', path: path.join(appUnpacked, 'backend/server.js') },
  { name: 'Prisma Folder (Resources)', path: path.join(releaseDir, 'prisma') },
  { name: 'Node Modules', path: path.join(appUnpacked, 'node_modules') },
  { name: 'Express Module', path: path.join(appUnpacked, 'node_modules/express') },
  { name: 'Prisma Client', path: path.join(appUnpacked, 'node_modules/@prisma/client') },
];

let errors = 0;

checks.forEach(check => {
  if (fs.existsSync(check.path)) {
    console.log(`✅ [OK] ${check.name}`);
  } else {
    console.error(`❌ [FAIL] ${check.name} NO ENCONTRADO en: ${check.path}`);
    errors++;
  }
});

if (errors === 0) {
  console.log('\n✨ Build OK! Todos los archivos críticos existen.');
} else {
  console.error(`\n🔥 Build INCOMPLETO. Faltan ${errors} archivos críticos.`);
  process.exit(1);
}
