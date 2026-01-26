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

/**
 * HELPERS GLOBALES
 */
const formatDateStr = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
};

const formatDateWithPadding = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getFilenameDate = () => {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = String(now.getFullYear());
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${d}${m}${y}_${h}${min}`;
};

/**
 * REPORTE PDF DE ASISTENCIAS
 */
export const generatePDF = async (data) => {
  const { asistencias, ausentes = [], institucion, stats, filtrosGenerated } = data;
  const doc = new jsPDF();

  try {
    const appLogoUrl = `${window.location.origin}/logo.png`;
    await loadImageBase64(appLogoUrl);
  } catch (e) {}

  try {
    const imgApp = new Image();
    imgApp.src = `${window.location.origin}/logo.png`;
    doc.addImage(imgApp, 'PNG', 170, 15, 25, 25);
  } catch (e) {}

  if (institucion?.logo_base64) {
    try {
      let logoData = institucion.logo_base64;
      if (!logoData.startsWith('data:image')) logoData = `data:image/png;base64,${logoData}`;
      doc.addImage(logoData, 'PNG', 15, 15, 25, 25);
    } catch (e) {}
  }

  doc.setFontSize(16);
  doc.setTextColor(31, 71, 136);
  doc.text(institucion?.nombre || 'Instituto Educativo', 105, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(0);
  const infoLine1 = [institucion?.direccion, institucion?.telefono ? `Tel: ${institucion.telefono}` : null].filter(Boolean).join(' | ');
  doc.text(infoLine1, 105, 30, { align: 'center' });
  const infoLine2 = [institucion?.email, institucion?.municipio, institucion?.departamento, institucion?.pais].filter(Boolean).join(' | ');
  doc.text(infoLine2, 105, 36, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text('REPORTE DE ASISTENCIAS', 105, 50, { align: 'center' });
  doc.setDrawColor(200);
  doc.line(15, 55, 195, 55);

  doc.setFontSize(9);
  const filterParts = [];
  if (filtrosGenerated.fechaInicio) filterParts.push(`Desde: ${formatDateStr(filtrosGenerated.fechaInicio)}`);
  if (filtrosGenerated.fechaFin) filterParts.push(`Hasta: ${formatDateStr(filtrosGenerated.fechaFin)}`);
  if (filterParts.length === 0) filterParts.push(`Fecha: ${new Date().toLocaleDateString()}`);
  doc.text(filterParts.join(' • '), 105, 62, { align: 'center' });

  const puntuales = Math.max(0, (stats.entradas || 0) - (stats.tardes || 0));
  const statsStr = `Total: ${stats.total} | Entradas: ${stats.entradas} (Puntuales: ${puntuales}, Tardes: ${stats.tardes}) | Salidas: ${stats.salidas} | Ausentes: ${ausentes.length}`;
  doc.text(statsStr, 105, 69, { align: 'center' });

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-';
  
  const tableData = asistencias.map(a => {
    const persona = a.alumno || a.personal;
    const dateObj = new Date(a.timestamp);
    const fecha = formatDateWithPadding(dateObj);
    const hora = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const esAlumno = !!a.alumno;
    const tipo = esAlumno ? 'Alumno' : 'Personal';
    const gradoCargo = esAlumno ? (persona?.grado || '') : (persona?.cargo || '');
    const seccion = (a.alumno && persona?.seccion) ? persona.seccion : '-';
    const jornada = capitalize(persona?.jornada || 'Matutina');

    return [
      fecha,
      hora,
      persona?.carnet || 'N/A',
      `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim(),
      `${tipo}\n${gradoCargo}`,
      seccion,
      jornada,
      capitalize(a.tipo_evento),
      a.tipo_evento === 'salida' ? '-' : capitalize(a.estado_puntualidad)
    ];
  });

  ausentes.forEach(ausente => {
    const esAlumno = ausente.tipo === 'alumno';
    const tipo = esAlumno ? 'Alumno' : 'Personal';
    const gradoCargo = esAlumno ? (ausente.grado || '') : (ausente.cargo || '');
    const seccion = esAlumno ? (ausente.seccion || '-') : '-';
    const jornada = capitalize(ausente.jornada || 'Matutina');
    const fechaAusente = ausente.fechaAusencia 
      ? formatDateStr(ausente.fechaAusencia) 
      : (filtrosGenerated.fechaInicio ? formatDateStr(filtrosGenerated.fechaInicio) : formatDateWithPadding(new Date()));

    tableData.push([
      fechaAusente,
      'N/A',
      ausente.carnet || 'N/A',
      `${ausente.nombres || ''} ${ausente.apellidos || ''}`.trim(),
      `${tipo}\n${gradoCargo}`,
      seccion,
      jornada,
      'N/A',
      'Ausente'
    ]);
  });

  autoTable(doc, {
    startY: 75,
    head: [['Fecha', 'Hora', 'Carnet', 'Nombre Completo', 'Tipo / Grado', 'Sección', 'Jornada', 'Evento', 'Estado']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8, halign: 'center' },
    styles: { fontSize: 7, cellPadding: 2, halign: 'center' },
    columnStyles: { 3: { halign: 'left' } },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Generado por SAE - Pág ${i} de ${pageCount}`, 105, 290, { align: 'center' });
  }

  doc.save(`reporte_asistencias_${getFilenameDate()}.pdf`);
};

/**
 * REPORTE EXCEL DE ASISTENCIAS
 */
export const generateExcel = async (data) => {
  const { asistencias, ausentes = [], institucion, stats, filtrosGenerated } = data;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Asistencias');

  if (institucion?.logo_base64) {
    try {
      const imageId = workbook.addImage({ base64: institucion.logo_base64, extension: 'png' });
      sheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 80, height: 80 } });
    } catch (e) {}
  }

  sheet.mergeCells('C1:G1');
  sheet.getCell('C1').value = institucion?.nombre || 'Instituto Educativo';
  sheet.getCell('C1').font = { size: 16, bold: true, color: { argb: 'FF1F4788' } };
  sheet.getCell('C1').alignment = { horizontal: 'center' };

  sheet.mergeCells('A5:I5');
  sheet.getCell('A5').value = 'REPORTE DE ASISTENCIAS';
  sheet.getCell('A5').font = { size: 14, bold: true };
  sheet.getCell('A5').alignment = { horizontal: 'center' };

  const headers = ['Fecha', 'Hora', 'Carnet', 'Nombre', 'Tipo / Grado', 'Sección', 'Jornada', 'Evento', 'Estado'];
  const headerRow = sheet.getRow(8);
  headerRow.values = headers;
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-';
  let currentRow = 9;

  // Estilos Comunes
  const thinBorder = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  const applyRowStyles = (row, isZebra) => {
      row.eachCell((cell, colNumber) => {
          cell.border = thinBorder;
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          // Nombre (4) y Tipo (5) a la izquierda y con wrap
          if (colNumber === 4 || colNumber === 5) {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          }
          // Zebra
          if (isZebra) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
          }
      });
  };

  asistencias.forEach(a => {
    const persona = a.alumno || a.personal;
    const esAlumno = !!a.alumno;
    const row = sheet.getRow(currentRow);
    const dateObj = new Date(a.timestamp);

    row.getCell(1).value = formatDateWithPadding(dateObj);
    row.getCell(2).value = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    row.getCell(3).value = persona?.carnet || '';
    row.getCell(4).value = `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim();
    
    const tipo = esAlumno ? 'Alumno' : 'Personal';
    const gradoCargo = esAlumno ? (persona?.grado || '') : (persona?.cargo || '');
    row.getCell(5).value = `${tipo}\n${gradoCargo}`;
    
    row.getCell(6).value = (esAlumno && persona?.seccion) ? persona.seccion : '-';
    row.getCell(7).value = capitalize(persona?.jornada || 'Matutina');
    row.getCell(8).value = capitalize(a.tipo_evento);
    row.getCell(9).value = a.tipo_evento === 'salida' ? '-' : capitalize(a.estado_puntualidad);

    applyRowStyles(row, currentRow % 2 === 0);

    // Color rojo para tarde
    if (a.estado_puntualidad === 'tarde' && a.tipo_evento === 'entrada') {
        row.getCell(9).font = { color: { argb: 'FFFF0000' } };
    }

    currentRow++;
  });

  if (ausentes && ausentes.length > 0) {
    const fechaReporte = filtrosGenerated.fechaInicio ? formatDateStr(filtrosGenerated.fechaInicio) : formatDateWithPadding(new Date());

    ausentes.forEach(ausente => {
      const row = sheet.getRow(currentRow);
      const esAlumno = ausente.tipo === 'alumno';
      const tipo = esAlumno ? 'Alumno' : 'Personal';
      const gradoCargo = esAlumno ? (ausente.grado || '') : (ausente.cargo || '');
      const fechaAusente = ausente.fechaAusencia ? formatDateStr(ausente.fechaAusencia) : fechaReporte;

      row.getCell(1).value = fechaAusente;
      row.getCell(2).value = 'N/A';
      row.getCell(3).value = ausente.carnet || 'N/A';
      row.getCell(4).value = `${ausente.nombres || ''} ${ausente.apellidos || ''}`.trim();
      row.getCell(5).value = `${tipo}\n${gradoCargo}`;
      row.getCell(6).value = esAlumno ? (ausente.seccion || '-') : '-';
      row.getCell(7).value = capitalize(ausente.jornada || 'Matutina');
      row.getCell(8).value = 'N/A';
      row.getCell(9).value = 'Ausente';

      applyRowStyles(row, currentRow % 2 === 0);

      // Estilo Ausente
      const cellAusente = row.getCell(9);
      cellAusente.font = { color: { argb: 'FFDC2626' }, bold: true };
      cellAusente.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };

      currentRow++;
    });
  }

  sheet.columns = [
    { width: 15 }, { width: 10 }, { width: 15 }, { width: 40 }, 
    { width: 30 }, { width: 10 }, { width: 15 }, { width: 15 }, { width: 15 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `reporte_asistencias_${getFilenameDate()}.xlsx`;
  anchor.click();
};

/**
 * REPORTE PDF DE JUSTIFICACIONES
 */
export const generateJustificacionesPDF = async (data) => {
  const { excusas, institucion, stats, filtrosGenerated } = data;
  const doc = new jsPDF();
  
  if (institucion?.logo_base64) {
    try {
      let logoData = institucion.logo_base64;
      if (!logoData.startsWith('data:image')) logoData = `data:image/png;base64,${logoData}`;
      doc.addImage(logoData, 'PNG', 15, 15, 25, 25);
    } catch (e) {}
  }
  
  doc.setFontSize(16);
  doc.setTextColor(31, 71, 136);
  doc.text(institucion?.nombre || 'Instituto Educativo', 105, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(0);
  const infoLine1 = [institucion?.direccion, institucion?.telefono ? `Tel: ${institucion.telefono}` : null].filter(Boolean).join(' | ');
  doc.text(infoLine1, 105, 30, { align: 'center' });
  const infoLine2 = [institucion?.email, institucion?.municipio, institucion?.departamento, institucion?.pais].filter(Boolean).join(' | ');
  doc.text(infoLine2, 105, 36, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text('REPORTE DE JUSTIFICACIONES', 105, 50, { align: 'center' });
  doc.setDrawColor(200);
  doc.line(15, 55, 195, 55);

  doc.setFontSize(9);
  doc.setTextColor(0);
  const filterParts = [];
  if (filtrosGenerated.fechaInicio) filterParts.push(`Desde: ${formatDateStr(filtrosGenerated.fechaInicio)}`);
  if (filtrosGenerated.fechaFin) filterParts.push(`Hasta: ${formatDateStr(filtrosGenerated.fechaFin)}`);
  if (filtrosGenerated.estado) filterParts.push(`Estado: ${filtrosGenerated.estado.toUpperCase()}`);
  doc.text(filterParts.join(' • '), 105, 62, { align: 'center' });

  const statsStr = `Total: ${stats.total} | Pendientes: ${stats.pendientes} | Aprobadas: ${stats.aprobadas} | Rechazadas: ${stats.rechazadas}`;
  doc.text(statsStr, 105, 69, { align: 'center' });

  const tableData = excusas.map(e => {
    const persona = e.alumno || e.personal;
    const esAlumno = !!e.alumno;
    const tipo = esAlumno ? 'Alumno' : 'Personal';
    const gradoCargo = esAlumno ? (persona?.grado || '') : (persona?.cargo || '');
    return [
      formatDateWithPadding(e.fecha_ausencia),
      persona?.carnet || 'N/A',
      `${persona?.nombres} ${persona?.apellidos}`,
      `${tipo}\n${gradoCargo}`,
      e.motivo,
      e.estado.charAt(0).toUpperCase() + e.estado.slice(1),
      e.observaciones || '-'
    ];
  });

  autoTable(doc, {
    startY: 75,
    head: [['Fecha', 'Carnet', 'Nombre', 'Rol/Grado', 'Motivo', 'Estado', 'Obs.']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8, halign: 'center' },
    styles: { fontSize: 7, cellPadding: 2, halign: 'center' },
    columnStyles: { 2: { halign: 'left' }, 4: { halign: 'left' } }
  });

  doc.save(`reporte_justificaciones_${getFilenameDate()}.pdf`);
};

/**
 * REPORTE EXCEL DE JUSTIFICACIONES
 */
export const generateJustificacionesExcel = async (data) => {
  const { excusas, institucion, stats, filtrosGenerated } = data;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Justificaciones');

  sheet.mergeCells('A1:G1');
  sheet.getCell('A1').value = institucion?.nombre || 'Instituto Educativo';
  sheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FF1F4788' } };
  sheet.getCell('A1').alignment = { horizontal: 'center' };

  if (institucion?.direccion || institucion?.telefono || institucion?.email) {
    sheet.mergeCells('A2:G2');
    const infoLine1 = [institucion?.direccion, institucion?.telefono ? `Tel: ${institucion.telefono}` : null].filter(Boolean).join(' | ');
    sheet.getCell('A2').value = infoLine1;
    sheet.getCell('A2').font = { size: 10 };
    sheet.getCell('A2').alignment = { horizontal: 'center' };

    sheet.mergeCells('A3:G3');
    const infoLine2 = [institucion?.email, institucion?.municipio, institucion?.departamento, institucion?.pais].filter(Boolean).join(' | ');
    sheet.getCell('A3').value = infoLine2;
    sheet.getCell('A3').font = { size: 10 };
    sheet.getCell('A3').alignment = { horizontal: 'center' };
  }

  sheet.mergeCells('A4:G4');
  sheet.getCell('A4').value = 'REPORTE DE JUSTIFICACIONES';
  sheet.getCell('A4').font = { size: 14, bold: true };
  sheet.getCell('A4').alignment = { horizontal: 'center' };

  const headers = ['Fecha', 'Carnet', 'Nombre', 'Rol/Grado', 'Motivo', 'Estado', 'Obs.'];
  const headerRow = sheet.getRow(6);
  headerRow.values = headers;
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  const thinBorder = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

  excusas.forEach(e => {
    const persona = e.alumno || e.personal;
    const esAlumno = !!e.alumno;
    const tipo = esAlumno ? 'Alumno' : 'Personal';
    const gradoCargo = esAlumno ? (persona?.grado || '') : (persona?.cargo || '');
    
    const row = sheet.addRow([
      formatDateWithPadding(e.fecha_ausencia),
      persona?.carnet || 'N/A',
      `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim(),
      `${tipo} - ${gradoCargo}`,
      e.motivo || '',
      e.estado || '',
      e.observaciones || ''
    ]);

    row.eachCell((cell, colNumber) => {
        cell.border = thinBorder;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (colNumber === 3 || colNumber === 5) { // Nombre y Motivo
           cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
    });
  });

  sheet.columns = [ { width: 15 }, { width: 15 }, { width: 30 }, { width: 25 }, { width: 25 }, { width: 15 }, { width: 20 } ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte_justificaciones_${getFilenameDate()}.xlsx`;
  a.click();
};
