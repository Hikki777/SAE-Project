const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('\n🧹 LIMPIANDO JUSTIFICACIONES DE PRUEBA...\n');
    
    // Eliminar todos los registros de excusa
    const deleted = await prisma.excusa.deleteMany();
    console.log(`✅ Eliminadas ${deleted.count} justificaciones`);

    // Ahora crear solo las 3 justificaciones correctas
    console.log('\n📝 CREANDO JUSTIFICACIONES CORRECTAS:\n');

    // 1. Kevin (Docente)
    const kevin = await prisma.personal.findFirst({
      where: { nombres: { contains: 'Kevin' } }
    });
    
    if (kevin) {
      const exc1 = await prisma.excusa.create({
        data: {
          motivo: 'Cita médica',
          descripcion: 'Consulta con especialista',
          fecha_ausencia: new Date(2026, 0, 25),
          estado: 'aprobada',
          personal_id: kevin.id
        }
      });
      console.log(`1. ✅ Kevin - ${exc1.motivo} (${exc1.estado})`);
    }

    // 2. Delia (Directora General)
    const delia = await prisma.personal.findFirst({
      where: { nombres: { contains: 'Delia' } }
    });
    
    if (delia) {
      const exc2 = await prisma.excusa.create({
        data: {
          motivo: 'Reunión institucional',
          descripcion: 'Reunión con supervisores',
          fecha_ausencia: new Date(2026, 0, 25),
          estado: 'aprobada',
          personal_id: delia.id
        }
      });
      console.log(`2. ✅ Delia - ${exc2.motivo} (${exc2.estado})`);
    }

    // 3. Vilma (Directora Técnica)
    const vilma = await prisma.personal.findFirst({
      where: { nombres: { contains: 'Vilma' } }
    });
    
    if (vilma) {
      const exc3 = await prisma.excusa.create({
        data: {
          motivo: 'Capacitación docente',
          descripcion: 'Participación en taller de pedagogía',
          fecha_ausencia: new Date(2026, 0, 25),
          estado: 'aprobada',
          personal_id: vilma.id
        }
      });
      console.log(`3. ✅ Vilma - ${exc3.motivo} (${exc3.estado})`);
    }

    console.log('\n✅ Base de datos actualizada correctamente\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
