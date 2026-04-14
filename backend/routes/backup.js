const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth');
const multer = require('multer');
const archiver = require('archiver');
const extract = require('extract-zip');
const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');
const { UPLOADS_DIR, TEMP_DIR, DB_PATH } = require('../utils/paths');
const prisma = require('../prismaClient');
const { logger } = require('../utils/logger');

// Configuración de cifrado
const ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 16;
const IV_LENGTH = 12; // Recomendado para GCM
const AUTH_TAG_LENGTH = 16;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 }; // Parámetros balanceados seguridad/velocidad

// Crear directorio temp si no existe
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Configurar multer para subir archivos de backup
const upload = multer({ 
  dest: TEMP_DIR,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max (mejorado)
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, TEMP_DIR);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      // Eliminar caracteres especiales para Windows
      const safeName = file.originalname.replace(/[^a-z0-9.]/gi, '_');
      cb(null, `backup-${timestamp}-${safeName}`);
    }
  })
});

/**
 * POST /api/backup/create
 * Crear backup cifrado del sistema usando Streams (AES-256-GCM)
 */
router.post('/create', verifyJWT, async (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Solo administradores pueden crear backups' });
  }

  let tempZipPath;

  try {
    const { password, confirmPassword } = req.body;
    
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    tempZipPath = path.join(TEMP_DIR, `internal-backup-${timestamp}.zip`);
    
    logger.info({ user: req.user.email }, 'Iniciando creación de backup (Stream Mode)');

    // 1. Crear ZIP temporal (Sin cifrar aún)
    const zipOutput = fs.createWriteStream(tempZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(zipOutput);
    
    if (fs.existsSync(DB_PATH)) {
      archive.file(DB_PATH, { name: 'dev.db' });
    } else {
      throw new Error('Base de datos no encontrada');
    }
    
    if (fs.existsSync(UPLOADS_DIR)) {
      archive.directory(UPLOADS_DIR, 'uploads');
    }

    // Metadata básica interna
    const institucion = await prisma.institucion.findFirst({
      select: { nombre: true }
    });
    
    const internalMeta = {
        fecha: new Date().toISOString(),
        version: '1.1.2',
        institucion: institucion?.nombre || 'SAE System'
    };
    archive.append(JSON.stringify(internalMeta), { name: 'backup-info.json' });

    await archive.finalize();

    // Esperar a que el ZIP termine de escribirse
    await new Promise((resolve, reject) => {
      zipOutput.on('close', resolve);
      zipOutput.on('error', reject);
    });

    // 2. Cifrar el ZIP usando Streams directamente hacia la respuesta
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derivar clave de la contraseña del usuario (Uso de Scrypt nativo)
    const key = crypto.scryptSync(password, salt, 32, SCRYPT_PARAMS);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const backupName = `sistema-backup-${timestamp}.bak`;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${backupName}"`);

    // Escribir cabecera manual en el stream (Salt + IV)
    // Esto permite que el archivo sea portable y auto-contenido
    res.write(Buffer.from('SAEBK')); // Magic Header
    res.write(salt);
    res.write(iv);

    const input = fs.createReadStream(tempZipPath);

    // Pipe: File -> Cipher -> Response
    input.pipe(cipher).on('end', () => {
        // Al terminar GCM, necesitamos el Auth Tag
        const authTag = cipher.getAuthTag();
        res.write(authTag);
        res.end();
        
        // Limpieza post-envío
        setTimeout(() => {
            if (fs.existsSync(tempZipPath)) fs.unlinkSync(tempZipPath);
        }, 1000);
        
        logger.info({ user: req.user.email, backupName }, 'Backup completado y enviado exitosamente');
    }).pipe(res, { end: false });

  } catch (error) {
    if (tempZipPath && fs.existsSync(tempZipPath)) {
        try { fs.unlinkSync(tempZipPath); } catch (e) {}
    }
    logger.error({ error: error.message }, 'Error en creación de backup');
    res.status(500).json({ error: 'Error al crear backup: ' + error.message });
  }
});

/**
 * POST /api/backup/restore
 * Restaurar sistema desde backup binario (AES-256-GCM)
 */
