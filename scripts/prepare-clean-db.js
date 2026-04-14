const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Script de "Ruta Única" para preparar la base de Datos Virgen.
 * Evita confusiones con la base de datos de desarrollo (dev.db).
 */
async function prepareVirginDb() {
  const rootDir = path.resolve(__dirname, '..');
  
  // RUTA FUENTE: Una carpeta nueva que NO esté en el radar de electron-builder
  const targetDir = path.join(rootDir, 'build', 'temp_db');
  const virginDbPath = path.join(targetDir, 'virgin.db');
  const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');

  console.log('\n[BUILD-PREP] Generando Base de Datos Virgen (Ruta Única)...');

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

    // 2. Generar BD desde el esquema
    console.log('   - Creando estructura de tablas limpia...');
    
    // Ejecutar prisma db push apuntando al nuevo archivo virgin.db
    // Usamos una ruta absoluta para evitar ambigüedades
    const absoluteVirginPath = virginDbPath.replace(/\\/g, '/');
    
    // NOTA: prisma db push NO ejecuta seeds, por lo que la BD estará vacía por naturaleza
    execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss --skip-generate`, {
      env: {
        ...process.env,
        DATABASE_URL: `file:${absoluteVirginPath}`
      },
      cwd: projectRoot, // Cambiado rootDir por projectRoot si corresponde, pero aquí es rootDir
      stdio: 'inherit'
    });

    // 3. Verificación
    if (fs.existsSync(virginDbPath)) {
      const stats = fs.statSync(virginDbPath);
      console.log(`\n[SUCCESS] Base de Datos Virgen lista: ${virginDbPath} (${stats.size} bytes)`);
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
