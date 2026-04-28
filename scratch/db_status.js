const { PrismaClient } = require('../backend/prisma-client');
const prisma = new PrismaClient();

async function check() {
  console.log('--- Institucion Status Check ---');
  try {
    const inst = await prisma.institucion.findFirst();
    if (inst) {
      console.log('ID:', inst.id);
      console.log('Nombre:', inst.nombre);
      console.log('Logo Path:', inst.logo_path);
      console.log('Logo Base64:', inst.logo_base64 ? 'SI' : 'NO');
    } else {
      console.log('No se encontró institución.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
