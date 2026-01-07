const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const { UPLOADS_DIR } = require('../utils/paths');
const { logger } = require('../utils/logger');
const prisma = require('../prismaClient');

/**
 * Servicio de Generación de Documentos Oficiales
 * Genera PDFs para constancias, cartas, certificados, etc.
 */

/**
 * Configuración de estilos de documento
 */
const STYLES = {
  title: { fontSize: 18, font: 'Helvetica-Bold' },
  subtitle: { fontSize: 14, font: 'Helvetica-Bold' },
  body: { fontSize: 12, font: 'Helvetica' },
  small: { fontSize: 10, font: 'Helvetica' },
  margin: { top: 50, left: 50, right: 50, bottom: 50 }
};

/**
 * Genera encabezado institucional
 */
const generarEncabezado = async (doc, institucion) => {
  const { margin } = STYLES;
  
  // Logo institucional (si existe)
  if (institucion.logo_path) {
    const logoPath = path.join(UPLOADS_DIR, 'logos', institucion.logo_path);
    if (await fs.pathExists(logoPath)) {
      doc.image(logoPath, margin.left, margin.top, { width: 60 });
    }
  }
  
  // Nombre de la institución
  doc.font(STYLES.title.font)
     .fontSize(STYLES.title.fontSize)
     .text(institucion.nombre, margin.left + 80, margin.top, {
       width: doc.page.width - margin.left - margin.right - 80,
       align: 'center'
     });
  
  // Dirección y contacto
  if (institucion.direccion || institucion.telefono) {
    doc.font(STYLES.small.font)
       .fontSize(STYLES.small.fontSize)
       .moveDown(0.5);
    
    if (institucion.direccion) {
      doc.text(institucion.direccion, { align: 'center' });
    }
    if (institucion.telefono) {
      doc.text(`Tel: ${institucion.telefono}`, { align: 'center' });
    }
  }
  
  doc.moveDown(2);
  return doc.y;
};

/**
 * Genera pie de página
 */
const generarPieDePagina = (doc, numeroPagina = 1) => {
  const { margin } = STYLES;
  const bottomY = doc.page.height - margin.bottom;
  
  doc.font(STYLES.small.font)
     .fontSize(STYLES.small.fontSize)
     .text(
       `Página ${numeroPagina}`,
       margin.left,
       bottomY,
       { align: 'center', width: doc.page.width - margin.left - margin.right }
     );
  
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-ES')}`,
    margin.left,
    bottomY + 15,
    { align: 'center', width: doc.page.width - margin.left - margin.right }
  );
};

/**
 * Genera Constancia de Inscripción
 */
const generarConstanciaInscripcion = async (alumnoId) => {
  try {
    // Obtener datos
    const alumno = await prisma.alumno.findUnique({ where: { id: alumnoId } });
    const institucion = await prisma.institucion.findFirst();
    
    if (!alumno || !institucion) {
      throw new Error('Alumno o institución no encontrados');
    }
    
    // Crear documento
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const filename = `constancia_inscripcion_${alumno.carnet}_${Date.now()}.pdf`;
    const filepath = path.join(UPLOADS_DIR, 'documentos', filename);
    
    await fs.ensureDir(path.join(UPLOADS_DIR, 'documentos'));
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Encabezado
    await generarEncabezado(doc, institucion);
    
    // Título del documento
    doc.font(STYLES.subtitle.font)
       .fontSize(STYLES.subtitle.fontSize)
       .text('CONSTANCIA DE INSCRIPCIÓN', { align: 'center', underline: true })
       .moveDown(2);
    
    // Cuerpo
    doc.font(STYLES.body.font)
       .fontSize(STYLES.body.fontSize);
    
    const textoConstancia = `Por medio de la presente, se hace constar que el/la estudiante ${alumno.nombres} ${alumno.apellidos}, identificado/a con carnet No. ${alumno.carnet}, se encuentra debidamente inscrito/a en esta institución educativa para el año escolar en curso.

El/la estudiante cursa actualmente el grado: ${alumno.grado}${alumno.carrera ? `, en la carrera de ${alumno.carrera}` : ''}.

Estado del estudiante: ${alumno.estado.toUpperCase()}
${alumno.anio_ingreso ? `Año de ingreso: ${alumno.anio_ingreso}` : ''}

Se extiende la presente constancia a solicitud del interesado/a para los fines que estime conveniente.`;
    
    doc.text(textoConstancia, { align: 'justify', lineGap: 5 });
    
    // Fecha y firma
    doc.moveDown(3);
    doc.text(`Dado en ${institucion.municipio || '[Ciudad]'}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleDateString('es-ES', { month: 'long' })} de ${new Date().getFullYear()}.`, {
      align: 'center'
    });
    
    doc.moveDown(4);
    doc.text('_______________________________', { align: 'center' });
    doc.text('Firma y Sello', { align: 'center' });
    doc.text('Director/a', { align: 'center' });
    
    // Pie de página
    generarPieDePagina(doc);
    
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        logger.info({ alumnoId, filepath }, 'Constancia de inscripción generada');
        resolve({ filepath, filename, url: `/uploads/documentos/${filename}` });
      });
      stream.on('error', reject);
    });
    
  } catch (error) {
    logger.error({ err: error, alumnoId }, 'Error generando constancia de inscripción');
    throw error;
  }
};

