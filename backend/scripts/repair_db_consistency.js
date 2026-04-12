const { PrismaClient } = require('../prisma-client');
const prisma = new PrismaClient();

async function repair() {
  console.log('--- Starting Database Repair ---');

  // 1. Repair Genders
  const genderMap = {
    'M': 'Masculino',
    'F': 'Femenino',
    'm': 'Masculino',
    'f': 'Femenino'
  };

  const tables = ['alumno', 'personal', 'usuario'];
  
  for (const table of tables) {
    console.log(`Checking genders in table: ${table}...`);
    const records = await prisma[table].findMany({
      where: {
        OR: [
          { sexo: { in: ['M', 'F', 'm', 'f'] } },
          { sexo: null },
          { sexo: '' }
        ]
      }
    });

    console.log(`  Found ${records.length} records to update.`);
    for (const record of records) {
      let newSexo = record.sexo;
      if (genderMap[record.sexo]) {
        newSexo = genderMap[record.sexo];
      } else if (!record.sexo) {
        // Default for Admin or others if null
        newSexo = 'Masculino'; 
      }

      if (newSexo !== record.sexo) {
        await prisma[table].update({
          where: { id: record.id },
          data: { sexo: newSexo }
        });
      }
    }
  }

  // 2. Nomenclature: 6to. Diversificado -> Graduandos
  console.log('Updating nomenclature: 6to. Diversificado -> Graduandos...');
  
  const alumnos6to = await prisma.alumno.updateMany({
    where: { grado: '6to. Diversificado' },
    data: { grado: 'Graduandos' }
  });
  console.log(`  Updated ${alumnos6to.count} alumnos.`);

  const personal6to = await prisma.personal.updateMany({
    where: { grado_guia: '6to. Diversificado' },
    data: { grado_guia: 'Graduandos' }
  });
  console.log(`  Updated ${personal6to.count} personal guia.`);

  console.log('--- Database Repair Completed ---');
  await prisma.$disconnect();
}

repair().catch(err => {
  console.error('Fatal error during repair:', err);
  process.exit(1);
});