router.post('/restore', verifyJWT, upload.single('backup'), async (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const backupFile = req.file?.path;
  let extractPath;
  let decryptedZipPath;

  try {
    logger.info({ 
      user: req.user.email,
      hasFile: !!req.file,
      hasPassword: !!req.body.password,
      fileName: req.file?.originalname,
      mimeType: req.file?.mimetype 
    }, 'Iniciando restauración de backup');

    const { password } = req.body;
    if (!password || !backupFile) {
      logger.warn({ hasFile: !!req.file, hasPassword: !!req.body.password }, 'Faltan parámetros en restauración');
      return res.status(400).json({ error: 'Faltan parámetros: contraseña o archivo de backup.' });
    }

    // 1. Leer cabeceras del archivo binario
    const fd = fs.openSync(backupFile, 'r');
    const headerBuffer = Buffer.alloc(5); // SAEBK
    fs.readSync(fd, headerBuffer, 0, 5, 0);

    if (headerBuffer.toString() !== 'SAEBK') {
       fs.closeSync(fd);
       logger.error({ header: headerBuffer.toString() }, 'Magic Header inválido en backup');
       return res.status(400).json({ error: 'El archivo no es un backup válido de SAE o está dañado.' });
    }

    const salt = Buffer.alloc(SALT_LENGTH);
    const iv = Buffer.alloc(IV_LENGTH);
    fs.readSync(fd, salt, 0, SALT_LENGTH, 5);
    fs.readSync(fd, iv, 0, IV_LENGTH, 5 + SALT_LENGTH);

    // El Auth Tag está al final del archivo
    const stats = fs.fstatSync(fd);
    const authTag = Buffer.alloc(AUTH_TAG_LENGTH);
    fs.readSync(fd, authTag, 0, AUTH_TAG_LENGTH, stats.size - AUTH_TAG_LENGTH);
    fs.closeSync(fd);

    // 2. Preparar el descifrado
    const key = crypto.scryptSync(password, salt, 32, SCRYPT_PARAMS);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    decryptedZipPath = path.join(TEMP_DIR, `restore-stage-${Date.now()}.zip`);
    const zipWriter = fs.createWriteStream(decryptedZipPath);
    
    // Leer el contenido cifrado (Saltando cabecera y excluyendo AuthTag del final)
    const encryptedStream = fs.createReadStream(backupFile, {
        start: 5 + SALT_LENGTH + IV_LENGTH,
        end: stats.size - AUTH_TAG_LENGTH - 1
    });

    await new Promise((resolve, reject) => {
        encryptedStream.pipe(decipher).pipe(zipWriter)
            .on('finish', resolve)
            .on('error', (err) => {
                reject(new Error('Contraseña incorrecta o archivo dañado'));
            });
    });

    logger.info('Descifrado completado, iniciando extracción y reemplazo...');

    // 3. Extraer ZIP descifrado
    extractPath = path.join(TEMP_DIR, `restore-data-${Date.now()}`);
    await extract(decryptedZipPath, { dir: path.resolve(extractPath) });

    // 4. Restaurar Uploads
    const backupUploads = path.join(extractPath, 'uploads');
    if (fs.existsSync(backupUploads)) {
        if (fs.existsSync(UPLOADS_DIR)) {
            // En Windows, fs.remove puede fallar si hay handles abiertos, usamos una técnica de reintento
            try {
                await fs.remove(UPLOADS_DIR);
            } catch (e) {
                logger.warn('Fallo parcial al borrar uploads, intentando sobrescribir...');
            }
        }
        await fs.ensureDir(UPLOADS_DIR);
        await fs.copy(backupUploads, UPLOADS_DIR, { overwrite: true });
    }

    // 5. Hot Swap de Base de Datos
    const restoredDbPath = path.join(extractPath, 'dev.db');
    if (!fs.existsSync(restoredDbPath)) {
        throw new Error('Base de datos no encontrada en el paquete de backup');
    }

    // Desconectar Prisma con Gracia
    await prisma.$disconnect();
    await new Promise(r => setTimeout(r, 1500)); // Esperar liberación de locks en Windows

    try {
        await fs.copy(restoredDbPath, DB_PATH, { overwrite: true });
        logger.info('Base de datos restaurada exitosamente.');
    } catch (dbError) {
        logger.error({ dbError }, 'Error crítico reemplazando DB. Posible bloqueo de archivo.');
        throw new Error('No se pudo reemplazar la base de datos. Asegúrese de que no haya otros procesos accediendo a ella.');
    } finally {
        // Siempre intentar reconectar Prisma
        await prisma.$connect().catch(() => {});
    }

    // 6. Limpieza final
    try {
        if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
        if (fs.existsSync(decryptedZipPath)) fs.unlinkSync(decryptedZipPath);
        if (fs.existsSync(extractPath)) fs.rmSync(extractPath, { recursive: true, force: true });
    } catch (e) {}

    res.json({ success: true, message: 'Sistema restaurado correctamente. La aplicación se recargará.' });

  } catch (error) {
    logger.error({ error: error.message }, 'Fallo en restauración');
    res.status(500).json({ error: error.message });
    
    // Limpieza en error
    try {
        if (backupFile && fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
        if (decryptedZipPath && fs.existsSync(decryptedZipPath)) fs.unlinkSync(decryptedZipPath);
        if (extractPath && fs.existsSync(extractPath)) fs.rmSync(extractPath, { recursive: true, force: true });
    } catch (e) {}
  }
});

module.exports = router;
