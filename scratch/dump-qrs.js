const path = require('path');
const prisma = require(path.join(process.cwd(), 'backend', 'prismaClient'));

async function dump() {
  try {
    const qrs = await prisma.codigoQr.findMany({
      take: 20,
      orderBy: { id: 'desc' }
    });
    console.log(JSON.stringify(qrs, null, 2));
    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
  }
}

dump();
