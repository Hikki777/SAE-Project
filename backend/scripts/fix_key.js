const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function fix() {
  console.log('Fixing Master Key in DB...');
  const keyToFix = 'PH0YFL8J8LQ2';
  const newHash = await bcrypt.hash(keyToFix, 10);
  
  console.log(`Key: ${keyToFix}`);
  console.log(`New Hash: ${newHash}`);

  const update = await prisma.institucion.updateMany({
    where: { id: 1 },
    data: { master_recovery_key: newHash }
  });

  console.log(`Updated ${update.count} records.`);
  
  // Verify
  const inst = await prisma.institucion.findFirst({ where: { id: 1 } });
  console.log('Verification match:', await bcrypt.compare(keyToFix, inst.master_recovery_key));
}

fix()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
