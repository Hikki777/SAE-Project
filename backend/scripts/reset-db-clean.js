const path = require('path');
const fs = require('fs');
// Usar nuestro wrapper de Prisma para asegurar la ruta correcta de la DB
const prisma = require('../prismaClient');

/**
 * Script de limpieza profunda
 * 1. Borra todos los registros de la BD
 * 2. Limpia la carpeta uploads (excepto .gitkeep y estructura base)
 * 3. Reinicia contadores (incluyendo el nuevo global)
 */
async function resetDatabaseClean() {
  console.log('[RESET] Iniciando limpieza PROFUNDA del sistema...');
  
  // 1. Limpiar BD
  try {
    console.log('[1/3] Limpiando base de datos...');
    
    // Orden de borrado para respetar FKs
    const deleteOperations = [
      prisma.diagnosticResult.deleteMany(),
      prisma.auditoria.deleteMany(),
      prisma.excusa.deleteMany(),
      prisma.asistencia.deleteMany(),
      prisma.codigoQr.deleteMany(),
      prisma.historialAcademico.deleteMany(),
      prisma.alumno.deleteMany(),
      prisma.personal.deleteMany(),
      prisma.usuario.deleteMany(), // Borra usuarios también
      prisma.institucion.deleteMany(), // Borra configuración de institución
      prisma.equipo.deleteMany(), // Borra equipos
    ];

    await prisma.$transaction(deleteOperations);
    console.log('   [OK] Tablas vaciadas.');

  } catch (error) {
    console.error('[ERROR] Falló la limpieza de BD:', error);
    process.exit(1);
  }

  // 2. Limpiar Uploads
  try {
    console.log('[2/3] Limpiando archivos subidos (uploads)...');
    
    // Ruta correcta a uploads (desde backend/scripts/ a root/uploads)
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    
    if (fs.existsSync(uploadsDir)) {
      cleanDirectory(uploadsDir);
      console.log('   [OK] Archivos eliminados.');
    } else {
      console.log('   [WARN] Carpeta uploads no encontrada en:', uploadsDir);
    }

  } catch (error) {
    console.error('[ERROR] Falló la limpieza de archivos:', error);
    // No detenemos el proceso, es advertencia
  }
  
  console.log('[3/3] [OK] Sistema restablecido completamente. Listo para Setup Wizard.');
  process.exit(0);
}

/**
 * Función recursiva para limpiar archivos pero mantener carpetas
 */
function cleanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      cleanDirectory(fullPath);
      // Opcional: Borrar carpeta si está vacía, pero mejor mantener estructura
    } else {
      // Es archivo
      if (entry.name !== '.gitkeep') {
        try {
          fs.unlinkSync(fullPath);
          // console.log(`Deleted: ${entry.name}`);
        } catch (e) {
          console.error(`Failed to delete ${fullPath}:`, e.message);
        }
      }
    }
  }
}

resetDatabaseClean();
