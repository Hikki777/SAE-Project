import ExcelJS from 'exceljs';
import { buildAttendanceReport } from './reportBuilder';

// Helper para cargar logo app desde URL (mismo origen)
const loadAppLogo = async () => {
    try {
        const response = await fetch('/logo.png');
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // Base64
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return null;
    }
};

export const exportAttendanceExcel = async (apiData) => {
  const report = buildAttendanceReport(apiData);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Asistencia');

  // --- ENCABEZADOS DE ANCHO COMPLETO (A-I) ---

  // A1: Institución
  sheet.mergeCells('A1:I1');
  const cellInst = sheet.getCell('A1');
  cellInst.value = report.institucion;
  cellInst.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF1F4788' } }; // Azul oscuro institucional
  cellInst.alignment = { horizontal: 'center', vertical: 'middle' };

  // A2: Título
  sheet.mergeCells('A2:I2');
  const cellTitle = sheet.getCell('A2');
  cellTitle.value = report.titulo;
  cellTitle.font = { name: 'Calibri', size: 14, bold: true };
  cellTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  // A3: Rango
  sheet.mergeCells('A3:I3');
  const cellRange = sheet.getCell('A3');
  cellRange.value = report.rango;
  cellRange.font = { name: 'Calibri', size: 11 };
  cellRange.alignment = { horizontal: 'center', vertical: 'middle' };
  
  // A4: Estadísticas
  const s = report.stats || {};
  const puntuales = Math.max(0, (s.entradas || 0) - (s.tardes || 0));
  const ausentesCount = report.filas.filter(f => f.estado === 'Ausente' || f.colorEstado === 'red_bg').length;
  const statsStr = `Total: ${s.total || 0} | Entradas: ${s.entradas || 0} (Puntuales: ${puntuales}, Tardes: ${s.tardes || 0}) | Salidas: ${s.salidas || 0} | Ausentes: ${ausentesCount}`;

  sheet.mergeCells('A4:I4');
  const cellStats = sheet.getCell('A4');
  cellStats.value = statsStr;
  cellStats.font = { name: 'Calibri', size: 11 };
  cellStats.alignment = { horizontal: 'center', vertical: 'middle' };
  cellStats.border = { bottom: { style: 'thin' } };

  // --- LOGOS FLOTANTES ---
  // Ahora que las celdas están combinadas, las imágenes van "encima" usando coordenadas relativas
  
  // Logo Institución (Izquierda, sobre A1-A3 aprox)
  if (report.logo) {
    try {
      const imageId = workbook.addImage({ base64: report.logo, extension: 'png' });
      // Posición: Columna A (0), Fila 0, con padding
      sheet.addImage(imageId, { 
        tl: { col: 0.2, row: 0.2 }, 
        ext: { width: 80, height: 80 } 
      });
    } catch (e) {}
  }

  // Logo App (Derecha, sobre I1-I3 aprox)
  const appLogoBase64 = await loadAppLogo();
  if (appLogoBase64) {
      const imageIdApp = workbook.addImage({ base64: appLogoBase64, extension: 'png' });
      // Posición: Columna I (8), alineado a la derecha
      // Como I es la última, lo ponemos en 8.2 aprox
      sheet.addImage(imageIdApp, { 
        tl: { col: 8.1, row: 0.2 }, 
        ext: { width: 80, height: 80 } 
      }); 
  }

  // Estadísticas ya agregadas arriba



  // Ajustar altura de filas de encabezado
  sheet.getRow(1).height = 30;
  sheet.getRow(2).height = 25;
  sheet.getRow(3).height = 20;
  sheet.getRow(4).height = 20; // Nueva fila stats
  sheet.getRow(5).height = 10; // Espacio vacio antes de tabla

  // --- TABLA ---
  // Fila 6: Headers
  const headerRow = sheet.getRow(6);
  headerRow.values = report.columnas.map(c => c.header);
  
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
  });

  // Configurar anchos
  sheet.columns = report.columnas.map(c => ({ width: c.width }));

  // --- DATOS ---
  report.filas.forEach(fila => {
      // Combinar tipo y grado para Excel para simular el cell newline
      const tipoGrado = `${fila.tipo}\n${fila.grado}`;

      const rowValues = [
          fila.fecha,
          fila.hora,
          fila.carnet,
          fila.nombre,
          tipoGrado,
          fila.seccion,
          fila.jornada,
          fila.evento,
          fila.estado
      ];
      const row = sheet.addRow(rowValues);

      // ⭐ ALTURA UNIFORME (CRÍTICO para diseño ordenado)
      row.height = 28;

      // Estilos por celda
      row.eachCell((cell, colNum) => {
          cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.font = { name: 'Calibri', size: 10 }; // Fuente consistente
          
          // Ajustes específicos
          if (colNum === 4 || colNum === 5) { // Nombre y Tipo/Grado
               cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          }
      });

      // Colores de estado
      const cellEstado = row.getCell(9); // Index 9 es Estado
      if (fila.colorEstado === 'red') {
          cellEstado.font = { color: { argb: 'FFFF0000' }, bold: true };
      } else if (fila.colorEstado === 'red_bg') {
          cellEstado.font = { color: { argb: 'FFDC2626' }, bold: true };
          cellEstado.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
      }
  });

  // --- DESCARGA ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  
  const now = new Date();
  const filename = `Reporte_Asistencia_${now.getDate()}${now.getMonth()+1}${now.getFullYear()}_${now.getHours()}${now.getMinutes()}.xlsx`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
