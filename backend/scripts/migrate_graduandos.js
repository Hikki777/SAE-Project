const { PrismaClient } = require('../prisma-client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('🚀 Iniciando migración de nomenclatura: 6to. Diversificado -> Graduandos');

  try {
    // 1. Actualizar Alumnos
    const resAlumnos = await prisma.alumno.updateMany({
      where: {
        grado: {
          contains: '6to. Diversificado'
        }
      },
      data: {
        grado: 'Graduandos'
      }
    });
    console.log(`✅ Alumnos actualizados: ${resAlumnos.count}`);

    // 2. Actualizar Historial Académico
    const resHistorial = await prisma.historialAcademico.updateMany({
      where: {
        grado_cursado: {
          contains: '6to. Diversificado'
        }
      },
      data: {
        grado_cursado: 'Graduandos'
      }
    });
    console.log(`✅ Registros de historial actualizados: ${resHistorial.count}`);

    // 3. Opcional: Actualizar el campo 'sexo' del primer administrador para que el avatar funcione
    // Buscamos el primer usuario admin
    const firstAdmin = await prisma.usuario.findFirst({
      where: { rol: 'admin' }
    });

    if (firstAdmin) {
       // Nota: Este paso requiere el cliente actualizado si 'sexo' no existía
       // Pero intentaremos hacerlo mediante query directa si es posible o esperar a que el usuario reinicie.
       console.log(`ℹ️ Admin encontrado: ${firstAdmin.email}. Se recomienda asignar sexo en Configuración.`);
    }

    console.log('🎉 Migración completada exitosamente.');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
