const { PrismaClient } = require('../backend/prisma-client');
const prisma = new PrismaClient();

async function check() {
  console.log('--- Database Status Check ---');
  
  const alumnos = await prisma.alumno.count();
  const alumnosSinSexo = await prisma.alumno.count({ where: { sexo: null } });
  const alumnosVaciosSexo = await prisma.alumno.count({ where: { sexo: '' } });
  
  const personal = await prisma.personal.count();
  const personalSinSexo = await prisma.personal.count({ where: { sexo: null } });
  
  const usuarios = await prisma.usuario.count();
  const usuariosSinSexo = await prisma.usuario.count({ where: { sexo: null } });
  
  const graduandosOld = await prisma.alumno.count({ where: { grado: { contains: '6to. Diversificado' } } });
  
  console.log(`Total Alumnos: ${alumnos}`);
  console.log(`Alumnos sin sexo (null): ${alumnosSinSexo}`);
  console.log(`Alumnos con sexo vacío (""): ${alumnosVaciosSexo}`);
  
  console.log(`Total Personal: ${personal}`);
  console.log(`Personal sin sexo: ${personalSinSexo}`);
  
  console.log(`Total Usuarios: ${usuarios}`);
  console.log(`Usuarios sin sexo: ${usuariosSinSexo}`);
  
  console.log(`Alumnos con '6to. Diversificado': ${graduandosOld}`);

  await prisma.$disconnect();
}

check();