/**
 * Genera Carta de Buena Conducta
 */
const generarCartaBuenaConducta = async (alumnoId, periodo = null) => {
  try {
    const alumno = await prisma.alumno.findUnique({ where: { id: alumnoId } });
    const institucion = await prisma.institucion.findFirst();
    
    if (!alumno || !institucion) {
      throw new Error('Alumno o institución no encontrados');
    }
    
    // Calcular asistencias (últimos 30 días o período especificado)
    const fechaInicio = periodo?.inicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fechaFin = periodo?.fin || new Date();
    
    const asistencias = await prisma.asistencia.count({
      where: {
        alumno_id: alumnoId,
        timestamp: { gte: fechaInicio, lte: fechaFin }
      }
    });
    
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const filename = `carta_conducta_${alumno.carnet}_${Date.now()}.pdf`;
    const filepath = path.join(UPLOADS_DIR, 'documentos', filename);
    
    await fs.ensureDir(path.join(UPLOADS_DIR, 'documentos'));
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    await generarEncabezado(doc, institucion);
    
    doc.font(STYLES.subtitle.font)
       .fontSize(STYLES.subtitle.fontSize)
       .text('CARTA DE BUENA CONDUCTA', { align: 'center', underline: true })
       .moveDown(2);
    
    doc.font(STYLES.body.font)
       .fontSize(STYLES.body.fontSize);
    
    const textoCarta = `Por medio de la presente, hacemos constar que el/la estudiante ${alumno.nombres} ${alumno.apellidos}, identificado/a con carnet No. ${alumno.carnet}, quien cursa el grado ${alumno.grado}${alumno.carrera ? ` en la carrera de ${alumno.carrera}` : ''}, ha demostrado durante su permanencia en esta institución educativa:

• EXCELENTE COMPORTAMIENTO en el aula y en todas las actividades institucionales
• RESPETO hacia sus compañeros, docentes y personal administrativo
• CUMPLIMIENTO de las normas y reglamentos institucionales
• ASISTENCIA REGULAR a clases (${asistencias} registros de asistencia en el período evaluado)
• ACTITUD POSITIVA y colaborativa en el ambiente escolar

Durante el tiempo que ha permanecido en nuestra institución, no se ha registrado ninguna falta disciplinaria grave que amerite sanción.

Se extiende la presente carta a solicitud del interesado/a, para los fines que estime conveniente.`;
    
    doc.text(textoCarta, { align: 'justify', lineGap: 5 });
    
    doc.moveDown(3);
    doc.text(`Dado en ${institucion.municipio || '[Ciudad]'}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleDateString('es-ES', { month: 'long' })} de ${new Date().getFullYear()}.`, {
      align: 'center'
    });
    
    doc.moveDown(4);
    doc.text('_______________________________', { align: 'center' });
    doc.text('Firma y Sello', { align: 'center' });
    doc.text('Director/a', { align: 'center' });
    
    generarPieDePagina(doc);
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        logger.info({ alumnoId, filepath }, 'Carta de buena conducta generada');
        resolve({ filepath, filename, url: `/uploads/documentos/${filename}` });
      });
      stream.on('error', reject);
    });
    
  } catch (error) {
    logger.error({ err: error, alumnoId }, 'Error generando carta de buena conducta');
    throw error;
  }
};

