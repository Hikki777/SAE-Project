const { PrismaClient } = require('../backend/prisma-client');
const prisma = new PrismaClient();

async function checkSchema() {
  console.log('--- Database Schema Check ---');
  
  const tables = ['institucion', 'alumnos', 'personal', 'usuarios'];
  
  for (const table of tables) {
    try {
      const info = await prisma.$queryRawUnsafe(`PRAGMA table_info(${table})`);
      console.log(`Table: ${table}`);
      info.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
      });
    } catch (e) {
      console.log(`Error checking table ${table}: ${e.message}`);
    }
  }

  await prisma.$disconnect();
}

checkSchema();
