const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function check() {
  console.log('Checking Institucion table...');
  const institucions = await prisma.institucion.findMany();
  console.log(`Found ${institucions.length} records.`);

  for (const inst of institucions) {
    console.log(`--- ID: ${inst.id} ---`);
    console.log(`Stored Hash: ${inst.master_recovery_key}`);
    
    const keyToTest = 'PH0YFL8J8LQ2';
    if (inst.master_recovery_key) {
      const match = await bcrypt.compare(keyToTest, inst.master_recovery_key);
      console.log(`Comparing with '${keyToTest}': ${match ? 'MATCH ✅' : 'FAIL ❌'}`);
    } else {
      console.log('No key stored.');
    }
  }
}

check()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