/**
 * Genera Certificado de Estudios
 */
const generarCertificadoEstudios = async (alumnoId) => {
  try {
    const alumno = await prisma.alumno.findUnique({
      where: { id: alumnoId },
      include: { historial: { orderBy: { anio_escolar: 'asc' } } }
    });
    const institucion = await prisma.institucion.findFirst();
    
    if (!alumno || !institucion) {
      throw new Error('Alumno o institución no encontrados');
    }
    
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const filename = `certificado_estudios_${alumno.carnet}_${Date.now()}.pdf`;
    const filepath = path.join(UPLOADS_DIR, 'documentos', filename);
    
    await fs.ensureDir(path.join(UPLOADS_DIR, 'documentos'));
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    await generarEncabezado(doc, institucion);
    
    doc.font(STYLES.subtitle.font)
       .fontSize(STYLES.subtitle.fontSize)
       .text('CERTIFICADO DE ESTUDIOS', { align: 'center', underline: true })
       .moveDown(2);
    
    doc.font(STYLES.body.font)
       .fontSize(STYLES.body.fontSize);
    
    doc.text(`Se certifica que el/la estudiante ${alumno.nombres} ${alumno.apellidos}, identificado/a con carnet No. ${alumno.carnet}, ha cursado los siguientes grados en esta institución educativa:`, {
      align: 'justify'
    });
    
    doc.moveDown(1);
    
    // Historial académico
    if (alumno.historial && alumno.historial.length > 0) {
      doc.font(STYLES.subtitle.font).fontSize(12).text('Historial Académico:', { underline: true });
      doc.moveDown(0.5);
      
      alumno.historial.forEach((registro) => {
        doc.font(STYLES.body.font).fontSize(STYLES.body.fontSize);
        doc.text(`• Año ${registro.anio_escolar}: ${registro.grado_cursado} - ${registro.promovido ? 'APROBADO' : 'REPROBADO'}${registro.carrera ? ` (${registro.carrera})` : ''}`);
      });
    } else {
      doc.text('(Sin historial académico registrado)');
    }
    
    doc.moveDown(1);
    doc.text(`Grado actual: ${alumno.grado}`);
    doc.text(`Estado: ${alumno.estado.toUpperCase()}`);
    if (alumno.anio_ingreso) {
      doc.text(`Año de ingreso: ${alumno.anio_ingreso}`);
    }
    if (alumno.anio_graduacion) {
      doc.text(`Año de graduación: ${alumno.anio_graduacion}`);
    }
    
    doc.moveDown(2);
    doc.text('Se extiende el presente certificado a solicitud del interesado/a.', { align: 'justify' });
    
    doc.moveDown(2);
    doc.text(`Dado en ${institucion.municipio || '[Ciudad]'}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleDateString('es-ES', { month: 'long' })} de ${new Date().getFullYear()}.`, {
      align: 'center'
    });
    
    doc.moveDown(4);
    doc.text('_______________________________', { align: 'center' });
    doc.text('Firma y Sello', { align: 'center' });
    doc.text('Director/a', { align: 'center' });
    
    generarPieDePagina(doc);
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        logger.info({ alumnoId, filepath }, 'Certificado de estudios generado');
        resolve({ filepath, filename, url: `/uploads/documentos/${filename}` });
      });
      stream.on('error', reject);
    });
    
  } catch (error) {
    logger.error({ err: error, alumnoId }, 'Error generando certificado de estudios');
    throw error;
  }
};

/**
 * Genera Carnet de Alumno (CR80: 1011×638px @ 300 DPI)
 */
