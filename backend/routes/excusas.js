const express = require('express');
const prisma = require('../prismaClient');
const { verifyJWT } = require('../middlewares/auth');
const { logger } = require('../utils/logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { UPLOADS_DIR } = require('../utils/paths');

const router = express.Router();

// Configurar multer para evidencia (PDFs, imágenes)
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const dir = path.join(UPLOADS_DIR, 'justificaciones');
    await fs.ensureDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `evidencia-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo imágenes o PDF permitidos'));
    }
  }
});

// Proteger todas las rutas
router.use(verifyJWT);

/**
 * POST /api/excusas
 * Registrar una excusa/justificación
 */
router.post('/', upload.single('archivo'), async (req, res) => {
  try {
    const { motivo, tipo, alumno_id, personal_id, fecha_ausencia, descripcion } = req.body;
    
    if (!motivo || !tipo || (!alumno_id && !personal_id) || !fecha_ausencia) {
      // Eliminar archivo si la validación falla
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Faltan datos requeridos (motivo, tipo, ID, fecha_ausencia)' });
    }

    let documento_url = null;
    if (req.file) {
      documento_url = `justificaciones/${req.file.filename}`;
    }

    const data = {
      motivo,
      descripcion: descripcion || null,
      fecha_ausencia: new Date(fecha_ausencia), // Usar fecha enviada
      documento_url,
      estado: 'pendiente',
      created_at: new Date(), // created_at map to creado_en in schema if needed, but schema uses default now()
      alumno_id: tipo === 'alumno' ? parseInt(alumno_id) : undefined,
      personal_id: tipo === 'personal' ? parseInt(personal_id) : undefined
    };

    const excusa = await prisma.excusa.create({ 
      data: {
        ...data,
        creado_en: new Date() // Explicitly setting creation date if model requires
      } 
    });
    
    logger.info({ excusaId: excusa.id, user: req.user.id }, 'Justificación registrada');
    res.json({ success: true, excusa });
  } catch (error) {
    logger.error({ err: error }, 'Error registrando justificación');
    // Intentar limpiar archivo en caso de error de BD
    if (req.file) {
      try { await fs.unlink(req.file.path); } catch(e){} 
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/excusas
 * Listar justificaciones con filtros
 */
router.get('/', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, alumno_id, personal_id, estado, personaTipo } = req.query;
    
    const where = {};
    
    if (fechaInicio || fechaFin) {
      where.fecha_ausencia = {};
      if (fechaInicio) {
        const start = new Date(fechaInicio);
        start.setHours(0,0,0,0);
        where.fecha_ausencia.gte = start;
      }
      if (fechaFin) {
        const end = new Date(fechaFin);
        end.setHours(23,59,59,999);
        where.fecha_ausencia.lte = end;
      }
    }

    if (estado) where.estado = estado;
    
    if (personaTipo === 'alumno') where.alumno_id = { not: null };
    if (personaTipo === 'personal') where.personal_id = { not: null };

    if (alumno_id) where.alumno_id = parseInt(alumno_id);
    if (personal_id) where.personal_id = parseInt(personal_id);

    const excusas = await prisma.excusa.findMany({
      where,
      include: {
        alumno: { select: { nombres: true, apellidos: true, carnet: true, grado: true } },
        personal: { select: { nombres: true, apellidos: true, cargo: true } }
      },
      orderBy: { creado_en: 'desc' }
    });

    res.json({ excusas });
  } catch (error) {
    logger.error({ err: error }, 'Error listando justificaciones');
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/excusas/:id
 * Actualizar estado (Aprobar/Rechazar)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    const excusa = await prisma.excusa.update({
      where: { id: parseInt(id) },
      data: { 
        estado, 
        observaciones 
      }
    });

    logger.info({ excusaId: id, estado }, 'Estado de justificación actualizado');
    res.json({ success: true, excusa });
  } catch (error) {
    logger.error({ err: error }, 'Error actualizando justificación');
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/excusas/:id
 * Eliminar justificación
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener info para borrar archivo
    const excusa = await prisma.excusa.findUnique({ where: { id: parseInt(id) } });
    
    await prisma.excusa.delete({ where: { id: parseInt(id) } });

    if (excusa && excusa.documento_url) {
      const filePath = path.join(UPLOADS_DIR, excusa.documento_url);
      try { await fs.unlink(filePath); } catch(e) { logger.warn('No se pudo borrar archivo de justificación', filePath); }
    }

    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error eliminando justificación');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
