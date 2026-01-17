const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('--- Iniciando borrado de datos ---');

    console.log('Borrando Asistencias...');
    await prisma.asistencia.deleteMany({});
    
    console.log('Borrando Excusas...');
    await prisma.excusa.deleteMany({});

    console.log('Borrando Códigos QR...');
    await prisma.codigoQr.deleteMany({});
    
    console.log('Borrando Auditoría...');
    await prisma.auditoria.deleteMany({});

    console.log('Borrando Historial Académico...');
    await prisma.historialAcademico.deleteMany({});

    console.log('Borrando Alumnos...');
    await prisma.alumno.deleteMany({});
    
    console.log('Borrando Personal...');
    await prisma.personal.deleteMany({});
    
    console.log('Borrando Usuarios...');
    await prisma.usuario.deleteMany({}); // Warning: This deletes admins too.

    console.log('Borrando Equipos...');
    await prisma.equipo.deleteMany({});
    
    console.log('Reiniciando Institución...');
    await prisma.institucion.updateMany({
      data: {
        inicializado: false,
        nombre: 'Mi Institución Educativa',
        director_nombre: null,
      }
    });

    console.log('--- Base de datos reiniciada correctamente ---');
  } catch (error) {
    console.error('Error al resetear la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
