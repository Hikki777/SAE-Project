const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');
const axios = require('axios');
const fs = require('fs-extra');
const { logger } = require('../utils/logger');
const { UPLOADS_DIR } = require('../utils/paths');
const imageService = require('./imageService');
const prisma = require('../prismaClient');
const tokenService = require('./tokenService');

const QRS_DIR = path.join(UPLOADS_DIR, 'qrs');
const LOGOS_DIR = path.join(UPLOADS_DIR, 'logos');

// Función auxiliar para obtener buffer de imagen (Base64, URL o Archivo)
async function obtenerImagenBuffer(fuente) {
  if (!fuente) return null;

  try {
    // 1. Base64
    if (fuente.startsWith('data:') || fuente.length > 2000) { // Asumimos base64 largo
      const base64Data = fuente.includes('base64,') ? fuente.split('base64,')[1] : fuente;
      return Buffer.from(base64Data, 'base64');
    }
    
    // 2. URL (Web/Local)
    if (fuente.startsWith('http')) {
      const response = await axios.get(fuente, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    }

    // 3. Archivo Local
    const rutaLocal = path.isAbsolute(fuente) ? fuente : path.join(UPLOADS_DIR, fuente);
    if (await fs.pathExists(rutaLocal)) {
      return await fs.readFile(rutaLocal);
    }
    return null;
  } catch (error) {
    logger.error({ err: error, fuente }, 'Error obteniendo buffer de imagen');
    return null;
  }
}

/**
 * Crear buffer SVG con texto (carnet)
 * Usado para texto debajo del QR
 */
async function crearTextoCarnet(carnet, width = 600) {
  const textSize = Math.max(24, Math.floor(width / 20));
  const padding = 2; // Relleno mínimo
  const height = textSize + padding * 2;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="white"/>
      <text 
        x="${width / 2}" 
        y="${height / 2 + textSize / 3}" 
        font-family="Arial, sans-serif" 
        font-size="${textSize}" 
        font-weight="bold"
        text-anchor="middle" 
        fill="black"
      >
        ${carnet || 'Carnet'}
      </text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

/**
 * Generar QR con logo centrado y carnet debajo
 * @param {string} token - Token para el QR
 * @param {string} logoFuente - Logo (Base64, URL o ruta)
 * @param {string} filename - Nombre del archivo
 * @param {string} carnet - Número de carnet a mostrar debajo
 * @param {number} size - Tamaño del QR (default 600)
 */
async function generarQrConLogo(token, logoFuente, filename, carnet = '', size = 600) {
  try {
    console.log(`[QR-DEBUG] Iniciando para carnet: ${carnet}, token: ${token}`);
    
    // 1. Generar QR como SVG
    console.log('[QR-DEBUG] Generando SVG...');
    const qrSvg = await QRCode.toString(token, {
      errorCorrectionLevel: 'H',
      type: 'svg',
      width: size,
      margin: 1
    });
    console.log('[QR-DEBUG] SVG generado (longitud):', qrSvg.length);
    
    // Convertir SVG a Buffer PNG usando Sharp
    console.log('[QR-DEBUG] Convirtiendo SVG a Buffer PNG con Sharp...');
    const qrBuffer = await sharp(Buffer.from(qrSvg))
      .png()
      .toBuffer();
    console.log('[QR-DEBUG] Buffer PNG generado (size):', qrBuffer.length);
      
    console.log('[QR-DEBUG] Obteniendo logo...');
    const logoBuffer = await obtenerImagenBuffer(logoFuente);
    console.log('[QR-DEBUG] Logo buffer:', logoBuffer ? 'SI' : 'NO');
    
    let qrFinal = qrBuffer;

    // 2. Agregar logo si existe
    if (logoBuffer) {
      try {
        const logoSize = Math.round(size * 0.20);
        
        // Pre-procesar logo para asegurar que no sea gigante
        const logoResized = await sharp(logoBuffer)
          .resize(logoSize, logoSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 } // Fondo blanco sólido para que resalte
          })
          .toBuffer();

        qrFinal = await sharp(qrBuffer)
          .composite([
            {
              input: logoResized,
              gravity: 'center'
            }
          ])
          .png()
          .toBuffer();
        console.log('[QR-DEBUG] Logo compuesto OK');
      } catch (sharpError) {
        console.error('[QR-DEBUG] Error Sharp Logo:', sharpError.message);
        // Fallback al QR básico si el logo falla
      }
    }

    let finalBuffer = qrFinal;
    if (carnet && carnet.trim()) {
      console.log('[QR-DEBUG] Agregando carnet debajo...');
      const carnetText = await crearTextoCarnet(carnet.toUpperCase(), size);
      
      finalBuffer = await sharp(qrFinal)
        .extend({
          bottom: 50, // El alto del texto ahora es menor (~35-40px)
          background: { r: 255, g: 255, b: 255 }
        })
        .composite([
          {
            input: carnetText,
            top: size, // Pegado al ras del QR
            left: 0
          }
        ])
        .png()
        .toBuffer();
      console.log('[QR-DEBUG] Carnet agregado OK');
    }

    // 4. Subir imagen
    const publicId = path.parse(filename).name;
    const result = await imageService.uploadBuffer(finalBuffer, 'qrs', publicId);

    logger.debug({ url: result.secure_url, carnet }, '[OK] QR generado con carnet');
    return result.secure_url;
  } catch (error) {
    logger.error({ err: error, filename, carnet }, '[ERROR] Error generando QR con carnet');
    throw error;
  }
}

