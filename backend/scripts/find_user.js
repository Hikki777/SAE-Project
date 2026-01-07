const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.usuario.findFirst();
    if (user) {
      console.log(`Found User: ${user.email}`);
    } else {
      console.log('No users found.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