const generarCarnetAlumno = async (alumnoId) => {
  try {
    const alumno = await prisma.alumno.findUnique({ 
      where: { id: alumnoId },
      include: { codigos_qr: { where: { vigente: true }, take: 1 } }
    });
    const institucion = await prisma.institucion.findFirst();
    
    if (!alumno || !institucion) {
      throw new Error('Alumno o institución no encontrados');
    }

    // Dimensiones CR80 estándar
    const WIDTH = 1011;
    const HEIGHT = 638;
    
    // Crear canvas base
    const canvas = sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    });

    const composites = [];

    // 1. Fondo degradado (azul institucional)
    const gradient = Buffer.from(
      `<svg width="${WIDTH}" height="${HEIGHT}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)" />
      </svg>`
    );
    composites.push({ input: gradient, top: 0, left: 0 });

    // 2. Logo institucional (top-center)
    if (institucion.logo_path) {
      const logoPath = path.join(UPLOADS_DIR, institucion.logo_path);
      if (await fs.pathExists(logoPath)) {
        const logoResized = await sharp(logoPath)
          .resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer();
        composites.push({ input: logoResized, top: 30, left: Math.floor((WIDTH - 150) / 2) });
      }
    }

    // 3. Foto del alumno (izquierda)
    let photoX = 80;
    let photoY = 220;
    if (alumno.foto_path) {
      const fotoPath = path.join(UPLOADS_DIR, alumno.foto_path);
      if (await fs.pathExists(fotoPath)) {
        const fotoResized = await sharp(fotoPath)
          .resize(250, 300, { fit: 'cover' })
          .toBuffer();
        composites.push({ input: fotoResized, top: photoY, left: photoX });
      }
    } else {
      // Placeholder si no hay foto
      const placeholder = Buffer.from(
        `<svg width="250" height="300">
          <rect width="250" height="300" fill="#e5e7eb"/>
          <text x="125" y="150" font-size="60" text-anchor="middle" fill="#9ca3af">👤</text>
        </svg>`
      );
      composites.push({ input: placeholder, top: photoY, left: photoX });
    }

    // 4. QR Code (derecha-abajo)
    if (alumno.codigos_qr && alumno.codigos_qr.length > 0 && alumno.codigos_qr[0].png_path) {
      const qrPath = path.join(UPLOADS_DIR, alumno.codigos_qr[0].png_path);
      if (await fs.pathExists(qrPath)) {
        const qrResized = await sharp(qrPath)
          .resize(180, 180)
          .toBuffer();
        composites.push({ input: qrResized, top: HEIGHT - 200, left: WIDTH - 200 });
      }
    }

    // 5. Texto overlay
    const textSVG = Buffer.from(
      `<svg width="${WIDTH}" height="${HEIGHT}">
        <style>
          .title { fill: white; font-family: Arial, sans-serif; font-weight: bold; }
          .subtitle { fill: #f3f4f6; font-family: Arial, sans-serif; }
        </style>
        <text x="${WIDTH/2}" y="210" class="title" font-size="32" text-anchor="middle">${alumno.nombres} ${alumno.apellidos}</text>
        <text x="380" y="270" class="subtitle" font-size="24">Carnet: ${alumno.carnet}</text>
        <text x="380" y="310" class="subtitle" font-size="22">Grado: ${alumno.grado}</text>
        ${alumno.carrera ? `<text x="380" y="350" class="subtitle" font-size="20">${alumno.carrera}</text>` : ''}
        <text x="380" y="${alumno.carrera ? 390 : 350}" class="subtitle" font-size="18">Vigente ${new Date().getFullYear()}</text>
        <text x="${WIDTH/2}" y="${HEIGHT - 20}" class="subtitle" font-size="16" text-anchor="middle">${institucion.nombre}</text>
      </svg>`
    );
    composites.push({ input: textSVG, top: 0, left: 0 });

    // Generar imagen final
    const filename = `carnet_alumno_${alumno.carnet}_${Date.now()}.png`;
    const filepath = path.join(UPLOADS_DIR, 'carnets', filename);
    await fs.ensureDir(path.join(UPLOADS_DIR, 'carnets'));

    await canvas
      .composite(composites)
      .png({ quality: 100 })
      .toFile(filepath);

    logger.info({ alumnoId, filepath }, 'Carnet de alumno generado');
    return { filepath, filename, url: `/uploads/carnets/${filename}` };

  } catch (error) {
    logger.error({ err: error, alumnoId }, 'Error generando carnet de alumno');
    throw error;
  }
};

/**
 * Genera Carnet de Personal (CR80: 1011×638px @ 300 DPI)
 */
