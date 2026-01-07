const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.codigoQr.count();
    console.log(`Total CodigoQr in DB: ${count}`);
    
    if (count > 0) {
      const qrs = await prisma.codigoQr.findMany({ take: 5 });
      console.log('Sample QRs:', qrs);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
