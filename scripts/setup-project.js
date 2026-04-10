const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const ENV_FILE = path.join(ROOT_DIR, '.env');
const ENV_EXAMPLE_FILE = path.join(ROOT_DIR, '.env.example');

console.log('🚀 Iniciando configuración interactiva de SAE...\n');

try {
  // 1. Verificar y crear .env
  console.log('📝 Verificando archivo .env...');
  if (!fs.existsSync(ENV_FILE)) {
    if (fs.existsSync(ENV_EXAMPLE_FILE)) {
      console.log('   ⚠️ Archivo .env no encontrado. Creando desde .env.example...');
      fs.copyFileSync(ENV_EXAMPLE_FILE, ENV_FILE);
      console.log('   ✅ Archivo .env creado. Puedes configurarlo más tarde.');
    } else {
      console.log('   ❌ No se encontró .env ni .env.example. Crea uno manualmente para las variables de entorno.');
    }
  } else {
    console.log('   ✅ Archivo .env ya existe.');
  }

  console.log('\n📦 Instalando dependencias del Backend...');
  execSync('npm install', { cwd: ROOT_DIR, stdio: 'inherit' });

  console.log('\n📦 Instalando dependencias del Frontend...');
  execSync('npm install', { cwd: FRONTEND_DIR, stdio: 'inherit' });

  // Prisma Client no funcionará sin base de datos si es dev, pero se debe generar.
  console.log('\n🗄️ Generando Prisma Client...');
  execSync('npx prisma generate', { cwd: ROOT_DIR, stdio: 'inherit' });

  console.log('\n🗄️ Inicializando Base de Datos (migraciones)...');
  // Usar "migrate deploy" en lugar de "db push" para no perder datos
  // "db push" puede ser destructivo con cambios de esquema; las migraciones son más seguras
  try {
    execSync('npx prisma migrate deploy', { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (e) {
    // Si no hay migraciones aún o falla, hacer db push como fallback
    console.log('⚠️  No hay migraciones o fallo en deploy. Intentando db push...');
    execSync('npx prisma db push', { cwd: ROOT_DIR, stdio: 'inherit' });
  }

  console.log('\n✅ Configuración completada exitosamente.');
  console.log('▶️  Puedes iniciar el sistema en desarrollo con: npm run dev');
  console.log('▶️  O generar un instalador con: npm run dist:win (Requiere Modo Desarrollador de Windows y terminal como Administrador)');

} catch (error) {
  console.error('\n❌ ERROR: La configuración falló en uno de los pasos.');
  console.error('Detalles del error:', error.message);
  process.exit(1);
}
