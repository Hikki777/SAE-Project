const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Script de "Ruta Única" para preparar la base de Datos Virgen.
 * Usa prisma migrate deploy (NO db push) para que la BD incluya
 * la tabla _prisma_migrations con todas las migraciones marcadas.
 * Esto permite al motor nativo de Electron saber qué ya está aplicado.
 */
async function prepareVirginDb() {
  const rootDir = path.resolve(__dirname, '..');

  // RUTA FUENTE: Una carpeta nueva que NO esté en el radar de electron-builder
  const targetDir = path.join(rootDir, 'build', 'temp_db');
  const virginDbPath = path.join(targetDir, 'virgin.db');
  const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
  const migrationsDir = path.join(rootDir, 'prisma', 'migrations');

  console.log('\n[BUILD-PREP] Generando Base de Datos Virgen (con migrate deploy)...');

  try {
    // 1. Limpiar directorio temporal
    if (fs.existsSync(targetDir)) {
      fs.removeSync(targetDir);
    }
    fs.ensureDirSync(targetDir);

    // ELIMINAR EXPLÍCITAMENTE SI EXISTE (Doble seguridad)
    if (fs.existsSync(virginDbPath)) {
      fs.unlinkSync(virginDbPath);
    }

    // 2. Crear la BD usando migrate deploy (registra en _prisma_migrations)
    console.log('   - Creando estructura de tablas via migrate deploy...');

    const absoluteVirginPath = virginDbPath.replace(/\\/g, '/');
    const dbUrl = `file:${absoluteVirginPath}`;

    // NOTA: migrate deploy aplica los migration.sql en orden y registra
    // cada uno en la tabla _prisma_migrations, lo que el motor nativo
    // de Electron necesita para saber qué migraciones ya están aplicadas.
    execSync(`npx prisma migrate deploy --schema="${schemaPath}"`, {
      env: {
        ...process.env,
        DATABASE_URL: dbUrl
      },
      cwd: rootDir,
      stdio: 'inherit'
    });

    // 3. Verificación
    if (fs.existsSync(virginDbPath)) {
      const stats = fs.statSync(virginDbPath);
      console.log(`\n[SUCCESS] Base de Datos Virgen lista: ${virginDbPath} (${stats.size} bytes)`);
      console.log('[INFO] _prisma_migrations incluida con todas las migraciones registradas.');
    } else {
      throw new Error('No se pudo generar el archivo virgin.db');
    }

  } catch (error) {
    console.error('\n[ERROR] Falló la preparación de la BD virgen:');
    console.error(error.message);
    process.exit(1);
  }
}

prepareVirginDb();
