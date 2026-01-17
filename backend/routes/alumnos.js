const express = require('express');
const prisma = require('../prismaClient');
const { verifyJWT } = require('../middlewares/auth');
const { generateAlumnoCarnet, validateCarnet } = require('../utils/carnetGenerator');
const { 
  validarCrearAlumno, 
  validarActualizarAlumno, 
  validarId 
} = require('../middlewares/validation');
const { logger } = require('../utils/logger');
const { cacheMiddleware, invalidateCacheMiddleware } = require('../middlewares/cache');
const multer = require('multer');
const { uploadBuffer } = require('../services/imageService');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Aplicar autenticación a todas las rutas de alumnos
router.use(verifyJWT);

/**
 * Helper: Calcular nivel académico basado en el grado
 */
function calcularNivelActual(grado) {
  if (!grado) return null;
  
  const gradoLower = grado.toLowerCase();
  
  // Primaria: 1ro-6to Primaria
  if (gradoLower.includes('primaria')) {
    return 'Primaria';
  }
  
  // Básicos: 1ro-3ro Básico
  if (gradoLower.includes('básico') || gradoLower.includes('basico')) {
    return 'Básicos';
  }
  
  // Diversificado: 4to-6to Diversificado, Bachillerato, Perito, etc.
  if (gradoLower.includes('diversificado') || 
      gradoLower.includes('bachillerato') ||
      gradoLower.includes('perito') ||
      /[456]to\.?\s*(diversificado)?/.test(gradoLower)) {
    return 'Diversificado';
  }
  
  return null;
}

/**
 * GET /api/alumnos/next-carnet
 * Obtener el siguiente carnet disponible (preview)
 */
