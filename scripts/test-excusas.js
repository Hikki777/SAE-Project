const prisma = require('../backend/prismaClient');

async function testExcusas() {
  try {
    // Verificar si existen alumnos
    const alumnos = await prisma.alumno.findMany({ take: 1 });
    if (!alumnos.length) {
      console.log('❌ No hay alumnos en la base de datos');
      process.exit(1);
    }

    const alumno = alumnos[0];
    console.log(`✓ Usando alumno: ${alumno.nombres} ${alumno.apellidos} (ID: ${alumno.id})`);

    // Contar excusas existentes
    const excusasCount = await prisma.excusa.count();
    console.log(`✓ Excusas actuales: ${excusasCount}`);

    if (excusasCount === 0 || excusasCount < 3) {
      console.log('\n📝 Creando 3 excusas de prueba...\n');

      const hoy = new Date();
      const datos = [
        {
          alumno_id: alumno.id,
          motivo: 'Enfermedad - Gripe',
          descripcion: 'Asistencia médica requerida',
          estado: 'pendiente',
          fecha_ausencia: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
        },
        {
          alumno_id: alumno.id,
          motivo: 'Cita médica',
          descripcion: 'Revisión oftalmológica',
          estado: 'aprobada',
          fecha_ausencia: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1)
        },
        {
          alumno_id: alumno.id,
          motivo: 'Asunto familiar',
          descripcion: 'Emergencia familiar urgente',
          estado: 'pendiente',
          fecha_ausencia: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 2)
        }
      ];

      for (const dato of datos) {
        const excusa = await prisma.excusa.create({ data: dato });
        console.log(`✓ Excusa creada: ${excusa.motivo} (Estado: ${excusa.estado})`);
      }

      console.log('\n✅ Excusas de prueba creadas exitosamente');
    } else {
      console.log('\n✓ Ya existen excusas en la base de datos');
      
      // Mostrar excusas actuales
      const excusas = await prisma.excusa.findMany({
        include: {
          alumno: { select: { nombres: true, apellidos: true } }
        }
      });

      console.log('\n📋 Excusas en el sistema:');
      excusas.forEach(e => {
        console.log(`  • ${e.alumno?.nombres} ${e.alumno?.apellidos}: ${e.motivo} (${e.estado})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testExcusas();