/**
 * Generar QR automáticamente para una persona (Alumno/Personal)
 * Esta función es llamada desde los controladores al crear registros.
 */
async function generarQrParaPersona(tipo, id) {
  try {
    // 1. Obtener Institución y Logo
    const institucion = await prisma.institucion.findFirst();
    const logoFuente = institucion?.logo_path || institucion?.logo_base64;

    // 2. Obtener Persona
    let persona;
    if (tipo === 'alumno') {
      persona = await prisma.alumno.findUnique({ where: { id } });
    } else {
      persona = await prisma.personal.findUnique({ where: { id } });
    }

    if (!persona) throw new Error(`${tipo} no encontrado`);

    // 3. Verificar/Crear Registro CodigoQr
    let codigoQr = await prisma.codigoQr.findFirst({
        where: {
            persona_tipo: tipo,
            ...(tipo === 'alumno' ? { alumno_id: id } : { personal_id: id })
        }
    });

    if (!codigoQr) {
        // CAMBIO: Usar JSON simple en lugar de token encriptado
        // const token = tokenService.generarToken(tipo, id);
        
        const tokenData = {
          tipo: tipo, // Usar el tipo real: 'alumno' o 'personal'
          id: id,
          carnet: persona.carnet
        };
        const token = JSON.stringify(tokenData);

        codigoQr = await prisma.codigoQr.create({
            data: {
                persona_tipo: tipo,
                token,
                vigente: true,
                ...(tipo === 'alumno' ? { alumno_id: id } : { personal_id: id })
            }
        });
    }

    // 4. Generar Imagen QR con carnet incluido
    const filename = `${tipo}-${persona.carnet.replace(/\s+/g, '_')}.png`;
    const qrUrl = await generarQrConLogo(codigoQr.token, logoFuente, filename, persona.carnet);

    if (qrUrl) {
        await prisma.codigoQr.update({
            where: { id: codigoQr.id },
            data: { png_path: qrUrl, generado_en: new Date() }
        });
    }

    // 5. Devolver URL
    return qrUrl;

  } catch (error) {
    logger.error({ err: error, tipo, id }, '[ERROR] Error en generarQrParaPersona');
    return null; // En este caso sí devolvemos null para no romper el flujo principal de creación
  }
}

/**
 * Regenerar un código QR existente
 */
async function regenerarQr(qrId) {
  try {
    const codigoQr = await prisma.codigoQr.findUnique({
      where: { id: parseInt(qrId) },
      include: {
        alumno: true,
        personal: true
      }
    });

    if (!codigoQr) throw new Error('Código QR no encontrado');

    const persona = codigoQr.alumno || codigoQr.personal;
    if (!persona) throw new Error('Persona asociada no encontrada');

    // Obtener Institución y Logo
    const institucion = await prisma.institucion.findFirst();
    const logoFuente = institucion?.logo_path || institucion?.logo_base64;

    const filename = `${codigoQr.persona_tipo}-${persona.carnet.replace(/\s+/g, '_')}.png`;
    const qrUrl = await generarQrConLogo(codigoQr.token, logoFuente, filename, persona.carnet);

    if (qrUrl) {
      await prisma.codigoQr.update({
        where: { id: codigoQr.id },
        data: { png_path: qrUrl, generado_en: new Date() }
      });
    }

    return qrUrl;
  } catch (error) {
    logger.error({ err: error, qrId }, '[ERROR] Error en regenerarQr');
    throw error;
  }
}

/**
 * Generar ruta/nombre de archivo para QR
 */
function obtenerNombreQr(personaTipo, carnet) {
  return `${personaTipo}-${carnet.replace(/\s+/g, '_')}.png`;
}

function obtenerRutasQr(personaTipo, carnet) {
  const filename = obtenerNombreQr(personaTipo, carnet);
  const relativePath = `qrs/${filename}`;
  const absolutePath = path.join(QRS_DIR, filename);
  return { relativePath, absolutePath, filename };
}

/**
 * Guardar logo institucional (Base64 → Almacenamiento)
 */
async function guardarLogo(base64Data, filename = 'logo.png') {
  try {
    const buffer = await obtenerImagenBuffer(base64Data);
    if (!buffer) throw new Error('No se pudo procesar el logo base64');

    const publicId = path.parse(filename).name;
    // Subir a carpeta 'logos'
    const result = await imageService.uploadBuffer(buffer, 'logos', publicId);
    
    logger.info({ url: result.secure_url }, '[OK] Logo subido');
    return result.secure_url;
  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error guardando logo');
    return null;
  }
}

module.exports = {
  generarQrConLogo,
  crearTextoCarnet,
  generarQrParaPersona,
  regenerarQr,
  obtenerRutasQr,
  guardarLogo
};
