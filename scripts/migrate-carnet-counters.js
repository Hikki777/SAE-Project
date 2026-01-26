/**
 * Script de migración para establecer contadores iniciales de carnets
 * 
 * Este script:
 * 1. Analiza todos los carnets existentes de personal y alumnos
 * 2. Extrae el número más alto de cada secuencia
 * 3. Establece los contadores en la institución
 * 
 * IMPORTANTE: Ejecutar antes de generar nuevos carnets con el nuevo sistema
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function extractCarnetNumber(carnet) {
  try {
    // Formato: PREFIJO-YYYYNNN
    // Extraer los últimos 3 dígitos
    const numberPart = carnet.slice(-3);
    return parseInt(numberPart, 10);
  } catch (error) {
    console.error(`Error extrayendo número de carnet ${carnet}:`, error.message);
    return 0;
  }
}

async function migrateCarnetCounters() {
  console.log('🔄 Iniciando migración de contadores de carnets...\n');

  try {
    // 1. Obtener todos los carnets de personal
    const allPersonal = await prisma.personal.findMany({
      select: { carnet: true }
    });

    console.log(`📋 Personal encontrado: ${allPersonal.length}`);

    let maxPersonalNumber = 0;
    for (const person of allPersonal) {
      const number = await extractCarnetNumber(person.carnet);
      if (number > maxPersonalNumber) {
        maxPersonalNumber = number;
      }
    }

    console.log(`   └─ Número máximo de personal: ${maxPersonalNumber}`);

    // 2. Obtener todos los carnets de alumnos
    const allAlumnos = await prisma.alumno.findMany({
      select: { carnet: true }
    });

    console.log(`📋 Alumnos encontrados: ${allAlumnos.length}`);

    let maxAlumnoNumber = 0;
    for (const alumno of allAlumnos) {
      const number = await extractCarnetNumber(alumno.carnet);
      if (number > maxAlumnoNumber) {
        maxAlumnoNumber = number;
      }
    }

    console.log(`   └─ Número máximo de alumnos: ${maxAlumnoNumber}\n`);

    // 3. Actualizar la institución con los contadores
    const institucion = await prisma.institucion.findFirst();
    
    if (!institucion) {
      throw new Error('No se encontró la institución en la base de datos');
    }

    await prisma.institucion.update({
      where: { id: institucion.id },
      data: {
        carnet_counter_personal: maxPersonalNumber,
        carnet_counter_alumnos: maxAlumnoNumber
      }
    });

    console.log('✅ Contadores actualizados exitosamente:');
    console.log(`   ├─ Personal: ${maxPersonalNumber}`);
    console.log(`   └─ Alumnos: ${maxAlumnoNumber}\n`);

    // 4. Mostrar ejemplos de próximos carnets
    const cicloEscolar = institucion.ciclo_escolar || new Date().getFullYear();
    
    console.log('📝 Próximos carnets que se generarán:');
    console.log(`   ├─ Personal: DIR-${cicloEscolar}${String(maxPersonalNumber + 1).padStart(3, '0')}`);
    console.log(`   └─ Alumno: A-${cicloEscolar}${String(maxAlumnoNumber + 1).padStart(3, '0')}\n`);

    console.log('🎉 Migración completada con éxito!\n');

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración si este archivo se ejecuta directamente
if (require.main === module) {
  migrateCarnetCounters()
    .then(() => {
      console.log('✅ Script finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { migrateCarnetCounters };
