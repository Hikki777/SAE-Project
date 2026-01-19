import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

/**
 * Cargar imagen desde URL y convertir a Base64
 */
const loadImageBase64 = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      console.warn('No se pudo cargar el logo:', src);
      resolve(null);
    };
  });
};

export const generatePDF = async (data) => {
  const { asistencias, ausentes = [], institucion, stats, filtrosGenerated } = data;
  const doc = new jsPDF();

  // 1. Logo Institucional (Izquierda)
  let logoInstitucionalMain = null;
  if (institucion?.logo_base64) {
    logoInstitucionalMain = institucion.logo_base64;
  }

  // 2. Logo SAE (App)
  let logoApp = null;
  try {
    // Usar ruta absoluta basada en el origen actual para evitar problemas de paths relativos
    const appLogoUrl = `${window.location.origin}/logo.png`;
    logoApp = await loadImageBase64(appLogoUrl);
  } catch (error) {
    console.warn('Error loading app logo', error);
  }

  // Lógica de renderizado de logos
  // Si hay logo institucional, va a la izquierda (15, 15)
  // Si NO hay logo institucional, el logo de la App va a la izquierda como fallback
  // Si HAY logo institucional, el logo de la App va a la derecha (170, 15)
  
  // LOGICA DE LOGOS
  
  // 1. Logo del Sistema (Siempre a la derecha)
  try {
    const imgApp = new Image();
    imgApp.src = `${window.location.origin}/logo.png`;
    doc.addImage(imgApp, 'PNG', 170, 15, 25, 25);
  } catch (e) {
    console.error('Error cargando logo sistema:', e);
  }

  // 2. Logo Institucional (A la izquierda)
  if (institucion?.logo_base64) {
    try {
        let logoData = institucion.logo_base64;
        // Intentar arreglar base64 si viene sin header
        if (!logoData.startsWith('data:image')) {
            logoData = `data:image/png;base64,${logoData}`;
        }
        doc.addImage(logoData, 'PNG', 15, 15, 25, 25);
    } catch (e) {
        console.error('Error cargando logo institucional:', e);
        // Si falla, podríamos poner un placeholder o dejar vacío
        // Para no duplicar el logo del sistema, mejor dejar vacío si el usuario quiere esta estructura rígida
    }
  }

  // Encabezado (Centrado)
  doc.setFontSize(16);
  doc.setTextColor(31, 71, 136); // #1F4788
  doc.text(institucion?.nombre || 'Instituto Educativo', 105, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(0);
  
  // Línea 1: Dirección y Teléfono
  const infoLine1 = [];
  if (institucion?.direccion) infoLine1.push(institucion.direccion);
  if (institucion?.telefono) infoLine1.push(`Tel: ${institucion.telefono}`);
  doc.text(infoLine1.join(' | '), 105, 30, { align: 'center' });

  // Línea 2: Email y País (Nuevo requerimiento)
  const infoLine2 = [];
  if (institucion?.email) infoLine2.push(institucion.email);
  
  // Construcción limpia de ubicación
  const ubicacionParts = [institucion?.municipio, institucion?.departamento].filter(Boolean);
  if (ubicacionParts.length > 0) {
    infoLine2.push(ubicacionParts.join(', '));
  }
  
  if (institucion?.pais) infoLine2.push(institucion.pais);
  
  if (infoLine2.length > 0) {
    doc.text(infoLine2.join(' | '), 105, 36, { align: 'center' });
  }

  // Título del Reporte
  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text('REPORTE DE ASISTENCIAS', 105, 50, { align: 'center' });
  doc.setDrawColor(200);
  doc.line(15, 55, 195, 55);

  // Filtros
  doc.setFontSize(9);
  const filterParts = [];
  
  // Función helper para formatear YYYY-MM-DD a DD/MM/YYYY sin timezone shift
  const formatDateStr = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  if (filtrosGenerated.fechaInicio) filterParts.push(`Desde: ${formatDateStr(filtrosGenerated.fechaInicio)}`);
  if (filtrosGenerated.fechaFin) filterParts.push(`Hasta: ${formatDateStr(filtrosGenerated.fechaFin)}`);
  if (filterParts.length === 0) filterParts.push(`Fecha: ${new Date().toLocaleDateString()}`);
  
  doc.text(filterParts.join(' • '), 105, 62, { align: 'center' });

  // Estadísticas (Línea separada)
  const puntuales = Math.max(0, (stats.entradas || 0) - (stats.tardes || 0));
  const statsStr = `Total: ${stats.total} | Entradas: ${stats.entradas} (Puntuales: ${puntuales}, Tardes: ${stats.tardes}) | Salidas: ${stats.salidas} | Ausentes: ${ausentes.length}`;
  
  doc.setFontSize(9);
  doc.text(statsStr, 105, 69, { align: 'center' });

  // Tabla - Combinar asistencias y ausentes
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-';
  
  const tableData = asistencias.map(a => {
    const persona = a.alumno || a.personal;
    
    // Formatear Fecha y Hora
    const dateObj = new Date(a.timestamp);
    const fecha = dateObj.toLocaleDateString();
    const hora = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Lógica Tipo + Grado/Cargo (Con salto de línea para reporte)
    const esAlumno = !!a.alumno;
    const tipoStr = esAlumno ? 'Alumno' : 'Personal';
    const gradoCargo = esAlumno ? (persona?.grado || '') : (persona?.cargo || '');
    let gradoCargoFull = `${tipoStr}`;
    if (gradoCargo) {
      gradoCargoFull += `\n${gradoCargo}`;
    }

    // Sección y Jornada
    const seccion = (a.alumno && persona?.seccion) ? persona.seccion : '-';
    // Fallback agresivo para jornada
    const jornadaRaw = persona?.jornada || 'Matutina'; // Asumir Matutina si falta (común en legacy data)
    const jornada = capitalize(jornadaRaw);

    return {
      data: [
        fecha,
        hora,
        persona?.carnet || 'N/A',
        `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim(),
        gradoCargoFull,
        seccion,
        jornada,
        capitalize(a.tipo_evento),
        a.tipo_evento === 'salida' ? '-' : capitalize(a.estado_puntualidad)
      ],
      esAusente: false
    };
  });

  // Agregar ausentes si existen
  if (ausentes && ausentes.length > 0) {
    ausentes.forEach(ausente => {
      const esAlumno = ausente.tipo === 'alumno';
      const tipoStr = esAlumno ? 'Alumno' : 'Personal';
      const gradoCargo = esAlumno ? (ausente.grado || '') : (ausente.cargo || '');
      let gradoCargoFull = `${tipoStr}`;
      if (gradoCargo) {
        gradoCargoFull += `\n${gradoCargo}`;
      }

      const seccion = esAlumno ? (ausente.seccion || '-') : '-';
      const jornadaRaw = ausente.jornada || 'Matutina';
      const jornada = capitalize(jornadaRaw);
      
      // Usar fechaAusencia si está disponible (para rangos múltiples), sino usar fechaInicio
      const fechaAusente = ausente.fechaAusencia 
        ? formatDateStr(ausente.fechaAusencia) 
        : (filtrosGenerated.fechaInicio ? formatDateStr(filtrosGenerated.fechaInicio) : new Date().toLocaleDateString());

      tableData.push({
        data: [
          fechaAusente,
          'N/A',
          ausente.carnet || 'N/A',
          `${ausente.nombres || ''} ${ausente.apellidos || ''}`.trim(),
          gradoCargoFull,
          seccion,
          jornada,
          'N/A',
          'Ausente'
        ],
        esAusente: true
      });
    });
  }

  autoTable(doc, {
    startY: 75,
    head: [['Fecha', 'Hora', 'Carnet', 'Nombre Completo', 'Tipo / Grado', 'Sección', 'Jornada', 'Evento', 'Estado']],
    body: tableData.map(row => row.data),
    theme: 'striped',
    headStyles: { 
      fillColor: [30, 58, 138], // Azul oscuro (#1e3a8a)
      textColor: 255,
      fontSize: 8,
      halign: 'center'
    },
    styles: { 
      fontSize: 7,
      cellPadding: 2,
      halign: 'center'
    },
    columnStyles: {
      3: { halign: 'left' } // Nombre alineado a la izquierda
    },
    didDrawPage: function(data) {
       // Footer si se desea
    }
  });
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Generado por SAE - Sistema de Administración Educativa - Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
  }

  doc.save(`reporte_asistencias_${Date.now()}.pdf`);
};

export const generateExcel = async (data) => {
  const { asistencias, ausentes = [], institucion, stats, filtrosGenerated } = data;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Asistencias');

  // 1. Logo Institucional (Izquierda - Columna A)
  if (institucion?.logo_base64) {
    try {
      const imageId = workbook.addImage({
        base64: institucion.logo_base64,
        extension: 'png',
      });
      sheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 80, height: 80 }
      });
    } catch (e) {
      console.warn('Error logo institucional Excel', e);
    }
  }

  // 2. Logo SAE (Derecha - Columna H)
  try {
    const appLogoBase64 = await loadImageBase64('/logo.png');
    if (appLogoBase64) {
      const imageId = workbook.addImage({
        base64: appLogoBase64,
        extension: 'png',
      });
      // Ajustar posición a columna I (índice 8) - Borde derecho
      sheet.addImage(imageId, {
        tl: { col: 8, row: 0 }, 
        ext: { width: 80, height: 80 },
        editAs: 'absolute'
      });
    }
  } catch (e) {
    console.warn('Error logo app Excel', e);
  }

  // Configurar altura de filas de encabezado
  sheet.getRow(1).height = 20;
  sheet.getRow(2).height = 20;
  sheet.getRow(3).height = 20;
  sheet.getRow(4).height = 25;

  // Título Institución (Centrado C1:G1) - Extendido
  sheet.mergeCells('C1:G1');
  const titleCell = sheet.getCell('C1');
  titleCell.value = institucion?.nombre || 'Instituto Educativo';
  titleCell.font = { size: 16, bold: true, color: { argb: 'FF1F4788' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Dirección y Teléfono
  sheet.mergeCells('C2:G2');
  const addressCell = sheet.getCell('C2');
  const infoLine1 = [];
  if (institucion?.direccion) infoLine1.push(institucion.direccion);
  if (institucion?.telefono) infoLine1.push(`Tel: ${institucion.telefono}`);
  addressCell.value = infoLine1.join(' | ');
  addressCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Email y Ubicación
  sheet.mergeCells('C3:G3');
  const locationCell = sheet.getCell('C3');
  const infoLine2 = [];
  if (institucion?.email) infoLine2.push(institucion.email);
  const ubicacionParts = [institucion?.municipio, institucion?.departamento].filter(Boolean);
  if (ubicacionParts.length > 0) infoLine2.push(ubicacionParts.join(', '));
  if (institucion?.pais) infoLine2.push(institucion.pais);
  locationCell.value = infoLine2.join(' | ');
  locationCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Título Reporte - Extendido a I
  sheet.mergeCells('A5:I5');
  const reportCell = sheet.getCell('A5');
  reportCell.value = 'REPORTE DE ASISTENCIAS';
  reportCell.alignment = { horizontal: 'center', vertical: 'middle' };
  reportCell.font = { size: 14 };

  // Filtros (Fila 6)
  sheet.mergeCells('A6:I6');
  const statsCell = sheet.getCell('A6');
  const filterParts = [];
  
  // Helper local para fecha
  const formatDateStr = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  if (filtrosGenerated.fechaInicio) filterParts.push(`Desde: ${formatDateStr(filtrosGenerated.fechaInicio)}`);
  if (filtrosGenerated.fechaFin) filterParts.push(`Hasta: ${formatDateStr(filtrosGenerated.fechaFin)}`);
  if (filterParts.length === 0) filterParts.push(`Fecha: ${new Date().toLocaleDateString()}`);
  
  statsCell.value = filterParts.join(' • ');
  statsCell.alignment = { horizontal: 'center', vertical: 'middle' };
  statsCell.font = { size: 10, italic: true };
  sheet.getRow(6).height = 20;

  // Estadísticas (Fila 7)
  sheet.mergeCells('A7:I7');
  const statsRowCell = sheet.getCell('A7');
  const puntuales = Math.max(0, (stats.entradas || 0) - (stats.tardes || 0));
  statsRowCell.value = `Total: ${stats.total} | Entradas: ${stats.entradas} (Puntuales: ${puntuales}, Tardes: ${stats.tardes}) | Salidas: ${stats.salidas} | Ausentes: ${ausentes.length}`;
  statsRowCell.alignment = { horizontal: 'center', vertical: 'middle' };
  statsRowCell.font = { size: 10, bold: true };
  sheet.getRow(7).height = 20;

  // Estilo de borde compartido
  const thinBorder = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Headers
  const headers = ['Fecha', 'Hora', 'Carnet', 'Nombre', 'Tipo / Grado', 'Sección', 'Jornada', 'Evento', 'Estado'];
  const headerRow = sheet.getRow(8);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } }; // Size 10
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }; // Color Exacto PDF
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder; // Borde header
  });

  // Datos - Asistencias
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-';
  
  let currentRow = 9;
  asistencias.forEach((a) => {
    const persona = a.alumno || a.personal;
    const row = sheet.getRow(currentRow);
    
    // Fecha y Hora
    row.getCell(1).value = new Date(a.timestamp).toLocaleDateString();
    row.getCell(2).value = new Date(a.timestamp).toLocaleTimeString();
    
    // Identidad
    row.getCell(3).value = persona?.carnet || '';
    row.getCell(4).value = `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim();
    
    // Tipo / Grado 
    const esAlumno = !!a.alumno;
    const tipoStr = esAlumno ? 'Alumno' : 'Personal';
    const gradoCargo = esAlumno ? (persona?.grado || '') : (persona?.cargo || '');
    let gradoCargoFull = `${tipoStr}`;
    if (gradoCargo) {
        gradoCargoFull += `\n${gradoCargo}`;
    }
    row.getCell(5).value = gradoCargoFull;
    row.getCell(5).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    // Sección
    row.getCell(6).value = (esAlumno && persona?.seccion) ? persona.seccion : '-';
    row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };

    // Jornada
    const jornadaRaw = persona?.jornada || 'Matutina';
    row.getCell(7).value = capitalize(jornadaRaw);
    row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };

    // Evento
    row.getCell(8).value = a.tipo_evento === 'entrada' ? 'Entrada' : 'Salida';
    row.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Puntualidad
    row.getCell(9).value = a.tipo_evento === 'salida' ? '-' : capitalize(a.estado_puntualidad);
    row.getCell(9).alignment = { horizontal: 'center', vertical: 'middle' };

    // Aplicar bordes a toda la fila y fuente
    for(let i=1; i<=9; i++) {
        const cell = row.getCell(i);
        cell.border = thinBorder;
        
        // Zebra Striping (Filas pares: Gris claro)
        if (currentRow % 2 === 0) {
           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
        }

        // Mantener color rojo si es tarde, sino negro default
        if (i === 9 && a.estado_puntualidad === 'tarde') {
             cell.font = { size: 9, color: { argb: 'FFFF0000' } };
        } else {
             cell.font = { size: 9 };
        }
    }
    
    currentRow++;
  });

  // Agregar ausentes si existen
  if (ausentes && ausentes.length > 0) {
    const formatDateStr = (dateStr) => {
      if (!dateStr) return '';
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    };
    const fechaReporte = filtrosGenerated.fechaInicio ? formatDateStr(filtrosGenerated.fechaInicio) : new Date().toLocaleDateString();
    
    ausentes.forEach((ausente) => {
      const row = sheet.getRow(currentRow);
      
      const esAlumno = ausente.tipo === 'alumno';
      const tipoStr = esAlumno ? 'Alumno' : 'Personal';
      const gradoCargo = esAlumno ? (ausente.grado || '') : (ausente.cargo || '');
      let gradoCargoFull = `${tipoStr}`;
      if (gradoCargo) {
        gradoCargoFull += `\n${gradoCargo}`;
      }

      const seccion = esAlumno ? (ausente.seccion || '-') : '-';
      const jornadaRaw = ausente.jornada || 'Matutina';
      const jornada = capitalize(jornadaRaw);
      
      // Usar fechaAusencia si está disponible (para rangos múltiples), sino usar fechaInicio
      const fechaAusente = ausente.fechaAusencia 
        ? formatDateStr(ausente.fechaAusencia) 
        : (filtrosGenerated.fechaInicio ? formatDateStr(filtrosGenerated.fechaInicio) : new Date().toLocaleDateString());

      // Datos de ausente
      row.getCell(1).value = fechaAusente;
      row.getCell(2).value = 'N/A';
      row.getCell(3).value = ausente.carnet || 'N/A';
      row.getCell(4).value = `${ausente.nombres || ''} ${ausente.apellidos || ''}`.trim();
      row.getCell(5).value = gradoCargoFull;
      row.getCell(5).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
      row.getCell(6).value = seccion;
      row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(7).value = jornada;
      row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(8).value = 'N/A';
      row.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(9).value = 'Ausente';
      row.getCell(9).alignment = { horizontal: 'center', vertical: 'middle' };

      // Aplicar bordes y formato especial para ausentes
      for(let i=1; i<=9; i++) {
        const cell = row.getCell(i);
        cell.border = thinBorder;
        
        // Formato especial para columna "Ausente"
        if (i === 9) {
          cell.font = { size: 9, bold: true, color: { argb: 'FFDC2626' } }; // Rojo
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } }; // Fondo rojo claro
        } else {
          cell.font = { size: 9 };
        }
      }
      
      currentRow++;
    });
  }

  // Ajustar anchos
  sheet.columns = [
    { width: 12 }, { width: 10 }, { width: 15 }, { width: 30 }, 
    { width: 25 }, { width: 10 }, { width: 15 }, { width: 10 }, { width: 12 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  
  // Descargar Blob
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `reporte_asistencias_${Date.now()}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
