const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const excusas = await prisma.excusa.findMany({
      include: {
        alumno: {
          select: { id: true, nombres: true, apellidos: true, carnet: true }
        },
        personal: {
          select: { id: true, nombres: true, apellidos: true, carnet: true, cargo: true }
        }
      },
      orderBy: { fecha_ausencia: 'desc' }
    });

    console.log('\n📋 JUSTIFICACIONES EN LA BASE DE DATOS:\n');
    excusas.forEach((exc, idx) => {
      const persona = exc.alumno || exc.personal;
      console.log(`${idx + 1}. ${persona?.nombres} ${persona?.apellidos} (${persona?.carnet})`);
      console.log(`   Motivo: ${exc.motivo}`);
      console.log(`   Estado: ${exc.estado}`);
      console.log(`   Fecha: ${new Date(exc.fecha_ausencia).toLocaleDateString('es-ES')}`);
      console.log('');
    });

    console.log(`\n✅ Total de justificaciones: ${excusas.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
