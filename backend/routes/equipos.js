const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyJWT, verifyAdmin } = require('../middlewares/auth');
const { logger } = require('../utils/logger');
const os = require('os');
const crypto = require('crypto');

// Obtener IPs locales del servidor
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

/**
 * GET /api/equipos/server-info
 * Información de red del servidor
 */
router.get('/server-info', verifyJWT, (req, res) => {
  res.json({
    ips: getLocalIPs(),
    hostname: os.hostname(),
    platform: os.platform()
  });
});

/**
 * GET /api/equipos
 * Listar todos los equipos registrados
 */
router.get('/', verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const equipos = await prisma.equipo.findMany({
      orderBy: { ultima_conexion: 'desc' }
    });
    res.json(equipos);
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Obteniendo equipos');
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
});

/**
 * POST /api/equipos/register
 * Auto-registro público para clientes nuevos (sin autenticación)
 */
router.post('/register', async (req, res) => {
  try {
    const { nombre_equipo, ip_address, mac_address } = req.body;
    
    // Detectar IP del cliente
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const finalIP = ip_address === 'auto' ? clientIP.replace('::ffff:', '') : ip_address;
    
    // Generar MAC único si es 'auto'
    const finalMAC = mac_address === 'auto' ? crypto.randomBytes(6).toString('hex') : mac_address;
    
    // Generar clave de seguridad única
    const clave_seguridad = crypto.randomBytes(32).toString('hex');
    
    // Verificar si ya existe un equipo con esta IP
    const existente = await prisma.equipo.findFirst({
      where: { ip: finalIP }
    });
    
    if (existente) {
      // Si ya existe, devolver el ID existente
      logger.info({ equipo_id: existente.id, ip: finalIP }, '[INFO] Equipo ya registrado');
      return res.json({ 
        equipoId: existente.id, 
        aprobado: existente.aprobado,
        message: 'Equipo ya registrado. Esperando aprobación del administrador.'
      });
    }

    const equipo = await prisma.equipo.create({
      data: {
        nombre: nombre_equipo || 'PC-Cliente',
        hostname: nombre_equipo || 'unknown',
        ip: finalIP,
        os: 'Windows',
        mac_address: finalMAC,
        clave_seguridad,
        aprobado: false // Requiere aprobación manual del admin
      }
    });

    logger.info({ equipo_id: equipo.id, ip: finalIP }, '[OK] Nuevo equipo registrado (pendiente aprobación)');
    res.status(201).json({ 
      equipoId: equipo.id,
      aprobado: false,
      message: 'Equipo registrado exitosamente. Esperando aprobación del administrador.'
    });
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Auto-registrando equipo');
    res.status(500).json({ error: 'Error al registrar equipo' });
  }
});

/**
 * POST /api/equipos/register-admin
 * Registro manual por el administrador (requiere autenticación)
 */
router.post('/register-admin', verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const { nombre, hostname, ip, os_name, mac_address } = req.body;

    if (!ip) return res.status(400).json({ error: 'IP es requerida' });

    // Generar clave de seguridad única
    const clave_seguridad = crypto.randomBytes(32).toString('hex');

    const equipo = await prisma.equipo.create({
      data: {
        nombre,
        hostname,
        ip,
        os: os_name,
        mac_address,
        clave_seguridad,
        aprobado: false // Requiere aprobación manual del admin
      }
    });

    logger.info({ equipo_id: equipo.id, ip }, '[OK] Equipo registrado (pendiente aprobación)');
    res.status(201).json(equipo);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'La IP o MAC ya está registrada' });
    }
    logger.error({ err: error }, '[ERROR] Registrando equipo');
    res.status(500).json({ error: 'Error al registrar equipo' });
  }
});

/**
 * PUT /api/equipos/:id/approve
 * Aprobar o revocar un equipo
 */
router.put('/:id/approve', verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const { aprobado } = req.body;
    const id = parseInt(req.params.id);

    const equipo = await prisma.equipo.update({
      where: { id },
      data: { aprobado }
    });

    logger.info({ equipo_id: id, aprobado }, '[OK] Estado de aprobación de equipo actualizado');
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar equipo' });
  }
});

/**
 * DELETE /api/equipos/:id
 * Eliminar un equipo
 */
router.delete('/:id', verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.equipo.delete({ where: { id } });
    res.json({ message: 'Equipo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar equipo' });
  }
});

module.exports = router;
