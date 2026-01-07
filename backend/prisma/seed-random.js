const prisma = require('../prismaClient');
const qrService = require('../services/qrService');
const tokenService = require('../services/tokenService');

const NAMES = ['Ana', 'Juan', 'Maria', 'Carlos', 'Sofía', 'Luis', 'Pedro', 'Laura', 'Diego', 'Lucía', 'Miguel', 'Elena', 'Jorge', 'Carmen', 'Pablo', 'Andrea', 'Fernando', 'Paula', 'Manuel', 'Isabel'];
const LASTNAMES = ['Garcia', 'Lopez', 'Perez', 'Martinez', 'Rodriguez', 'Sanchez', 'Gomez', 'Fernandez', 'Diaz', 'Torres', 'Ramirez', 'Ruiz', 'Vargas', 'Castillo', 'Jimenez', 'Romero', 'Navarro', 'Guerrero', 'Molina', 'Ortiz'];
const GRADES = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
const SECTIONS = ['A', 'B'];
const CARGOS = ['Docente', 'Administrativo', 'Operativo', 'Auxiliar'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomName() {
  return getRandomItem(NAMES);
}

function generateRandomLastname() {
  return getRandomItem(LASTNAMES) + ' ' + getRandomItem(LASTNAMES);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera un string alfanumérico aleatorio
const randomId = (len) => [...Array(len)].map(() => Math.random().toString(36)[2]).join('').toUpperCase();

async function main() {
  console.log('🌱 Generando 10 Alumnos y 10 Personal al azar...');

  try {
    // Asegurar directorios (handled by service or ignored for quick seed)
    // await qrService.inicializarDirectorios(); 

    // Obtener la institucion (asumimos que ya existe por seed anterior, si no, usar default)
    let institucion = await prisma.institucion.findFirst();
    if (!institucion) {
        console.log('⚠️ No se encontró institución, creando una por defecto...');
        const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
        institucion = await prisma.institucion.upsert({
            where: { id: 1 },
            update: {},
            create: {
              id: 1,
              nombre: 'Instituto Generado',
              horario_inicio: '07:00',
              margen_puntualidad_min: 5,
              inicializado: true,
              logo_base64: LOGO_BASE64
            }
        });
    }

    // --- ALUMNOS ---
    console.log('📚 Creando Alumnos...');
    for (let i = 0; i < 10; i++) {
        const carnet = `R-A${Date.now().toString().slice(-4)}${randomId(2)}`;
        const nombres = generateRandomName();
        const apellidos = generateRandomLastname();
        
        const alumnoData = {
            carnet: carnet,
            nombres: nombres,
            apellidos: apellidos,
            sexo: Math.random() > 0.5 ? 'M' : 'F',
            grado: getRandomItem(GRADES),
            jornada: Math.random() > 0.5 ? 'Matutina' : 'Vespertina',
            estado: 'activo'
        };

        const created = await prisma.alumno.create({ data: alumnoData });
        console.log(`  [ALUMNO] ${created.carnet} - ${created.nombres} ${created.apellidos}`);

        // Generar QR
        const token = tokenService.generarToken('alumno', created.id);
        const qr = await prisma.codigoQr.create({
          data: {
            persona_tipo: 'alumno',
            alumno_id: created.id,
            token,
            vigente: true
          }
        });

        // Crear imagen QR - Usando el servicio actualizado
        const filename = `${created.carnet}.png`;
        const qrUrl = await qrService.generarQrConLogo(token, institucion.logo_base64, filename);
        
        if (qrUrl) {
          await prisma.codigoQr.update({ where: { id: qr.id }, data: { png_path: qrUrl } });
        }
    }

    // --- PERSONAL ---
    console.log('👨‍🏫 Creando Personal...');
    for (let i = 0; i < 10; i++) {
        const carnet = `R-P${Date.now().toString().slice(-4)}${randomId(2)}`;
        const nombres = generateRandomName();
        const apellidos = generateRandomLastname();
        
        const personalData = {
            carnet: carnet,
            nombres: nombres,
            apellidos: apellidos,
            sexo: Math.random() > 0.5 ? 'M' : 'F',
            cargo: getRandomItem(CARGOS),
            jornada: Math.random() > 0.5 ? 'Matutina' : 'Vespertina',
            estado: 'activo'
        };

        const created = await prisma.personal.create({ data: personalData });
        console.log(`  [PERSONAL] ${created.carnet} - ${created.nombres} ${created.apellidos}`);

        // Generar QR
        const token = tokenService.generarToken('personal', created.id);
        const qr = await prisma.codigoQr.create({
          data: {
            persona_tipo: 'personal',
            personal_id: created.id,
            token,
            vigente: true
          }
        });

        const filename = `${created.carnet}.png`;
        const qrUrl = await qrService.generarQrConLogo(token, institucion.logo_base64, filename);
        
        if (qrUrl) {
          await prisma.codigoQr.update({ where: { id: qr.id }, data: { png_path: qrUrl } });
        }
    }

    console.log('\n✅ [OK] Datos aleatorios generados exitosamente.');

  } catch (error) {
    console.error('[ERROR]', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
