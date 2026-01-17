const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { generatePersonalCarnet, validateCarnet, getCarnetPrefix } = require('../utils/carnetGenerator');
const multer = require('multer');
const { 
  validarCrearDocente, 
  validarActualizarDocente, 
  validarId 
} = require('../middlewares/validation');
const { logger } = require('../utils/logger');
const { cacheMiddleware, invalidateCacheMiddleware } = require('../middlewares/cache');
const { uploadBuffer } = require('../services/imageService');
const { getFolderByCargo } = require('../utils/uploadHelpers');

// Configurar multer para memoria (no guardar en disco)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/**
 * GET /api/docentes/next-carnet
 * Obtener el siguiente carnet disponible según cargo (preview)
 */
router.get('/next-carnet', async (req, res) => {
  try {
    const { cargo } = req.query;
    if (!cargo) {
      return res.status(400).json({ error: 'Cargo es requerido' });
    }
    const nextCarnet = await generatePersonalCarnet(cargo);
    const prefix = getCarnetPrefix(cargo);
    res.json({ carnet: nextCarnet, prefix });
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error generando preview de carnet');
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/docentes/validate-carnet
 * Validar un carnet (formato + disponibilidad)
 */
router.post('/validate-carnet', async (req, res) => {
  try {
    const { carnet, excludeId } = req.body;
    const validation = await validateCarnet(carnet, 'personal', excludeId);
    res.json(validation);
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error validando carnet');
    res.status(500).json({ error: error.message });
  }
});

// GET /api/docentes - Listar todos los docentes con paginación cursor (sin caché temporalmente)
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
    const estado = req.query.estado; // Sin valor por defecto, traer todos

    const whereClause = estado ? { estado } : {}; // Si hay estado, filtrar, sino traer todos

    const docentes = await prisma.personal.findMany({
      where: whereClause,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: 'asc' },
      include: {
        codigos_qr: {
          where: { vigente: true },
          select: { id: true, token: true, png_path: true }
        }
      }
    });

    const hasMore = docentes.length > limit;
    const items = hasMore ? docentes.slice(0, limit) : docentes;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    const total = await prisma.personal.count({ where: whereClause });

    res.json({
      total,
      count: items.length,
      personal: items,
      pagination: {
        nextCursor,
        hasMore,
        limit
      }
    });
  } catch (error) {
    logger.error({ err: error, query: req.query }, '[ERROR] Error al listar docentes');
    res.status(500).json({ error: error.message });
  }
});

// GET /api/docentes/:id - Obtener un docente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const docente = await prisma.personal.findUnique({
      where: { id: parseInt(id) },
      include: {
        codigos_qr: {
          where: { vigente: true }
        },
        asistencias: {
          take: 10,
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!docente) {
      logger.warn({ docenteId: req.params.id }, '[WARNING] Docente no encontrado');
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    res.json({ docente });
  } catch (error) {
    logger.error({ err: error, docenteId: req.params.id }, '[ERROR] Error al obtener docente');
    res.status(500).json({ error: error.message });
  }
});

