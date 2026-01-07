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
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, user.hash_pass);
    if (!ok) {
      logger.warn({ email, userId: user.id }, '[WARNING] Intento de login con contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = signJWT(user);
    logger.info({ userId: user.id, email, rol: user.rol }, '[OK] Login exitoso');
    
    return res.json({
      accessToken: token,
      user: { 
        id: user.id, 
        email: user.email, 
        rol: user.rol,
        nombres: user.nombres,
        apellidos: user.apellidos,
        foto_path: user.foto_path,
        cargo: user.cargo
      }
    });
  } catch (err) {
    logger.error({ err, email: req.body.email }, '[ERROR] Error en login');
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
    const { email, masterKey, newPassword } = req.body;

    if (!email || !masterKey || !newPassword) {
      return res.status(400).json({ error: 'Faltan datos requeridos (email, llave, nueva contraseña)' });
    }

    // 1. Verificar la Llave Maestra en la Institución
    const institucion = await prisma.institucion.findFirst({ where: { id: 1 } });
    if (!institucion || !institucion.master_recovery_key) {
      return res.status(500).json({ error: 'El sistema no tiene una llave maestra configurada' });
    }

    if (masterKey !== institucion.master_recovery_key) {
      logger.warn({ email }, '[SECURITY] Intento de reset-admin con llave maestra incorrecta');
      return res.status(401).json({ error: 'Llave Maestra incorrecta' });
    }

    // 2. Verificar que el usuario sea Admin
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo se pueden recuperar cuentas de administrador por este método' });
    }

    // 3. Actualizar contraseña
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.usuario.update({
      where: { email },
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
