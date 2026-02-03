const { PrismaClient } = require('../backend/prisma-client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

async function main() {
  console.log('Checking Prism connection...');
  try {
    const institucion = await prisma.institucion.findFirst();
    console.log('Institucion found:', institucion);
    if (institucion) {
        console.log('INSTITUCION OBJECT:', JSON.stringify(institucion, null, 2));
    }
    
    if (institucion && institucion.ciclo_escolar !== undefined) {
         console.log('SUCCESS: ciclo_escolar exists! Value:', institucion.ciclo_escolar);
    } else {
         console.warn('WARNING: institucion found but ciclo_escolar is undefined (or null)');
    }

    const alumnosCount = await prisma.alumno.count();
    const personalCount = await prisma.personal.count();
    console.log(`DATA CHECK: Alumnos=${alumnosCount}, Personal=${personalCount}`);

  } catch (e) {
    console.error('ERROR querying Prisma:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
