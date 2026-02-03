const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Querying PRAGMA table_info(Institucion)...');
    
    // Consultar columnas físicas de SQLite
    const result = await prisma.$queryRawUnsafe('PRAGMA table_info(Institucion)');
    console.log('Result:', result);

    const hasCiclo = result.some(col => col.name === 'ciclo_escolar');
    
    if (hasCiclo) {
        console.log('SUCCESS: Column "ciclo_escolar" is PHYSICALLY present in the DB.');
    } else {
        console.error('FAILURE: Column "ciclo_escolar" is MISSING from the DB.');
    }
    
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
