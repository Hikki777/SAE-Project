const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyJWT } = require('../middlewares/auth');
const { logger } = require('../utils/logger');

/**
 * GET /api/sync/initial
 * Sincronización inicial completa (para cliente nuevo)
 */
router.get('/initial', verifyJWT, async (req, res) => {
  try {
    logger.info('[SYNC] Iniciando sincronización inicial completa');
    
    // Obtener todos los datos necesarios
    const [alumnos, personal, asistencias, excusas, institucion] = await Promise.all([
      prisma.alumno.findMany({
        include: {
          codigoQr: true,
          historialAcademico: true
        }
      }),
      prisma.personal.findMany({
        include: {
          codigoQr: true
        }
      }),
      prisma.asistencia.findMany({
        orderBy: { fecha: 'desc' },
        take: 1000 // Últimas 1000 asistencias
      }),
      prisma.excusa.findMany({
        orderBy: { fecha_inicio: 'desc' },
        take: 500 // Últimas 500 excusas
      }),
      prisma.institucion.findFirst()
    ]);

    const syncData = {
      timestamp: new Date().toISOString(),
      data: {
        alumnos,
        personal,
        asistencias,
        excusas,
        institucion
      },
      counts: {
        alumnos: alumnos.length,
        personal: personal.length,
        asistencias: asistencias.length,
        excusas: excusas.length
      }
    };

    logger.info({ counts: syncData.counts }, '[SYNC] Sincronización inicial completada');
    res.json(syncData);
  } catch (error) {
    logger.error({ err: error }, '[SYNC] Error en sincronización inicial');
    res.status(500).json({ error: 'Error en sincronización inicial' });
  }
});

/**
 * GET /api/sync/incremental
 * Sincronización incremental (cambios desde timestamp)
 */
router.get('/incremental', verifyJWT, async (req, res) => {
  try {
    const { since } = req.query;
    
    if (!since) {
      return res.status(400).json({ error: 'Parámetro "since" requerido' });
    }

    const sinceDate = new Date(since);
    logger.info({ since: sinceDate }, '[SYNC] Sincronización incremental');

    // Obtener cambios desde la fecha especificada
    const [alumnos, personal, asistencias, excusas] = await Promise.all([
      prisma.alumno.findMany({
        where: {
          OR: [
            { creado_en: { gte: sinceDate } },
            { actualizado_en: { gte: sinceDate } }
          ]
        },
        include: {
          codigoQr: true,
          historialAcademico: true
        }
      }),
      prisma.personal.findMany({
        where: {
          OR: [
            { creado_en: { gte: sinceDate } },
            { actualizado_en: { gte: sinceDate } }
          ]
        },
        include: {
          codigoQr: true
        }
      }),
      prisma.asistencia.findMany({
        where: {
          creado_en: { gte: sinceDate }
        }
      }),
      prisma.excusa.findMany({
        where: {
          OR: [
            { creado_en: { gte: sinceDate } },
            { actualizado_en: { gte: sinceDate } }
          ]
        }
      })
    ]);

    const syncData = {
      timestamp: new Date().toISOString(),
      since: sinceDate.toISOString(),
      changes: {
        alumnos,
        personal,
        asistencias,
        excusas
      },
      counts: {
        alumnos: alumnos.length,
        personal: personal.length,
        asistencias: asistencias.length,
        excusas: excusas.length
      }
    };

    logger.info({ counts: syncData.counts }, '[SYNC] Sincronización incremental completada');
    res.json(syncData);
  } catch (error) {
    logger.error({ err: error }, '[SYNC] Error en sincronización incremental');
    res.status(500).json({ error: 'Error en sincronización incremental' });
  }
});

/**
 * POST /api/sync/push
 * Cliente envía cambios al servidor
 */
router.post('/push', verifyJWT, async (req, res) => {
  try {
    const { changes, equipoId } = req.body;
    
    if (!changes || !equipoId) {
      return res.status(400).json({ error: 'Cambios y equipoId requeridos' });
    }

    logger.info({ equipoId, changeCount: changes.length }, '[SYNC] Recibiendo cambios del cliente');

    const results = {
      success: [],
      errors: [],
      conflicts: []
    };

    // Procesar cada cambio
    for (const change of changes) {
      try {
        const { type, action, data, id } = change;
        
        // Verificar si hay conflicto (last-write-wins)
        if (action === 'update' && id) {
          const existing = await getExistingRecord(type, id);
          if (existing && existing.actualizado_en > new Date(data.actualizado_en)) {
            results.conflicts.push({
              type,
              id,
              reason: 'Server has newer version'
            });
            continue;
          }
        }

        // Aplicar cambio
        await applyChange(type, action, data, id);
        results.success.push({ type, action, id });

        // Broadcast a otros clientes vía WebSocket
        const io = req.app.get('io');
        if (io && io.broadcastDataChange) {
          io.broadcastDataChange(type, id || data.id, action);
        }
      } catch (error) {
        logger.error({ err: error, change }, '[SYNC] Error aplicando cambio');
        results.errors.push({
          change,
          error: error.message
        });
      }
    }

    logger.info({ results }, '[SYNC] Cambios procesados');
    res.json(results);
  } catch (error) {
    logger.error({ err: error }, '[SYNC] Error en push de cambios');
    res.status(500).json({ error: 'Error procesando cambios' });
  }
});

/**
 * Obtener registro existente por tipo e ID
 */
async function getExistingRecord(type, id) {
  switch (type) {
    case 'alumno':
      return await prisma.alumno.findUnique({ where: { id: parseInt(id) } });
    case 'personal':
      return await prisma.personal.findUnique({ where: { id: parseInt(id) } });
    case 'asistencia':
      return await prisma.asistencia.findUnique({ where: { id: parseInt(id) } });
    case 'excusa':
      return await prisma.excusa.findUnique({ where: { id: parseInt(id) } });
    default:
      return null;
  }
}

/**
 * Aplicar cambio a la base de datos
 */
async function applyChange(type, action, data, id) {
  const model = getModel(type);
  
  switch (action) {
    case 'create':
      await model.create({ data });
      break;
    case 'update':
      await model.update({
        where: { id: parseInt(id) },
        data
      });
      break;
    case 'delete':
      await model.delete({
        where: { id: parseInt(id) }
      });
      break;
    default:
      throw new Error(`Acción desconocida: ${action}`);
  }
}

/**
 * Obtener modelo de Prisma por tipo
 */
function getModel(type) {
  switch (type) {
    case 'alumno':
      return prisma.alumno;
    case 'personal':
      return prisma.personal;
    case 'asistencia':
      return prisma.asistencia;
    case 'excusa':
      return prisma.excusa;
    default:
      throw new Error(`Tipo desconocido: ${type}`);
  }
}

module.exports = router;
