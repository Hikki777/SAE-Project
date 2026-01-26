/**
 * Crear excusas con diferentes estados para prueba
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const prisma = require('../backend/prismaClient');

async function crearExcusasDePrueba() {
  try {
    console.log('📝 Creando excusas de prueba con estados variados...\n');

    // Obtener un alumno
    const alumno = await prisma.alumno.findFirst();
    if (!alumno) {
      console.log('❌ No hay alumnos en la base de datos');
      process.exit(1);
    }

    const hoy = new Date();

    // Crear excusas con diferentes estados
    const datos = [
      {
        alumno_id: alumno.id,
        motivo: 'Consulta médica - Pendiente',
        descripcion: 'Necesita aprobación del director',
        estado: 'pendiente',
        fecha_ausencia: hoy
      },
      {
        alumno_id: alumno.id,
        motivo: 'Enfermedad - Pendiente',
        descripcion: 'Requiere certificado',
        estado: 'pendiente',
        fecha_ausencia: hoy
      },
      {
        alumno_id: alumno.id,
        motivo: 'Asunto familiar - Rechazada',
        descripcion: 'No cumple con requisitos',
        estado: 'rechazada',
        fecha_ausencia: hoy
      }
    ];

    for (const dato of datos) {
      const excusa = await prisma.excusa.create({ data: dato });
      console.log(`✓ Creada: ${excusa.motivo} (Estado: ${excusa.estado})`);
    }

    console.log('\n✅ Excusas de prueba creadas\n');

    // Mostrar resumen
    const total = await prisma.excusa.count();
    const pendientes = await prisma.excusa.count({ where: { estado: 'pendiente' } });
    const aprobadas = await prisma.excusa.count({ where: { estado: 'aprobada' } });
    const rechazadas = await prisma.excusa.count({ where: { estado: 'rechazada' } });

    console.log('📊 Resumen actual:');
    console.log(`  • Total: ${total}`);
    console.log(`  • Pendientes: ${pendientes}`);
    console.log(`  • Aprobadas: ${aprobadas}`);
    console.log(`  • Rechazadas: ${rechazadas}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

crearExcusasDePrueba();
