import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { buildAttendanceReport } from './reportBuilder';

/**
 * Cargar imagen helper
 */
const loadImageBase64 = async (src) => {
    return new Promise((resolve) => {
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
      img.onerror = () => resolve(null);
    });
};

export const exportAttendancePDF = async (apiData) => {
  const report = buildAttendanceReport(apiData);
  const doc = new jsPDF();

  // Logos
  try {
     const appLogoUrl = `${window.location.origin}/logo.png`;
     const sysLogo = await loadImageBase64(appLogoUrl);
     if(sysLogo) doc.addImage(sysLogo, 'PNG', 170, 15, 25, 25);
  } catch(e){}

  if (report.logo) {
    try {
        let logoData = report.logo;
        if (!logoData.startsWith('data:image')) logoData = `data:image/png;base64,${logoData}`;
        doc.addImage(logoData, 'PNG', 15, 15, 25, 25);
    } catch (e) {}
  }

  // Encabezados
  doc.setFontSize(16);
  doc.setTextColor(31, 71, 136);
  doc.text(report.institucion, 105, 22, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text(report.titulo, 105, 30, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(report.rango, 105, 36, { align: 'center' });

  // Stats Line
  const s = report.stats;
  if(s) {
      const puntuales = Math.max(0, (s.entradas || 0) - (s.tardes || 0));
      // Contar ausentes reales desde las filas generadas para precisión
      const ausentesCount = report.filas.filter(f => f.estado === 'Ausente' || f.colorEstado === 'red_bg').length;
      const statsStr = `Total: ${s.total} | Entradas: ${s.entradas} (Puntuales: ${puntuales}, Tardes: ${s.tardes}) | Salidas: ${s.salidas} | Ausentes: ${ausentesCount}`;
      doc.text(statsStr, 105, 42, { align: 'center' });
  }

  doc.setDrawColor(200);
  doc.line(15, 45, 195, 45);

  // Transformar filas para AutoTable
  const bodyData = report.filas.map(f => [
      f.fecha,
      f.hora,
      f.carnet,
      f.nombre,
      `${f.tipo}\n${f.grado}`, // Combinado con salto de línea
      f.seccion,
      f.jornada,
      f.evento,
      f.estado
  ]);

  autoTable(doc, {
    startY: 50,
    head: [[ 'Fecha', 'Hora', 'Carnet', 'Nombre', 'Tipo / Grado', 'Sección', 'Jornada', 'Evento', 'Estado' ]],
    body: bodyData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8, halign: 'center' },
    styles: { fontSize: 7, cellPadding: 2, halign: 'center', valign: 'middle' },
    columnStyles: { 3: { halign: 'left' }, 4: { halign: 'left' } },
    didParseCell: function(data) {
        // Colorear textos específicos
        if (data.section === 'body' && data.column.index === 8) {
             const rowIdx = data.row.index;
             const filaOriginal = report.filas[rowIdx];
             if (filaOriginal.colorEstado === 'red' || filaOriginal.colorEstado === 'red_bg') {
                 data.cell.styles.textColor = [255, 0, 0];
                 data.cell.styles.fontStyle = 'bold';
             }
        }
    }
  });

  const now = new Date();
  const filename = `Reporte_Asistencia_${now.getDate()}${now.getMonth()+1}${now.getFullYear()}_${now.getHours()}${now.getMinutes()}.pdf`;
  doc.save(filename);
};
