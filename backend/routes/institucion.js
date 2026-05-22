const express = require('express');
const { generatePersonalCarnet } = require('../utils/carnetGenerator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { logger } = require('../utils/logger');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { UPLOADS_DIR } = require('../utils/paths');
const { uploadBuffer } = require('../services/imageService');

// Configuración de Multer para logos y fotos (Uso de memoria para estabilidad en Windows/Electron)
const storage = multer.memoryStorage();

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

    // Validar auto-inicialización para DBs legacy
    if (institucion && !institucion.inicializado && institucion.nombre !== 'Mi Institución Educativa') {
      const hasAdmin = await prisma.usuario.findFirst({ where: { rol: 'admin' } });
      if (hasAdmin) {
        institucion = await prisma.institucion.update({
          where: { id: 1 },
          data: { inicializado: true }
        });
        logger.info('[MIGRATION] Institución auto-inicializada por tener datos legacy');
      }
    }

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
          ciclo_escolar: 2026
        },
      });
      logger.info('Institución creada con valores por defecto');
    }

    // Validar que logo_path corresponde a un archivo que existe
    // Si no existe, usar logo_base64 como fallback
    if (institucion.logo_path) {
      const logoFullPath = path.join(UPLOADS_DIR, institucion.logo_path);
      if (!fs.existsSync(logoFullPath)) {
        logger.warn(`Logo no encontrado en: ${logoFullPath}. Usando logo_base64 como fallback.`);
        institucion = {
          ...institucion,
          logo_path: null  // No enviar referencia a archivo que no existe
          // logo_base64 ya está incluído en el objeto
        };
      }
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
  (req, res, next) => {
    const uploadFields = upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'admin_foto', maxCount: 1 },
      { name: 'director_fotos_0', maxCount: 1 },
      { name: 'director_fotos_1', maxCount: 1 },
      { name: 'director_fotos_2', maxCount: 1 },
      { name: 'director_fotos_3', maxCount: 1 },
      { name: 'director_fotos_4', maxCount: 1 }
    ]);
    
    uploadFields(req, res, (err) => {
      if (err) {
        logger.error({ err }, '[MULTER] Error en /institucion/init');
        return res.status(400).json({ error: 'Error al subir archivos en el setup', detalle: err.message });
      }
      next();
    });
  },
  [
    // Validaciones (Nota: al usar multer, req.body se procesa después de los archivos)
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').optional({ checkFalsy: true }).isEmail().withMessage('Email institucional inválido'),
    check('admin_email').optional({ checkFalsy: true }).isEmail().withMessage('Email de administrador inválido'),
    check('admin_username').optional({ checkFalsy: true }).isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),
    check('admin_password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
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
        admin_username,
        admin_password,
        admin_nombres,
        admin_apellidos,
        admin_cargo,
        admin_jornada,
        municipio,
        directores // Expecting JSON string
      } = req.body;

      const debugBody = { ...req.body };
      logger.info({ body: debugBody, files: req.files }, '[DEBUG] Entering /init route');

      if (!nombre || (!admin_email && !admin_username) || !admin_password) {
        return res.status(400).json({
          error: 'Faltan parámetros requeridos: nombre, identificador de admin (email/usuario) y contraseña',
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
        const logoResult = await uploadBuffer(req.files['logo'][0].buffer, 'logos', `logo-${Date.now()}`);
        logoPath = logoResult.secure_url;
      }

      // Procesar foto admin
      let adminFotoPath = null;
      if (req.files && req.files['admin_foto'] && req.files['admin_foto'][0]) {
        const adminResult = await uploadBuffer(req.files['admin_foto'][0].buffer, 'usuarios', `admin-${Date.now()}`);
        adminFotoPath = adminResult.secure_url;
      }

      // Generar Master Recovery Key (12 chars alfanuméricos) - SE MUESTRA SOLO UNA VEZ
      const masterRecoveryKey =
        Math.random().toString(36).substring(2, 8).toUpperCase() +
        Math.random().toString(36).substring(2, 8).toUpperCase();

      // HASH de la Master Key para seguridad
      const masterRecoveryKeyHash = await bcrypt.hash(masterRecoveryKey, 10);
      


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
          ciclo_escolar: req.body.ciclo_escolar ? parseInt(req.body.ciclo_escolar) : new Date().getFullYear()
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

        // Buscar si ya existe para hacer upsert correcto
        let existingAdmin = null;
        if (admin_email) existingAdmin = await tx.usuario.findUnique({ where: { email: admin_email } });
        if (!existingAdmin && admin_username) existingAdmin = await tx.usuario.findUnique({ where: { username: admin_username } });

        const adminData = {
          email: admin_email || null,
          username: admin_username || null,
          hash_pass,
          nombres: admin_nombres,
          apellidos: admin_apellidos || 'Sistema',
          cargo: admin_cargo,
          jornada: admin_jornada || 'Matutina',
          rol: 'admin',
          activo: true,
          foto_path: adminFotoPath,
        };

        if (existingAdmin) {
          await tx.usuario.update({
            where: { id: existingAdmin.id },
            data: adminData,
          });
        } else {
          await tx.usuario.create({
            data: adminData,
          });
        }

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
              const dirResult = await uploadBuffer(req.files[fotoField][0].buffer, 'directores', `director-${i}-${Date.now()}`);
              dirFotoPath = dirResult.secure_url;
              logger.info({ index: i, fotoField }, '[DEBUG] Foto de director procesada');
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
      const logoResult = await uploadBuffer(req.files['logo'][0].buffer, 'logos', `logo-${Date.now()}`);
      logoPath = logoResult.secure_url;
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
      ...(req.body.ciclo_escolar && { ciclo_escolar: parseInt(req.body.ciclo_escolar) })
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

    // Si se actualizó el logo, regenerar todos los QRs en background
    if (logoPath) {
      logger.info(
        { logoPath },
        '[LOGO] Nuevo logo detectado — disparando regeneración masiva de QRs en background'
      );
      // Fire-and-forget: no bloqueamos la respuesta HTTP
      qrService.regenerarTodosLosQrs(logoPath).catch((err) => {
        logger.error({ err }, '[QR-REGEN] Error en regeneración background tras cambio de logo');
      });
    }

    logger.info('Institución actualizada:', { id: institucion.id, nombre: institucion.nombre });
    res.json({
      ...institucion,
      ...(logoPath ? { qr_regeneracion: 'en_progreso' } : {})
    });
  } catch (error) {
    logger.error('Error al actualizar institución:', error);
    res.status(500).json({
      error: 'Error al actualizar institución',
      detalle: error.message,
    });
  }
});

module.exports = router;
