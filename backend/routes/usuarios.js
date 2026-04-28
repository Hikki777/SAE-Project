const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const { verifyJWT } = require('../middlewares/auth');
const { logger } = require('../utils/logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { UPLOADS_DIR } = require('../utils/paths');

const { uploadBuffer, deleteImage } = require('../services/imageService');

// Configuración de Multer para memoria (más estable en Windows/Electron)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp, gif)'));
    }
  }
});

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyJWT);

/**
 * GET /api/usuarios
 * Obtener todos los usuarios
 */
router.get('/', async (req, res) => {
  try {
    // Verificar rol (opcional, por ahora todos los autenticados pueden ver o solo admin?)
    // Dejemos que todos vean la lista básica, pero solo admin crea/borra
    
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        nombres: true,
        apellidos: true,
        cargo: true,
        jornada: true,
        foto_path: true,
        rol: true,
        activo: true,
        creado_en: true
      },
      orderBy: { creado_en: 'desc' }
    });

    res.json({ usuarios });
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error obteniendo usuarios');
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

/**
 * POST /api/usuarios
 * Crear nuevo usuario
 */
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    // Validar permisos de admin
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado. Solo administradores pueden crear usuarios.' });
    }

    const { email, username, password, nombres, apellidos, cargo, jornada, rol } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({ error: 'Se requiere al menos un identificador (Email o Usuario) y una contraseña' });
    }

    if (rol && !['admin', 'operador'].includes(rol)) {
      return res.status(400).json({ error: 'El rol debe ser estrictamente "admin" o "operador"' });
    }

    // Verificar si ya existe por email o por username
    if (email) {
      const existenteEmail = await prisma.usuario.findUnique({ where: { email } });
      if (existenteEmail) return res.status(400).json({ error: 'El email ya está registrado' });
    }
    if (username) {
      const existenteUsername = await prisma.usuario.findUnique({ where: { username } });
      if (existenteUsername) return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(password, salt);

    // Determinar foto_path si existe archivo
    let foto_path = null;
    if (req.file) {
      const publicId = `user-${Date.now()}`;
      const result = await uploadBuffer(req.file.buffer, 'usuarios', publicId);
      foto_path = result.secure_url;
    }

    const usuario = await prisma.usuario.create({
      data: {
        email: email || null,
        username: username || null,
        hash_pass,
        nombres,
        apellidos,
        cargo,
        jornada,
        foto_path,
        rol: rol || 'operador',
        activo: true
      },
      select: {
        id: true,
        email: true,
        username: true,
        nombres: true,
        apellidos: true,
        rol: true,
        activo: true,
        foto_path: true
      }
    });

    logger.info({ usuario_id: usuario.id, email }, '[OK] Usuario creado exitosamente');
    res.status(201).json({ message: 'Usuario creado', usuario });

  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error creando usuario');
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

/**
 * DELETE /api/usuarios/:id
 * Eliminar usuario
 */
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado.' });
    }

    const id = parseInt(req.params.id);

    // Evitar auto-eliminación
    if (id === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }

    // Protección del último admin
    const userToDelete = await prisma.usuario.findUnique({ where: { id } });
    if (userToDelete && userToDelete.rol === 'admin') {
      const adminCount = await prisma.usuario.count({ where: { rol: 'admin', activo: true } });
      if (adminCount <= 1) {
        return res.status(403).json({ error: 'Operación denegada: No puedes eliminar al último administrador del sistema.' });
      }
    }

    await prisma.usuario.delete({
      where: { id }
    });

    logger.info({ eliminado_id: id, por_admin: req.user.id }, '[DELETE] Usuario eliminado');
    res.json({ success: true, message: 'Usuario eliminado correctamente' });

  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error eliminando usuario');
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/usuarios/:id
 * Actualizar usuario existente
 */
