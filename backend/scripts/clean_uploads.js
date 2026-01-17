const fs = require('fs-extra');
const path = require('path');

/**
 * Script para limpiar archivos antiguos de uploads
 * Elimina QRs, fotos de perfil, logos, etc.
 */

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

async function cleanUploads() {
  console.log('🧹 Iniciando limpieza de archivos antiguos...\n');

  const directories = [
    'alumnos',
    'docentes',
    'personal',
    'qrs',
    'logos',
    'usuarios',
    'documentos'
  ];

  let totalDeleted = 0;

  for (const dir of directories) {
    const dirPath = path.join(UPLOADS_DIR, dir);
    
    try {
      // Verificar si el directorio existe
      if (await fs.pathExists(dirPath)) {
        // Leer archivos en el directorio
        const files = await fs.readdir(dirPath);
        
        if (files.length > 0) {
          console.log(`📁 ${dir}/`);
          
          // Eliminar cada archivo
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);
            
            if (stats.isFile()) {
              await fs.remove(filePath);
              console.log(`   ❌ Eliminado: ${file}`);
              totalDeleted++;
            }
          }
          
          console.log('');
        } else {
          console.log(`📁 ${dir}/ - Ya está vacío ✓\n`);
        }
      } else {
        console.log(`📁 ${dir}/ - No existe (se creará al usarse) ✓\n`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${dir}:`, error.message);
    }
  }

  console.log('='.repeat(50));
  console.log(`✅ Limpieza completada!`);
  console.log(`📊 Total de archivos eliminados: ${totalDeleted}`);
  console.log('='.repeat(50));
  console.log('\n💡 Los directorios se mantienen para uso futuro.');
  console.log('💡 Al agregar nuevos alumnos/personal, se crearán nuevos archivos.\n');
}

// Ejecutar limpieza
cleanUploads()
  .then(() => {
    console.log('✓ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  });
