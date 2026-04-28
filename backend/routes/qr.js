const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { UPLOADS_DIR } = require('../utils/paths');
const prisma = require('../prismaClient');
const qrService = require('../services/qrService');
const tokenService = require('../services/tokenService');
const { verifyJWT } = require('../middlewares/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// NOTA: Algunas rutas como GET /:id/png son públicas para permitir su uso en <img> sin tokens
// Las rutas sensibles deben usar verifyJWT individualmente o agruparse.

/**
 * POST /api/qr/generar
 * Generar QR con logo para una persona
 * Body: { persona_tipo, persona_id }
 */
router.post('/generar', verifyJWT, async (req, res) => {
  try {
    const { persona_tipo, persona_id } = req.body;

    if (!persona_tipo || !persona_id) {
      return res.status(400).json({
        error: 'Faltan parámetros: persona_tipo, persona_id'
      });
    }

    if (!['alumno', 'personal'].includes(persona_tipo)) {
      return res.status(400).json({
        error: 'persona_tipo debe ser "alumno" o "personal"'
      });
    }

    // Obtener institución y logo
    const institucion = await prisma.institucion.findFirst();
    if (!institucion || !institucion.logo_base64) {
      return res.status(400).json({
        error: 'Institución no inicializada o logo faltante'
      });
    }

    // Obtener persona
    let persona;
    if (persona_tipo === 'alumno') {
      persona = await prisma.alumno.findUnique({ where: { id: persona_id } });
    } else {
      persona = await prisma.personal.findUnique({ where: { id: persona_id } });
    }

    if (!persona) {
      return res.status(404).json({
        error: `${persona_tipo} con id ${persona_id} no encontrado`
      });
    }

    // Verificar si ya existe QR
    let codigoQr = await prisma.codigoQr.findFirst({
      where: {
        persona_tipo,
        ...(persona_tipo === 'alumno' ? { alumno_id: persona_id } : { personal_id: persona_id })
      }
    });

    // Si no existe, crear uno nuevo
    if (!codigoQr) {
      // CAMBIO: JSON Simple
      // const token = tokenService.generarToken(persona_tipo, persona_id);
      
      const tokenData = {
        tipo: persona_tipo, // Usar el tipo real: 'alumno' o 'personal'
        id: persona_id,
        carnet: persona.carnet
      };
      const token = JSON.stringify(tokenData);
      
      const createData = {
        persona_tipo,
        token,
        vigente: true
      };

      if (persona_tipo === 'alumno') {
        createData.alumno_id = persona_id;
      } else {
        createData.personal_id = persona_id;
      }

      codigoQr = await prisma.codigoQr.create({ data: createData });
    }

    // Generar rutas
    const { filename } = qrService.obtenerRutasQr(
      persona_tipo,
      persona.carnet
    );

    // Generar PNG con logo
    const qrUrl = await qrService.generarQrConLogo(
      codigoQr.token,
      institucion.logo_base64,
      filename
    );

    if (!qrUrl) {
      return res.status(500).json({
        error: 'Error generando QR'
      });
    }

    // Actualizar BD
    // Guardamos la URL completa en png_path (aunque el nombre del campo sea path)
    await prisma.codigoQr.update({
      where: { id: codigoQr.id },
      data: {
        png_path: qrUrl,
        generado_en: new Date()
      }
    });

    // Registrar en auditoria
    await prisma.auditoria.create({
      data: {
        entidad: 'CodigoQr',
        entidad_id: codigoQr.id,
        accion: 'crear',
        detalle: JSON.stringify({
          persona_tipo,
          persona_id,
          carnet: persona.carnet,
          url: qrUrl
        })
      }
    });

    logger.info({ persona_tipo, carnet: persona.carnet, qrId: codigoQr.id }, `[OK] QR generado: ${persona_tipo}/${persona.carnet}`);

    res.status(201).json({
      success: true,
      codigo_qr: {
        id: codigoQr.id,
        token: codigoQr.token.substring(0, 30) + '...',
        png_url: qrUrl, // Devolvemos la URL directa
        persona: {
          tipo: persona_tipo,
          nombre: `${persona.nombres} ${persona.apellidos}`,
          carnet: persona.carnet
        }
      }
    });
  } catch (error) {
    logger.error({ err: error, body: req.body }, '[ERROR] Error generando QR');
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/qr/:id/png
 * Servir PNG del QR
 * Si falta, intenta regenerar automáticamente
 */
router.get('/:id/png', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Buscar el registro en la BD
    const codigoQr = await prisma.codigoQr.findUnique({
      where: { id: parseInt(id) }
    });

    if (!codigoQr) {
      return res.status(404).json({ error: 'Registro de QR no encontrado' });
    }

    // 2. Si tiene ruta local, intentar servirla
    if (codigoQr.png_path && !codigoQr.png_path.startsWith('http')) {
      const pngPath = path.join(UPLOADS_DIR, codigoQr.png_path);
      if (fs.existsSync(pngPath)) {
        return res.sendFile(pngPath);
      }
    }

    // 3. Si no existe el archivo o es una URL externa antigua, regenerar
    logger.info({ qrId: id }, '[QR] Regenerando imagen PNG bajo demanda...');
    const result = await qrService.regenerarQr(id);
    
    if (result) {
      // El resultado es la ruta relativa (ej: qrs/alumno-123.png)
      const newPngPath = path.join(UPLOADS_DIR, result);
      if (fs.existsSync(newPngPath)) {
        return res.sendFile(newPngPath);
      }
    }

    throw new Error('No se pudo generar o encontrar el archivo PNG del QR');

  } catch (err) {
    logger.error({ err, qrId: req.params.id }, '[ERROR] GET /qr/:id/png');
    return res.status(500).json({ 
      error: 'Error al obtener imagen QR', 
      detalle: err.message,
      stack: err.stack 
    });
  }
});

router.use(verifyJWT);

/**
 * GET /api/qr/listar/todos
 * Listar todos los códigos QR registrados
 */
router.get('/listar/todos', async (req, res) => {
  try {
    const qrs = await prisma.codigoQr.findMany({
      select: {
        id: true,
        persona_tipo: true,
        token: true,
        png_path: true,
        vigente: true,
        generado_en: true,
        regenerado_en: true,
        alumno: { select: { carnet: true, nombres: true, apellidos: true } },
        personal: { select: { carnet: true, nombres: true, apellidos: true } }
      },
      take: 100
    });

    res.json({
      total: qrs.length,
      qrs: qrs.map(q => ({
        ...q,
        token: q.token.substring(0, 20) + '...',
        persona: q.alumno || q.personal
      }))
    });
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error listando QRs');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