router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    if (req.user.rol !== 'admin' && parseInt(req.user.id) !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'No autorizado. Solo administradores pueden modificar usuarios o puedes modificar tu propio perfil.' });
    }

    const id = parseInt(req.params.id);
    const { email, username, password, nombres, apellidos, cargo, jornada, rol, activo } = req.body;

    if (rol && !['admin', 'operador'].includes(rol)) {
      return res.status(400).json({ error: 'El rol debe ser estrictamente "admin" o "operador"' });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Validar identificador único si cambia
    if (email && email !== existingUser.email) {
      const checkEmail = await prisma.usuario.findUnique({ where: { email } });
      if (checkEmail) return res.status(400).json({ error: 'El email ya está en uso' });
    }
    if (username && username !== existingUser.username) {
      const checkUser = await prisma.usuario.findUnique({ where: { username } });
      if (checkUser) return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Garantizar que no se quede sin identificador
    if (!email && !username && !existingUser.email && !existingUser.username) {
       return res.status(400).json({ error: 'El usuario debe tener al menos un Email o un Nombre de Usuario' });
    }

    // Protección de último admin en caso de intentar pasarlo a operador o desactivarlo
    if (existingUser.rol === 'admin') {
      const isDowngradingOrDisabling = (rol && rol !== 'admin') || (activo !== undefined && String(activo) === 'false');
      if (isDowngradingOrDisabling) {
        const adminCount = await prisma.usuario.count({ where: { rol: 'admin', activo: true } });
        if (adminCount <= 1) {
          return res.status(403).json({ error: 'Operación denegada: No puedes degradar o desactivar al último administrador activo del sistema.' });
        }
      }
    }

    // Preparar objeto de datos
    const updateData = {
      email: email !== undefined ? (email || null) : undefined,
      username: username !== undefined ? (username || null) : undefined,
      nombres,
      apellidos,
      cargo,
      jornada,
      rol,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : undefined
    };

    // Manejar foto si viene en el request
    if (req.file) {
      const publicId = `user-${id}-${Date.now()}`;
      const result = await uploadBuffer(req.file.buffer, 'usuarios', publicId);
      updateData.foto_path = result.secure_url;
      
      // Intentar borrar foto anterior si existe
      if (existingUser.foto_path && existingUser.foto_path !== updateData.foto_path) {
          const oldPublicId = path.parse(existingUser.foto_path).name;
          deleteImage(oldPublicId).catch(err => logger.warn({ err }, 'Error borrando foto antigua'));
      }
    }

    // Si hay password, hashearlo
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.hash_pass = await bcrypt.hash(password, salt);
    }

    logger.debug({ id, updateData }, '[DEBUG] Intentando update de usuario');

    const usuario = await prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true, email: true, username: true, nombres: true, apellidos: true,
        rol: true, activo: true, foto_path: true, cargo: true
      }
    });

    logger.info({ usuario_id: id, por_admin: req.user.id }, '[UPDATE] Usuario actualizado');
    res.json({ message: 'Usuario actualizado correctamente', usuario });

  } catch (error) {
    logger.error({ err: error, id: req.params.id }, '[ERROR] Actualizando usuario');
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

/**
 * POST /api/usuarios/:id/foto
 * Subir foto de perfil
 */
router.post('/:id/foto', (req, res, next) => {
  upload.single('foto')(req, res, (err) => {
    if (err) {
      logger.error({ err }, '[MULTER] Error subiendo foto de usuario');
      return res.status(400).json({ error: 'Error al procesar la imagen', detalle: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logger.debug({ id, file: !!req.file }, '[USER-PHOTO] Iniciando subida de foto');
    
    // Verificar permisos: Admin o el mismo usuario
    if (req.user.rol !== 'admin' && parseInt(req.user.id) !== id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (!req.file) {
      logger.warn({ id }, '[USER-PHOTO] Intento de subida sin archivo');
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const publicId = `user-${id}-${Date.now()}`;
    const result = await uploadBuffer(req.file.buffer, 'usuarios', publicId);
    const relativePath = result.secure_url;

    // Actualizar usuario
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { foto_path: relativePath },
      select: { id: true, email: true, foto_path: true }
    });

    logger.info({ usuario_id: id }, '[OK] Foto de perfil actualizada');
    res.json({ message: 'Foto actualizada', usuario });

  } catch (error) {
    logger.error({ err: error }, '[ERROR] Subiendo foto usuario');
    res.status(500).json({ 
      error: 'Error al subir la foto',
      message: error.message,
      stack: error.stack 
    });
  }
});

module.exports = router;
