const path = require('path');
const prisma = require(path.join(process.cwd(), 'backend', 'prismaClient'));

async function dump() {
  try {
    const inst = await prisma.institucion.findFirst();
    if (!inst) {
      console.log('No institution found');
    } else {
      console.log('ID:', inst.id);
      console.log('Nombre:', inst.nombre);
      console.log('Logo Path:', inst.logo_path);
      console.log('Logo Base64 exists:', !!inst.logo_base64);
      if (inst.logo_base64) {
        console.log('Logo Base64 length:', inst.logo_base64.length);
      }
    }
    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
  }
}

dump();
