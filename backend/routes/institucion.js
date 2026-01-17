const express = require('express');
const { generatePersonalCarnet } = require('../utils/carnetGenerator');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const { logger } = require('../utils/logger');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { UPLOADS_DIR } = require('../utils/paths');

// Configuración de Multer para logos y fotos de admin
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let dir = UPLOADS_DIR;
    if (file.fieldname === 'logo') {
      dir = path.join(dir, 'logos');
    } else if (file.fieldname === 'admin_foto') {
      // Admin siempre va a usuarios/
      dir = path.join(dir, 'usuarios');
    } else if (file.fieldname.startsWith('director_fotos_')) {
      // Directores van a directores/
      dir = path.join(dir, 'directores');
    }
    await fs.ensureDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    let prefix = 'file';
    
    if (file.fieldname === 'logo') {
      prefix = 'logo';
    } else if (file.fieldname === 'admin_foto') {
      prefix = 'admin';
    } else if (file.fieldname.startsWith('director_fotos_')) {
      prefix = 'director';
    }
    
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  },
});
// Importar servicio QR al inicio para detectar errores de carga
const qrService = require('../services/qrService');

// GET /api/institucion - Obtener datos de la institución
router.get('/', async (req, res) => {
  try {
    let institucion = await prisma.institucion.findFirst({
      where: { id: 1 },
    });

    // Si no existe, crear una por defecto
    if (!institucion) {
      institucion = await prisma.institucion.create({
        data: {
          id: 1,
          nombre: 'Mi Institución Educativa',
          horario_inicio: '07:00',
          horario_salida: '13:00',
          margen_puntualidad_min: 5,
          inicializado: false,
        },
      });
      logger.info('Institución creada con valores por defecto');
    }

    res.json(institucion);
  } catch (error) {
    logger.error('Error al obtener institución:', error);
    res.status(500).json({
      error: 'Error al obtener datos de la institución',
      detalle: error.message,
    });
  }
});

