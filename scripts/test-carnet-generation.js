/**
 * Script de prueba para el sistema de doble secuencia de carnets
 */

const { PrismaClient } = require('@prisma/client');
const { generateAlumnoCarnet, generatePersonalCarnet } = require('../backend/utils/carnetGenerator');

const prisma = new PrismaClient();

async function testCarnetGeneration() {
  console.log('🧪 Iniciando prueba del sistema de carnets...\n');

  try {
    // Verificar estado inicial de contadores
    const institucionInicial = await prisma.institucion.findFirst({
      select: {
        carnet_counter_personal: true,
        carnet_counter_alumnos: true
      }
    });

    console.log('📊 Estado inicial de contadores:');
    console.log(`   ├─ Personal: ${institucionInicial.carnet_counter_personal}`);
    console.log(`   └─ Alumnos: ${institucionInicial.carnet_counter_alumnos}\n`);

    // Prueba 1: Generar carnet de Docente
    console.log('📝 Prueba 1: Generando carnet de Docente...');
    const carnetDocente = await generatePersonalCarnet('Docente');
    console.log(`   ✅ Carnet generado: ${carnetDocente}\n`);

    // Prueba 2: Generar carnet de Auxiliar
    console.log('📝 Prueba 2: Generando carnet de Auxiliar...');
    const carnetAuxiliar = await generatePersonalCarnet('Auxiliar');
    console.log(`   ✅ Carnet generado: ${carnetAuxiliar}\n`);

    // Prueba 3: Generar carnet de Secretaria
    console.log('📝 Prueba 3: Generando carnet de Secretaria...');
    const carnetSecretaria = await generatePersonalCarnet('Secretaria');
    console.log(`   ✅ Carnet generado: ${carnetSecretaria}\n`);

    // Prueba 4: Generar carnet de Alumno
    console.log('📝 Prueba 4: Generando carnet de Alumno...');
    const carnetAlumno1 = await generateAlumnoCarnet();
    console.log(`   ✅ Carnet generado: ${carnetAlumno1}\n`);

    // Prueba 5: Generar otro carnet de Alumno
    console.log('📝 Prueba 5: Generando segundo carnet de Alumno...');
    const carnetAlumno2 = await generateAlumnoCarnet();
    console.log(`   ✅ Carnet generado: ${carnetAlumno2}\n`);

    // Verificar estado final de contadores
    const institucionFinal = await prisma.institucion.findFirst({
      select: {
        carnet_counter_personal: true,
        carnet_counter_alumnos: true
      }
    });

    console.log('📊 Estado final de contadores:');
    console.log(`   ├─ Personal: ${institucionFinal.carnet_counter_personal} (+${institucionFinal.carnet_counter_personal - institucionInicial.carnet_counter_personal})`);
    console.log(`   └─ Alumnos: ${institucionFinal.carnet_counter_alumnos} (+${institucionFinal.carnet_counter_alumnos - institucionInicial.carnet_counter_alumnos})\n`);

    // Verificación de secuencias
    console.log('✅ VERIFICACIÓN DE SECUENCIAS:\n');
    
    console.log('🔹 Secuencia de PERSONAL (compartida):');
    console.log(`   ├─ Docente:    ${carnetDocente}`);
    console.log(`   ├─ Auxiliar:   ${carnetAuxiliar}`);
    console.log(`   └─ Secretaria: ${carnetSecretaria}`);
    
    // Extraer números
    const numDocente = parseInt(carnetDocente.slice(-3));
    const numAuxiliar = parseInt(carnetAuxiliar.slice(-3));
    const numSecretaria = parseInt(carnetSecretaria.slice(-3));
    
    if (numDocente + 1 === numAuxiliar && numAuxiliar + 1 === numSecretaria) {
      console.log('   ✅ Secuencia correcta: incrementa consecutivamente\n');
    } else {
      console.log('   ❌ ERROR: Secuencia incorrecta\n');
    }

    console.log('🔹 Secuencia de ALUMNOS (independiente):');
    console.log(`   ├─ Alumno 1: ${carnetAlumno1}`);
    console.log(`   └─ Alumno 2: ${carnetAlumno2}`);
    
    // Extraer números
    const numAlumno1 = parseInt(carnetAlumno1.slice(-3));
    const numAlumno2 = parseInt(carnetAlumno2.slice(-3));
    
    if (numAlumno1 + 1 === numAlumno2) {
      console.log('   ✅ Secuencia correcta: incrementa consecutivamente\n');
    } else {
      console.log('   ❌ ERROR: Secuencia incorrecta\n');
    }

    console.log('🎉 Prueba completada exitosamente!\n');

    // Limpiar (revertir contadores)
    console.log('🔄 Revirtiendo cambios en los contadores...');
    await prisma.institucion.update({
      where: { id: institucionInicial.id || 1 },
      data: {
        carnet_counter_personal: institucionInicial.carnet_counter_personal,
        carnet_counter_alumnos: institucionInicial.carnet_counter_alumnos
      }
    });
    console.log('✅ Contadores revertidos al estado inicial\n');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar prueba
if (require.main === module) {
  testCarnetGeneration()
    .then(() => {
      console.log('✅ Script finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { testCarnetGeneration };