const generarCarnetPersonal = async (personalId) => {
  try {
    const personal = await prisma.personal.findUnique({ 
      where: { id: personalId },
      include: { codigos_qr: { where: { vigente: true }, take: 1 } }
    });
    const institucion = await prisma.institucion.findFirst();
    
    if (!personal || !institucion) {
      throw new Error('Personal o institución no encontrados');
    }

    const WIDTH = 1011;
    const HEIGHT = 638;
    
    const canvas = sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    });

    const composites = [];

    // Fondo degradado (verde para personal)
    const gradient = Buffer.from(
      `<svg width="${WIDTH}" height="${HEIGHT}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#065f46;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)" />
      </svg>`
    );
    composites.push({ input: gradient, top: 0, left: 0 });

    // Logo
    if (institucion.logo_path) {
      const logoPath = path.join(UPLOADS_DIR, institucion.logo_path);
      if (await fs.pathExists(logoPath)) {
        const logoResized = await sharp(logoPath)
          .resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer();
        composites.push({ input: logoResized, top: 30, left: Math.floor((WIDTH - 150) / 2) });
      }
    }

    // Foto
    let photoX = 80;
    let photoY = 220;
    if (personal.foto_path) {
      const fotoPath = path.join(UPLOADS_DIR, personal.foto_path);
      if (await fs.pathExists(fotoPath)) {
        const fotoResized = await sharp(fotoPath)
          .resize(250, 300, { fit: 'cover' })
          .toBuffer();
        composites.push({ input: fotoResized, top: photoY, left: photoX });
      }
    } else {
      const placeholder = Buffer.from(
        `<svg width="250" height="300">
          <rect width="250" height="300" fill="#e5e7eb"/>
          <text x="125" y="150" font-size="60" text-anchor="middle" fill="#9ca3af">👤</text>
        </svg>`
      );
      composites.push({ input: placeholder, top: photoY, left: photoX });
    }

    // QR Code
    if (personal.codigos_qr && personal.codigos_qr.length > 0 && personal.codigos_qr[0].png_path) {
      const qrPath = path.join(UPLOADS_DIR, personal.codigos_qr[0].png_path);
      if (await fs.pathExists(qrPath)) {
        const qrResized = await sharp(qrPath)
          .resize(180, 180)
          .toBuffer();
        composites.push({ input: qrResized, top: HEIGHT - 200, left: WIDTH - 200 });
      }
    }

    // Texto
    const textSVG = Buffer.from(
      `<svg width="${WIDTH}" height="${HEIGHT}">
        <style>
          .title { fill: white; font-family: Arial, sans-serif; font-weight: bold; }
          .subtitle { fill: #f3f4f6; font-family: Arial, sans-serif; }
        </style>
        <text x="${WIDTH/2}" y="210" class="title" font-size="32" text-anchor="middle">${personal.nombres} ${personal.apellidos}</text>
        <text x="380" y="270" class="subtitle" font-size="24">ID: ${personal.carnet}</text>
        <text x="380" y="310" class="subtitle" font-size="22">${personal.cargo || 'Personal'}</text>
        <text x="380" y="350" class="subtitle" font-size="20">${personal.jornada || ''}</text>
        <text x="380" y="390" class="subtitle" font-size="18">Vigente ${new Date().getFullYear()}</text>
        <text x="${WIDTH/2}" y="${HEIGHT - 20}" class="subtitle" font-size="16" text-anchor="middle">${institucion.nombre}</text>
      </svg>`
    );
    composites.push({ input: textSVG, top: 0, left: 0 });

    const filename = `carnet_personal_${personal.carnet}_${Date.now()}.png`;
    const filepath = path.join(UPLOADS_DIR, 'carnets', filename);
    await fs.ensureDir(path.join(UPLOADS_DIR, 'carnets'));

    await canvas
      .composite(composites)
      .png({ quality: 100 })
      .toFile(filepath);

    logger.info({ personalId, filepath }, 'Carnet de personal generado');
    return { filepath, filename, url: `/uploads/carnets/${filename}` };

  } catch (error) {
    logger.error({ err: error, personalId }, 'Error generando carnet de personal');
    throw error;
  }
};

module.exports = {
  generarConstanciaInscripcion,
  generarCartaBuenaConducta,
  generarCertificadoEstudios,
  generarCarnetAlumno,
  generarCarnetPersonal
};