// POST /api/institucion/init - Inicializar institución (Setup Wizard)
router.post(
  '/init',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'admin_foto', maxCount: 1 },
    // Permitir fotos de directores dinámica (limitada a 5)
    { name: 'director_fotos_0', maxCount: 1 },
    { name: 'director_fotos_1', maxCount: 1 },
    { name: 'director_fotos_2', maxCount: 1 },
    { name: 'director_fotos_3', maxCount: 1 },
    { name: 'director_fotos_4', maxCount: 1 }
  ]),
  [
    // Validaciones (Nota: al usar multer, req.body se procesa después de los archivos)
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').optional({ checkFalsy: true }).isEmail().withMessage('Email inválido'),
    check('admin_email').isEmail().withMessage('Email de administrador inválido'),
    check('admin_password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const {
        nombre,
        horario_inicio,
        horario_salida,
        margen_puntualidad_min: margen, // Renamed to 'margen' for clarity with the new logic
        direccion,
        pais,
        departamento,
        email, // Email institucional
        telefono,
        admin_email,
        admin_password,
        admin_nombres,
        admin_apellidos,
        admin_cargo,
        admin_jornada,
        municipio,
        directores // Expecting JSON string
      } = req.body;

      // DEBUG: Loguear cuerpo de la petición
      const debugBody = { ...req.body };
      logger.info({ body: debugBody, files: req.files }, '[DEBUG] Entering /init route');

      if (!nombre || !admin_email || !admin_password) {
        return res.status(400).json({
          error: 'Faltan parámetros requeridos: nombre, admin_email, admin_password',
        });
      }

      // Verificar si ya está inicializado
      const existing = await prisma.institucion.findUnique({ where: { id: 1 } }).catch(() => null);
      if (existing && existing.inicializado) {
        return res.status(400).json({ error: 'La institución ya está inicializada' });
      }

      // Procesar logo
      let logoPath = null;
      if (req.files && req.files['logo'] && req.files['logo'][0]) {
        logoPath = `logos/${req.files['logo'][0].filename}`;
      }

      // Procesar foto admin
      let adminFotoPath = null;
      if (req.files && req.files['admin_foto'] && req.files['admin_foto'][0]) {
        adminFotoPath = `usuarios/${req.files['admin_foto'][0].filename}`;
      }

      // Generar Master Recovery Key (12 chars alfanuméricos) - SE MUESTRA SOLO UNA VEZ
      const masterRecoveryKey =
        Math.random().toString(36).substring(2, 8).toUpperCase() +
        Math.random().toString(36).substring(2, 8).toUpperCase();

      // HASH de la Master Key para seguridad
      const masterRecoveryKeyHash = await bcrypt.hash(masterRecoveryKey, 10);
      
      console.log('[SETUP_DEBUG] Generated Key:', masterRecoveryKey);
      console.log('[SETUP_DEBUG] Generated Hash:', masterRecoveryKeyHash);
      console.log('[SETUP_DEBUG] Hash Length:', masterRecoveryKeyHash.length);

      const qrService = require('../services/qrService');
      let directoresCreados = []; // Para almacenar IDs de directores creados

      await prisma.$transaction(async (tx) => {
        // 1. Crear/Actualizar Institución
        const institucionData = {
          nombre,
          direccion,
          telefono,
          email, // Email institucional
          pais,
          departamento,
          municipio,
          horario_inicio: horario_inicio || '07:00',
          horario_salida: horario_salida || '13:00',
          margen_puntualidad_min: margen ? parseInt(margen) : 5,
          master_recovery_key: masterRecoveryKeyHash, // Guardar HASH, no texto plano
          inicializado: true,
        };

        if (logoPath) {
          institucionData.logo_path = logoPath;
        }

        const institucion = await tx.institucion.upsert({
          where: { id: 1 },
          update: institucionData,
          create: { id: 1, ...institucionData },
        });

        // 2. Crear Admin
        const hash_pass = await bcrypt.hash(admin_password, 10);

        // Upsert admin para evitar errores si se re-ejecuta
        const adminData = {
          email: admin_email,
          hash_pass,
          nombres: admin_nombres,
          apellidos: admin_apellidos || 'Sistema',
          cargo: admin_cargo,
          jornada: admin_jornada || 'Matutina',
          rol: 'admin',
          activo: true,
          foto_path: adminFotoPath, // Guardar foto si existe
        };

        await tx.usuario.upsert({
          where: { email: admin_email },
          update: adminData,
          create: adminData,
        });

        // 3. Crear Directores (si existen)
        let directoresList = [];
        if (directores) {
          try {
            directoresList = JSON.parse(directores);
          } catch (e) {
            logger.warn('Error parseando directores JSON en setup');
          }
        }

        if (Array.isArray(directoresList) && directoresList.length > 0) {
          logger.info(`Procesando ${directoresList.length} directores en setup...`);
          
          for (let i = 0; i < directoresList.length; i++) {
            const dir = directoresList[i];
            
            // Validar datos mínimos
            if (!dir.nombres || !dir.apellidos) continue;

            // Procesar foto si existe
            let dirFotoPath = null;
            const fotoField = `director_fotos_${i}`;
            if (req.files && req.files[fotoField] && req.files[fotoField][0]) {
              dirFotoPath = `directores/${req.files[fotoField][0].filename}`;
              logger.info({ index: i, fotoField, filename: req.files[fotoField][0].filename }, '[DEBUG] Foto de director procesada');
            } else {
              logger.warn({ index: i, fotoField, hasFiles: !!req.files, hasField: !!(req.files && req.files[fotoField]) }, '[DEBUG] No se encontró foto para director');
            }

            // Generar carnet automático
            const cargo = dir.cargo || 'Director';
            logger.info({ index: i, cargo: dir.cargo, cargoUsado: cargo, directorData: dir }, '[DEBUG] Generando carnet para director');
            const carnet = await generatePersonalCarnet(cargo, tx);
            logger.info({ index: i, cargo, carnetGenerado: carnet }, '[DEBUG] Carnet generado para director');
            
            // Crear registro en Personal
            const directorCreado = await tx.personal.create({
              data: {
                carnet,
                nombres: dir.nombres,
                apellidos: dir.apellidos,
                sexo: dir.sexo || 'Masculino',
                cargo: cargo,
                jornada: dir.jornada || 'Matutina',
                estado: 'activo',
                foto_path: dirFotoPath
              }
            });
            logger.info({ directorId: directorCreado.id, carnet: directorCreado.carnet, cargo: directorCreado.cargo }, '[DEBUG] Director creado en BD');

            // Guardar ID para generar QR después de la transacción
            directoresCreados.push(directorCreado.id);
          }
        }

        logger.info('Sistema inicializado correctamente');
      });

      // Generar QRs DESPUÉS de que la transacción se haya confirmado
      for (const directorId of directoresCreados) {
        try {
          await qrService.generarQrParaPersona('personal', directorId);
          logger.info({ directorId }, '[OK] QR generado para director en setup');
        } catch (qrError) {
          logger.error({ err: qrError, directorId }, '[WARNING] Falló generación de QR para director en setup');
        }
      }

      res.json({ success: true, masterRecoveryKey });
    } catch (error) {
      logger.error('Error en inicialización:', error);
      res.status(500).json({
        error: 'Error al inicializar el sistema',
        detalle: error.message,
      });
    }
  }
);

// PUT /api/institucion - Actualizar datos de la institución
router.put('/', upload.fields([{ name: 'logo', maxCount: 1 }]), async (req, res) => {
  try {
    const {
      nombre,
      horario_inicio,
      horario_salida,
      margen_puntualidad_min,
      pais,
      departamento,
      municipio,
      telefono,
      email,
      direccion,
    } = req.body;

    // Procesar logo si existe
    let logoPath = null;
    if (req.files && req.files['logo'] && req.files['logo'][0]) {
      logoPath = `logos/${req.files['logo'][0].filename}`;
    }

    const institucionData = {
      nombre,
      direccion,
      telefono,
      email,
      pais,
      departamento,
      municipio,
      horario_inicio: horario_inicio || '07:00',
      horario_salida: horario_salida || '13:00',
      margen_puntualidad_min: parseInt(margen_puntualidad_min) || 5,
    };

    if (logoPath) {
      institucionData.logo_path = logoPath;
    }

    const institucion = await prisma.institucion.upsert({
      where: { id: 1 },
      update: institucionData,
      create: {
        id: 1,
        ...institucionData,
        inicializado: true,
      },
    });

    // Invalidar caché
    req.app.locals.cache?.del('institucion');
    logger.debug('[CACHE INVALIDATE] Caché de institución invalidado tras actualización');

    logger.info('Institución actualizada:', { id: institucion.id, nombre: institucion.nombre });
    res.json(institucion);
  } catch (error) {
    logger.error('Error al actualizar institución:', error);
    res.status(500).json({
      error: 'Error al actualizar institución',
      detalle: error.message,
    });
  }
});

module.exports = router;
