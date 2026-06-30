const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const prisma = require('../prismaClient');
const { verifyJWT } = require('../middlewares/auth');
const { generateAlumnoCarnet, generatePersonalCarnet, validateCarnet } = require('../utils/carnetGenerator');
const qrService = require('../services/qrService');
const { logger } = require('../utils/logger');

// Multer en memoria para recibir archivos sin guardarlos en disco
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB maximo
  fileFilter: (req, file, cb) => {
    const byExt = file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls');
    if (byExt) return cb(null, true);
    cb(new Error('Tipo de archivo no permitido. Use .xlsx o .xls'));
  }
});

// Aplicar autenticacion a todas las rutas
router.use(verifyJWT);

/**
 * Calcular nivel academico basado en el grado
 */
function calcularNivelActual(grado) {
  if (!grado) return null;
  const g = grado.toLowerCase();
  if (g.includes('primaria')) return 'Primaria';
  if (g.includes('basico') || g.includes('básico')) return 'Básicos';
  if (g.includes('diversificado') || g.includes('bachillerato') || g.includes('perito') || /[456]to\.?\s*(diversificado)?/.test(g)) return 'Diversificado';
  return null;
}

/**
 * Parsear archivo Excel y retornar array de filas
 */
function parsearArchivo(buffer, originalname) {
  // Excel (.xlsx / .xls)
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

/**
 * Extraer fecha de nacimiento de una fila con soporte para multiples nombres de columna
 */
function extraerFechaNacimiento(fila) {
  const valor = fila.fecha_nacimiento || fila.fechaNacimiento || fila['Fecha Nacimiento']
    || fila['fecha de nacimiento'] || fila.FechaNacimiento || fila['Fecha de Nacimiento'] || '';
  if (!valor) return null;
  const parsed = new Date(valor);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/importar/alumnos
// Importar alumnos masivamente desde Excel o JSON
// ─────────────────────────────────────────────────────────────────────────────
router.post('/alumnos', upload.single('archivo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibio ningun archivo' });
  }

  const resultados = { total: 0, creados: 0, errores: [], registros: [] };

  try {
    const filas = parsearArchivo(req.file.buffer, req.file.originalname);
    resultados.total = filas.length;

    if (filas.length === 0) {
      return res.status(400).json({ error: 'El archivo esta vacio o no tiene datos validos' });
    }
    if (filas.length > 500) {
      return res.status(400).json({ error: 'Maximo 500 registros por importacion' });
    }

    for (let i = 0; i < filas.length; i++) {
      const fila = filas[i];
      const fila_num = i + 2; // +2 porque fila 1 es encabezado

      try {
        const nombres      = (fila.nombres      || fila.Nombres      || fila.NOMBRES      || '').toString().trim();
        const apellidos    = (fila.apellidos    || fila.Apellidos    || fila.APELLIDOS    || '').toString().trim();
        const grado        = (fila.grado        || fila.Grado        || fila.GRADO        || '').toString().trim();
        const seccion      = (fila.seccion      || fila.Seccion      || fila.Sección      || '').toString().trim();
        const carrera      = (fila.carrera      || fila.Carrera      || '').toString().trim();
        const especialidad = (fila.especialidad || fila.Especialidad || '').toString().trim();
        const jornada      = (fila.jornada      || fila.Jornada      || 'Matutina').toString().trim();
        const sexo         = (fila.sexo         || fila.Sexo         || fila.SEXO         || '').toString().trim();
        const carnetManual = (fila.carnet       || fila.Carnet       || fila.CARNET       || '').toString().trim();
        const fecha_nacimiento = extraerFechaNacimiento(fila);

        if (!nombres || !apellidos || !grado) {
          resultados.errores.push({ fila: fila_num, error: 'Faltan campos requeridos: nombres, apellidos, grado', datos: { nombres, apellidos, grado } });
          continue;
        }

        let carnet;
        if (carnetManual) {
          const validation = await validateCarnet(carnetManual, 'alumno');
          if (!validation.valid) {
            resultados.errores.push({ fila: fila_num, error: `Carnet invalido o duplicado: ${carnetManual}`, datos: { nombres, apellidos } });
            continue;
          }
          carnet = carnetManual;
        } else {
          carnet = await generateAlumnoCarnet();
        }

        const alumno = await prisma.alumno.create({
          data: {
            carnet,
            nombres,
            apellidos,
            grado,
            nivel_actual: calcularNivelActual(grado),
            seccion:      seccion      || null,
            carrera:      carrera      || null,
            especialidad: especialidad || null,
            jornada:      jornada      || 'Matutina',
            sexo:         sexo         || null,
            fecha_nacimiento,
            estado: 'activo'
          }
        });

        // Generar QR automaticamente (no bloquea si falla)
        try {
          await qrService.generarQrParaPersona('alumno', alumno.id);
        } catch (qrError) {
          logger.warn({ err: qrError, alumnoId: alumno.id }, '[IMPORTAR] Fallo generacion QR alumno');
        }

        resultados.creados++;
        resultados.registros.push({ fila: fila_num, carnet, nombres, apellidos, id: alumno.id });

      } catch (filaError) {
        resultados.errores.push({
          fila: fila_num,
          error: filaError.message,
          datos: { nombres: (fila.nombres || fila.Nombres || ''), apellidos: (fila.apellidos || fila.Apellidos || '') }
        });
      }
    }

    // Auditoria
    await prisma.auditoria.create({
      data: {
        entidad: 'Alumno',
        accion: 'importar_masivo',
        detalle: JSON.stringify({ total: resultados.total, creados: resultados.creados, errores: resultados.errores.length })
      }
    });

    logger.info({ creados: resultados.creados, errores: resultados.errores.length }, '[OK] Importacion masiva de alumnos completada');
    res.json(resultados);

  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error en importacion masiva de alumnos');
    res.status(500).json({ error: 'Error al procesar el archivo: ' + error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/importar/personal
// Importar personal/docentes masivamente desde Excel o JSON
// ─────────────────────────────────────────────────────────────────────────────
router.post('/personal', upload.single('archivo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibio ningun archivo' });
  }

  const resultados = { total: 0, creados: 0, errores: [], registros: [] };

  try {
    const filas = parsearArchivo(req.file.buffer, req.file.originalname);
    resultados.total = filas.length;

    if (filas.length === 0) {
      return res.status(400).json({ error: 'El archivo esta vacio o no tiene datos validos' });
    }
    if (filas.length > 200) {
      return res.status(400).json({ error: 'Maximo 200 registros por importacion de personal' });
    }

    for (let i = 0; i < filas.length; i++) {
      const fila = filas[i];
      const fila_num = i + 2;

      try {
        const nombres      = (fila.nombres    || fila.Nombres    || fila.NOMBRES    || '').toString().trim();
        const apellidos    = (fila.apellidos  || fila.Apellidos  || fila.APELLIDOS  || '').toString().trim();
        const cargo        = (fila.cargo      || fila.Cargo      || fila.CARGO      || 'Docente').toString().trim();
        const jornada      = (fila.jornada    || fila.Jornada    || '').toString().trim();
        const sexo         = (fila.sexo       || fila.Sexo       || '').toString().trim();
        const grado_guia   = (fila.grado_guia || fila.gradoGuia  || fila['Grado Guia'] || fila['Grado Guía'] || '').toString().trim();
        const curso        = (fila.curso      || fila.Curso      || '').toString().trim();
        const carnetManual = (fila.carnet     || fila.Carnet     || '').toString().trim();
        const fecha_nacimiento = extraerFechaNacimiento(fila);

        if (!nombres || !apellidos) {
          resultados.errores.push({ fila: fila_num, error: 'Faltan campos requeridos: nombres, apellidos', datos: { nombres, apellidos } });
          continue;
        }

        let carnet;
        if (carnetManual) {
          const validation = await validateCarnet(carnetManual, 'personal');
          if (!validation.valid) {
            resultados.errores.push({ fila: fila_num, error: `Carnet invalido o duplicado: ${carnetManual}`, datos: { nombres, apellidos } });
            continue;
          }
          carnet = carnetManual;
        } else {
          carnet = await generatePersonalCarnet(cargo);
        }

        const personal = await prisma.personal.create({
          data: {
            carnet,
            nombres,
            apellidos,
            cargo:       cargo      || 'Docente',
            jornada:     jornada    || null,
            sexo:        sexo       || null,
            grado_guia:  (cargo === 'Docente' && grado_guia) ? grado_guia : null,
            curso:       (cargo === 'Docente' && curso)       ? curso       : null,
            fecha_nacimiento,
            estado: 'activo'
          }
        });

        try {
          await qrService.generarQrParaPersona('personal', personal.id);
        } catch (qrError) {
          logger.warn({ err: qrError, personalId: personal.id }, '[IMPORTAR] Fallo generacion QR personal');
        }

        resultados.creados++;
        resultados.registros.push({ fila: fila_num, carnet, nombres, apellidos, id: personal.id });

      } catch (filaError) {
        resultados.errores.push({
          fila: fila_num,
          error: filaError.message,
          datos: { nombres: (fila.nombres || fila.Nombres || ''), apellidos: (fila.apellidos || fila.Apellidos || '') }
        });
      }
    }

    await prisma.auditoria.create({
      data: {
        entidad: 'Personal',
        accion: 'importar_masivo',
        detalle: JSON.stringify({ total: resultados.total, creados: resultados.creados, errores: resultados.errores.length })
      }
    });

    logger.info({ creados: resultados.creados, errores: resultados.errores.length }, '[OK] Importacion masiva de personal completada');
    res.json(resultados);

  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error en importacion masiva de personal');
    res.status(500).json({ error: 'Error al procesar el archivo: ' + error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/importar/plantilla/alumnos
// Descargar plantilla Excel para alumnos
// ─────────────────────────────────────────────────────────────────────────────
router.get('/plantilla/alumnos', verifyJWT, (req, res) => {
  const datos = [
    { nombres: 'Juan Carlos', apellidos: 'Garcia Lopez',    grado: '1ro. Basico',         seccion: 'A', jornada: 'Matutina', sexo: 'Masculino', carrera: '',                           especialidad: '',         fecha_nacimiento: '2010-05-15', carnet: '' },
    { nombres: 'Maria Jose',  apellidos: 'Martinez Perez', grado: '4to. Diversificado',   seccion: 'B', jornada: 'Matutina', sexo: 'Femenino',  carrera: 'Bachillerato en Computacion', especialidad: 'Dibujo Tecnico', fecha_nacimiento: '2008-11-20', carnet: '' }
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datos);
  ws['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 22 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 32 }, { wch: 18 }, { wch: 18 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="plantilla_alumnos_SAE.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/importar/plantilla/personal
// Descargar plantilla Excel para personal
// ─────────────────────────────────────────────────────────────────────────────
router.get('/plantilla/personal', verifyJWT, (req, res) => {
  const datos = [
    { nombres: 'Roberto',   apellidos: 'Hernandez Soto', cargo: 'Docente',   jornada: 'Matutina', sexo: 'Masculino', grado_guia: '1ro. Basico', curso: 'Matematicas, Fisica', fecha_nacimiento: '1985-03-10', carnet: '' },
    { nombres: 'Ana Lucia', apellidos: 'Morales Ruiz',   cargo: 'Directora', jornada: 'Matutina', sexo: 'Femenino',  grado_guia: '',            curso: '',                    fecha_nacimiento: '1978-07-22', carnet: '' }
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datos);
  ws['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 20 }, { wch: 30 }, { wch: 18 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Personal');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="plantilla_personal_SAE.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

module.exports = router;
