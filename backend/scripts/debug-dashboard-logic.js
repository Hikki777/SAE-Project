const prisma = require('../prismaClient');

async function main() {
  console.log('--- Debugging Dashboard Logic ---');
  try {
    // 1. Alumnos
    console.log('1. Fetching Alumnos...');
    const alumnos = await prisma.alumno.findMany({
      select: {
        id: true,
        estado: true,
        grado: true,
        nivel_actual: true,
        sexo: true
      }
    });
    console.log(`   Fetched ${alumnos.length} alumnos`);

    // 2. Personal
    console.log('2. Fetching Personal...');
    const personal = await prisma.personal.count();
    console.log(`   Personal count: ${personal}`);

    // 3. Asistencias Hoy
    console.log('3. Fetching Asistencias Hoy...');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    const asistenciasHoy = await prisma.asistencia.count({
      where: {
        timestamp: { gte: hoy, lt: manana }
      }
    });
    console.log(`   Asistencias Hoy: ${asistenciasHoy}`);

    // 4. QRs
    console.log('4. Fetching QRs...');
    const qrs = await prisma.codigoQr.count();
    console.log(`   QRs count: ${qrs}`);

    // 5. Excusas
    console.log('5. Fetching Excusas...');
    const excusas = await prisma.excusa.count({ where: { estado: 'pendiente' } });
    console.log(`   Excusas pendientes: ${excusas}`);

    console.log('--- ALL CHECKS PASSED ---');

  } catch (error) {
    console.error('CRASHED:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
