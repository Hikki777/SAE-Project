const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const { signJWT, verifyJWT } = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimiter');
const { validarLogin } = require('../middlewares/validation');
const { logger } = require('../utils/logger');

const router = express.Router();

// POST /api/auth/login - Con rate limiting y validación
router.post('/login', loginLimiter, validarLogin, async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identificador y contraseña son requeridos' });
    }

    // Buscar por email o por username
    const user = await prisma.usuario.findFirst({ 
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, user.hash_pass);
    if (!ok) {
      logger.warn({ identifier, userId: user.id }, '[WARNING] Intento de login con contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = signJWT(user);
    logger.info({ userId: user.id, identifier, rol: user.rol }, '[OK] Login exitoso');
    
    return res.json({
      accessToken: token,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        rol: user.rol,
        nombres: user.nombres,
        apellidos: user.apellidos,
        foto_path: user.foto_path,
        cargo: user.cargo
      }
    });
  } catch (err) {
    logger.error({ err, identifier: req.body.identifier }, '[ERROR] Error en login');
    return res.status(500).json({ error: 'Error iniciando sesión' });
  }
});

// GET /api/auth/me
router.get('/me', verifyJWT, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: Number(req.user.id) },
      select: { 
        id: true, 
        email: true, 
        username: true,
        rol: true, 
        activo: true, 
        creado_en: true,
        nombres: true,
        apellidos: true,
        foto_path: true,
        cargo: true
      }
    });
    if (!user) {
      logger.warn({ userId: req.user.id }, '[WARNING] Usuario no encontrado en /me');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(user);
  } catch (err) {
    logger.error({ err, userId: req.user?.id }, '[ERROR] Error obteniendo perfil de usuario');
    return res.status(500).json({ error: 'Error obteniendo perfil' });
  }
});

// POST /api/auth/reset-admin - Recuperación de administrador mediante Llave Maestra
router.post('/reset-admin', async (req, res) => {
  try {
    const { identifier, masterKey, newPassword } = req.body;

    if (!identifier || !masterKey || !newPassword) {
      return res.status(400).json({ error: 'Faltan datos requeridos (identificador, llave, nueva contraseña)' });
    }

    // 1. Verificar la Llave Maestra en la Institución
    const institucion = await prisma.institucion.findFirst({ where: { id: 1 } });
    if (!institucion || !institucion.master_recovery_key) {
      return res.status(500).json({ error: 'El sistema no tiene una llave maestra configurada' });
    }

    const keyMatch = await bcrypt.compare(masterKey, institucion.master_recovery_key);
    if (!keyMatch) {
      logger.warn({ identifier }, '[SECURITY] Intento de reset-admin con llave maestra incorrecta');
      return res.status(401).json({ error: 'Llave Maestra incorrecta' });
    }

    // 2. Verificar que el usuario sea Admin
    const user = await prisma.usuario.findFirst({ 
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo se pueden recuperar cuentas de administrador por este método' });
    }

    // 3. Actualizar contraseña
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.usuario.update({
      where: { id: user.id },
      data: { hash_pass: hash, activo: true }
    });

    logger.info({ email, userId: user.id }, '[SECURITY] Contraseña de administrador restablecida con éxito');
    return res.json({ success: true, message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    logger.error({ err }, '[ERROR] Error en reset-admin');
    return res.status(500).json({ error: 'Error procesando la recuperación' });
  }
});

module.exports = router;