// POST /api/docentes - Crear nuevo docente
router.post('/', invalidateCacheMiddleware('/api/docentes'), (req, res, next) => {
  // Solo aplicar multer si el Content-Type es multipart/form-data
  if (req.is('multipart/form-data')) {
    upload.single('foto')(req, res, next);
  } else {
    next();
  }
}, validarCrearDocente, async (req, res) => {
  try {
    let { carnet, nombres, apellidos, sexo, cargo, jornada, grado_guia, curso, carnetMode } = req.body;

    // Validar campos requeridos
    if (!nombres || !apellidos) {
      return res.status(400).json({ error: 'Nombres y apellidos son obligatorios' });
    }

    // Sistema híbrido de carnets
    if (carnetMode === 'auto' || !carnet) {
      // Generar carnet automáticamente según cargo
      carnet = await generatePersonalCarnet(cargo || 'Docente');
      logger.info({ carnet, cargo }, '[INFO] Carnet generado automáticamente');
    } else {
      // Validar carnet manual
      const validation = await validateCarnet(carnet, 'personal');
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }

    // Subir foto si existe
    let foto_url = null;
    if (req.file) {
      // Determinar carpeta según cargo
      const folder = getFolderByCargo(cargo || 'Docente');
      const publicId = `${folder}_${carnet}`;
      const result = await uploadBuffer(req.file.buffer, folder, publicId);
      foto_url = result.secure_url; // Es ruta relativa: "docentes/docentes_D-2026001.png"
    }

const qrService = require('../services/qrService');

// ...

    const docente = await prisma.personal.create({
      data: {
        carnet,
        nombres,
        apellidos,
        sexo: sexo || null,
        cargo: cargo || 'Docente',
        jornada: jornada || null,
        grado_guia: (cargo === 'Docente' && grado_guia) ? grado_guia : null,
        curso: (cargo === 'Docente' && curso) ? curso : null,
        foto_path: foto_url
      }
    });

    // Generar QR automáticamente
    try {
        await qrService.generarQrParaPersona('personal', docente.id);
        logger.info({ docenteId: docente.id }, '[OK] QR generado automáticamente');
    } catch (qrError) {
        logger.error({ err: qrError, docenteId: docente.id }, '[WARNING] Falló generación automática de QR');
    }

    logger.info({ docenteId: docente.id, carnet, nombres, apellidos }, '[OK] Docente creado');
    res.status(201).json({ docente });
  } catch (error) {
    logger.error({ err: error, body: req.body }, '[ERROR] Error al crear docente');
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/docentes/:id - Actualizar docente
router.put('/:id', invalidateCacheMiddleware('/api/docentes'), (req, res, next) => {
  // Solo aplicar multer si el Content-Type es multipart/form-data
  if (req.is('multipart/form-data')) {
    upload.single('foto')(req, res, next);
  } else {
    next();
  }
}, validarActualizarDocente, async (req, res) => {
  try {
    const { id } = req.params;
    const { carnet, nombres, apellidos, sexo, cargo, jornada, estado, grado_guia, curso } = req.body;

    const docente = await prisma.personal.findUnique({
      where: { id: parseInt(id) }
    });

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Subir nueva foto si existe
    let foto_url = docente.foto_path;
    if (req.file) {
      // Determinar carpeta según cargo (usar el nuevo si se cambió, sino el actual)
      const cargoActual = cargo || docente.cargo;
      const folder = getFolderByCargo(cargoActual);
      const publicId = `${folder}_${docente.carnet}`;
      const result = await uploadBuffer(req.file.buffer, folder, publicId);
      foto_url = result.secure_url;
    }

    const docenteActualizado = await prisma.personal.update({
      where: { id: parseInt(id) },
      data: {
        carnet: carnet || docente.carnet,
        nombres: nombres || docente.nombres,
        apellidos: apellidos || docente.apellidos,
        sexo: sexo !== undefined ? sexo : docente.sexo,
        cargo: cargo || docente.cargo,
        jornada: jornada !== undefined ? jornada : docente.jornada,
        estado: estado || docente.estado,
        grado_guia: (cargo === 'Docente' || docente.cargo === 'Docente') && grado_guia !== undefined ? grado_guia : (cargo !== 'Docente' ? null : docente.grado_guia),
        curso: (cargo === 'Docente' || docente.cargo === 'Docente') && curso !== undefined ? curso : (cargo !== 'Docente' ? null : docente.curso),
        foto_path: foto_url
      }
    });

    logger.info({ docenteId: id, campos: Object.keys(req.body) }, '[OK] Docente actualizado');
    res.json({ docente: docenteActualizado });
  } catch (error) {
    logger.error({ err: error, docenteId: req.params.id }, '[ERROR] Error al actualizar docente');
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/docentes/:id - Eliminar docente
router.delete('/:id', invalidateCacheMiddleware('/api/docentes'), async (req, res) => {
  try {
    const { id } = req.params;

    const docente = await prisma.personal.findUnique({
      where: { id: parseInt(id) }
    });

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Nota: Las fotos se mantienen en almacenamiento para historial

    await prisma.personal.delete({
      where: { id: parseInt(id) }
    });

    logger.info({ docenteId: id, nombres: docente.nombres, apellidos: docente.apellidos }, '[OK] Docente eliminado');
    res.json({ message: 'Docente eliminado correctamente' });
  } catch (error) {
    logger.error({ err: error, docenteId: req.params.id }, '[ERROR] Error al eliminar docente');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