router.get('/next-carnet', async (req, res) => {
  try {
    const nextCarnet = await generateAlumnoCarnet();
    res.json({ carnet: nextCarnet });
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error generando preview de carnet');
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/alumnos/validate-carnet
 * Validar un carnet (formato + disponibilidad)
 */
router.post('/validate-carnet', async (req, res) => {
  try {
    const { carnet, excludeId } = req.body;
    const validation = await validateCarnet(carnet, 'alumno', excludeId);
    res.json(validation);
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error validando carnet');
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/alumnos
 * Listar todos los alumnos con paginación cursor (sin caché temporalmente)
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
    const estado = req.query.estado; // Sin valor por defecto, traer todos

    const whereClause = estado ? { estado } : {}; // Si hay estado, filtrar, sino traer todos

    const alumnos = await prisma.alumno.findMany({
      where: whereClause,
      take: limit + 1, // +1 para saber si hay más páginas
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: 'asc' },
      select: {
        id: true,
        carnet: true,
        nombres: true,
        apellidos: true,
        sexo: true,
        grado: true,
        carrera: true,
        especialidad: true,
        jornada: true,
        estado: true,
        foto_path: true,
        creado_en: true,
        codigos_qr: {
          select: {
            id: true,
            token: true
          }
        }
      }
    });

    const hasMore = alumnos.length > limit;
    const items = hasMore ? alumnos.slice(0, limit) : alumnos;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    const total = await prisma.alumno.count({ where: whereClause });

    res.json({
      total,
      count: items.length,
      alumnos: items,
      pagination: {
        nextCursor,
        hasMore,
        limit
      }
    });
  } catch (error) {
    logger.error({ err: error, query: req.query }, '[ERROR] Error al listar alumnos');
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/alumnos/:id
 * Obtener alumno por ID
 */
router.get('/:id', validarId, async (req, res) => {
  try {
    const alumno = await prisma.alumno.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        codigos_qr: true,
        asistencias: { take: 10, orderBy: { timestamp: 'desc' } }
      }
    });

    if (!alumno) {
      logger.warn({ alumnoId: req.params.id }, '[WARN] Alumno no encontrado');
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    res.json(alumno);
  } catch (error) {
    logger.error({ err: error, alumnoId: req.params.id }, '[ERROR] Error al obtener alumno');
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/alumnos
 * Crear nuevo alumno
 */
router.post('/', invalidateCacheMiddleware('/api/alumnos'), validarCrearAlumno, async (req, res) => {
  try {
    let { carnet, nombres, apellidos, sexo, grado, carrera, jornada, carnetMode } = req.body;

    if (!nombres || !apellidos || !grado) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: nombres, apellidos, grado'
      });
    }

    // Sistema híbrido de carnets
    if (carnetMode === 'auto' || !carnet) {
      // Generar carnet automáticamente
      carnet = await generateAlumnoCarnet();
      logger.info({ carnet }, '[INFO] Carnet generado automáticamente');
    } else {
      // Validar carnet manual
      const validation = await validateCarnet(carnet, 'alumno');
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }

const qrService = require('../services/qrService');

// ...

    const alumno = await prisma.alumno.create({
      data: {
        carnet,
        nombres,
        apellidos,
        sexo: sexo || null,
        grado,
        nivel_actual: calcularNivelActual(grado), // Calcular automáticamente
        carrera: req.body.carrera || null,
        especialidad: req.body.especialidad || null,
        jornada: jornada || 'Matutina',
        estado: 'activo'
      },
      select: {
        id: true,
        carnet: true,
        nombres: true,
        apellidos: true,
        sexo: true,
        grado: true,
        carrera: true,
        especialidad: true,
        jornada: true,
        estado: true,
        foto_path: true,
        creado_en: true,
        actualizado_en: true
      }
    });

    // Registrar en auditoria
    await prisma.auditoria.create({
      data: {
        entidad: 'Alumno',
        entidad_id: alumno.id,
        accion: 'crear',
        detalle: JSON.stringify({ carnet, nombres })
      }
    });
    
    // Generar QR automáticamente
    try {
        await qrService.generarQrParaPersona('alumno', alumno.id);
        logger.info({ alumnoId: alumno.id }, '[OK] QR generado automáticamente');
    } catch (qrError) {
        logger.error({ err: qrError, alumnoId: alumno.id }, '[WARN] Falló generación automática de QR');
    }

    logger.info({ alumnoId: alumno.id, carnet, nombres, apellidos }, '[OK] Alumno creado');
    res.status(201).json(alumno);
  } catch (error) {
    logger.error({ err: error, body: req.body }, '[ERROR] Error al crear alumno');
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/alumnos/:id
 * Actualizar alumno
 */
router.put('/:id', invalidateCacheMiddleware('/api/alumnos'), validarActualizarAlumno, async (req, res) => {
  try {
    const { nombres, apellidos, sexo, grado, carrera, especialidad, jornada, estado } = req.body;
    const id = parseInt(req.params.id);

    const alumno = await prisma.alumno.update({
      where: { id },
      data: {
        ...(nombres && { nombres }),
        ...(apellidos && { apellidos }),
        ...(sexo && { sexo }),
        ...(grado && { grado, nivel_actual: calcularNivelActual(grado) }), // Actualizar nivel si cambia grado
        ...(carrera !== undefined && { carrera }),
        ...(especialidad !== undefined && { especialidad }),
        ...(jornada && { jornada }),
        ...(estado && { estado })
      },
      select: {
        id: true,
        carnet: true,
        nombres: true,
        apellidos: true,
        sexo: true,
        grado: true,
        carrera: true,
        especialidad: true,
        jornada: true,
        estado: true,
        foto_path: true,
        creado_en: true,
        actualizado_en: true
      }
    });

    // Registrar en auditoria
    await prisma.auditoria.create({
      data: {
        entidad: 'Alumno',
        entidad_id: id,
        accion: 'actualizar',
        detalle: JSON.stringify({ campos: Object.keys(req.body) })
      }
    });

    logger.info({ alumnoId: id, campos: Object.keys(req.body) }, '[OK] Alumno actualizado');
    res.json(alumno);
  } catch (error) {
    logger.error({ err: error, alumnoId: req.params.id }, '[ERROR] Error al actualizar alumno');
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/alumnos/:id
 * Inactivar alumno (soft delete)
 */
router.delete('/:id', invalidateCacheMiddleware('/api/alumnos'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const alumno = await prisma.alumno.update({
      where: { id },
      data: { estado: 'inactivo' }
    });

    // Registrar en auditoria
    await prisma.auditoria.create({
      data: {
        entidad: 'Alumno',
        entidad_id: id,
        accion: 'inactivar',
        detalle: JSON.stringify({ anterior: 'activo', nuevo: 'inactivo' })
      }
    });

    logger.info({ alumnoId: id }, '[OK] Alumno inactivado');
    res.json({ success: true, message: 'Alumno inactivado' });
  } catch (error) {
    logger.error({ err: error, alumnoId: req.params.id }, '[ERROR] Error al inactivar alumno');
    res.status(500).json({ error: error.message });
  }
});


/**
 * POST /api/alumnos/:id/foto
 * Subir foto de perfil con compresión
 */
router.post('/:id/foto', upload.single('foto'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const alumno = await prisma.alumno.findUnique({ where: { id } });
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    // Subir imagen directamente
    const publicId = `alumno_${alumno.carnet}`;
    const result = await uploadBuffer(req.file.buffer, 'alumnos', publicId);

    // Actualizar BD con la URL segura
    const updated = await prisma.alumno.update({
      where: { id },
      data: { foto_path: result.secure_url }
    });

    logger.info({ alumnoId: id, url: result.secure_url }, '[OK] Foto de alumno actualizada');
    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    logger.error({ err: error, alumnoId: req.params.id }, '[ERROR] Error subiendo foto');
    res.status(500).json({ error: error.message });
  }
});


/**
 * POST /api/alumnos/fix-niveles
 * Actualizar nivel_actual de todos los alumnos existentes (migración)
 */
router.post('/fix-niveles', async (req, res) => {
  try {
    const alumnos = await prisma.alumno.findMany({
      select: { id: true, grado: true, nivel_actual: true }
    });

    let updated = 0;
    for (const alumno of alumnos) {
      const nivelCalculado = calcularNivelActual(alumno.grado);
      if (nivelCalculado !== alumno.nivel_actual) {
        await prisma.alumno.update({
          where: { id: alumno.id },
          data: { nivel_actual: nivelCalculado }
        });
        updated++;
      }
    }

    logger.info({ updated, total: alumnos.length }, '[OK] Niveles actualizados');
    res.json({ 
      success: true, 
      message: `${updated} alumnos actualizados de ${alumnos.length} total`,
      updated,
      total: alumnos.length
    });
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error actualizando niveles');
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
