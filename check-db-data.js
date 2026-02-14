const prisma = require('./backend/prismaClient');

async function checkData() {
  try {
    const institucion = await prisma.institucion.findFirst();
    const usuarios = await prisma.usuario.count();
    const alumnos = await prisma.alumno.count();
    const personal = await prisma.personal.count();

    console.log('--- Resumen de Datos ---');
    console.log('Institución existe:', !!institucion);
    if (institucion) {
      console.log('Nombre:', institucion.nombre);
      console.log('Ciclo Escolar:', institucion.ciclo_escolar);
      console.log('Master Key configurada:', !!institucion.master_recovery_key);
      console.log('Inicializado:', institucion.inicializado);
    }
    console.log('------------------------');
    console.log('Cantidad de Usuarios:', usuarios);
    console.log('Cantidad de Alumnos:', alumnos);
    console.log('Cantidad de Personal:', personal);
    
  } catch (error) {
    console.error('Error al consultar BD:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
