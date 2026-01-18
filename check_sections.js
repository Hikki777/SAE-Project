const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- VERIFICANDO SECCIONES ---');
  const alumnos = await prisma.alumno.findMany({
    where: {
      estado: 'activo'
    },
    select: {
      carnet: true,
      nombres: true,
      apellidos: true,
      seccion: true
    },
    take: 20
  });
  
  console.table(alumnos);
  console.log('Total:', alumnos.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
