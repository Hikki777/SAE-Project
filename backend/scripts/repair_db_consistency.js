const { PrismaClient } = require('../prisma-client');
const prisma = new PrismaClient();

async function repairDataConsistency(prismaInstance = null) {
  const prismaToUse = prismaInstance || prisma;
  console.log('--- Starting Database Data Consistency Repair ---');

  try {
    // 1. Repair Genders
    const genderMap = {
      'M': 'Masculino',
      'F': 'Femenino',
      'm': 'Masculino',
      'f': 'Femenino'
    };

    const tables = ['alumno', 'personal'];
    
    for (const table of tables) {
      console.log(`Checking genders in table: ${table}...`);
      const records = await prismaToUse[table].findMany({
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
          await prismaToUse[table].update({
            where: { id: record.id },
            data: { sexo: newSexo }
          });
        }
      }
    }

    // 2. Nomenclature: 6to. Diversificado -> Graduandos
    console.log('Updating nomenclature: 6to. Diversificado -> Graduandos...');
    
    const alumnos6to = await prismaToUse.alumno.updateMany({
      where: { grado: '6to. Diversificado' },
      data: { grado: 'Graduandos' }
    });
    console.log(`  Updated ${alumnos6to.count} alumnos.`);

    const personal6to = await prismaToUse.personal.updateMany({
      where: { grado_guia: '6to. Diversificado' },
      data: { grado_guia: 'Graduandos' }
    });
    console.log(`  Updated ${personal6to.count} personal guia.`);

    // 3. User Roles Migration
    console.log('Migrating User Roles to strictly admin and operador...');
    
    // Elevate any "administrador", "superadmin", etc to "admin"
    const adminsMigrated = await prismaToUse.usuario.updateMany({
      where: {
        rol: {
          in: ['administrador', 'superadmin', 'root']
        }
      },
      data: { rol: 'admin' }
    });
    console.log(`  Elevated ${adminsMigrated.count} deprecated admin roles to 'admin'.`);

    // Downgrade any other non-admin role to 'operador' (failsafe)
    const operadoresMigrated = await prismaToUse.usuario.updateMany({
      where: {
        rol: {
          notIn: ['admin', 'operador']
        }
      },
      data: { rol: 'operador' }
    });
    console.log(`  Downgraded ${operadoresMigrated.count} unknown roles to 'operador'.`);

    console.log('--- Database Repair Completed ---');
  } finally {
    if (!prismaInstance) {
      await prismaToUse.$disconnect();
    }
  }
}

if (require.main === module) {
  repairDataConsistency().catch(err => {
    console.error('Fatal error during repair:', err);
    process.exit(1);
  });
}

module.exports = { repairDataConsistency };
