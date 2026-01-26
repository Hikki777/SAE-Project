/**
 * Construye la estructura canónica del reporte para ser usada por PDF y Excel.
 * Única fuente de verdad para datos y formato base.
 */
export function buildAttendanceReport(apiData) {
  const { asistencias, institucion, filtrosGenerated } = apiData;

  // Helpers de formato fecha
  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    // Si es string
    if (typeof date === 'string') {
        // Caso ISO con T (ej: 2026-01-25T15:23:00.000Z) -> Usar Date constructor
        if (date.includes('T')) {
            const d = new Date(date);
            if (isNaN(d.getTime())) return 'N/A';
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        }
        
        // Caso YYYY-MM-DD simple (ej: 2026-01-25) -> Dividir manual para evitar timezone shift
        if (date.includes('-')) {
            const parts = date.split('-');
            // Asegurar que solo tomamos los primeros 3 componentes
            if (parts.length >= 3) {
                 const y = parseInt(parts[0]);
                 const m = parseInt(parts[1]);
                 const d = parseInt(parts[2]); // parseInt detendrá la lectura si hay basura extra, pero mejor ser preciso
                 return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
            }
        }
    }

    // Fallback estándar
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatTime = (date) => {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-';

  // Array principal
  const filas = asistencias.map(a => {
      const persona = a.alumno || a.personal;
      const esAlumno = !!a.alumno;
      const tipo = esAlumno ? 'Alumno' : 'Personal';
      const gradoCargo = esAlumno ? (persona?.grado || '') : (persona?.cargo || '');
      
      return {
          fecha: formatDate(a.timestamp),
          hora: formatTime(a.timestamp),
          carnet: persona?.carnet || 'N/A',
          nombre: `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim(),
          tipo: tipo,
          grado: gradoCargo, // Separado para flexibilidad, PDF puede unirlos
          seccion: (a.alumno && persona?.seccion) ? persona.seccion : '-',
          jornada: capitalize(persona?.jornada || 'Matutina'),
          evento: capitalize(a.tipo_evento),
          estado: a.tipo_evento === 'salida' ? '-' : capitalize(a.estado_puntualidad),
          colorEstado: (a.estado_puntualidad === 'tarde' && a.tipo_evento === 'entrada') ? 'red' : 'black'
      };
  });

  // Agregar Ausentes al mismo array pero marcados
  if (apiData.ausentes && apiData.ausentes.length > 0) {
      const fechaReporte = filtrosGenerated.fechaInicio 
        ? formatDate(new Date(filtrosGenerated.fechaInicio + 'T00:00:00')) 
        : formatDate(new Date());

      apiData.ausentes.forEach(ausente => {
          const esAlumno = ausente.tipo === 'alumno';
          const tipo = esAlumno ? 'Alumno' : 'Personal';
          const gradoCargo = esAlumno ? (ausente.grado || '') : (ausente.cargo || '');
          const fechaAusencia = ausente.fechaAusencia ? formatDate(ausente.fechaAusencia) : fechaReporte;

          filas.push({
              fecha: fechaAusencia,
              hora: 'N/A',
              carnet: ausente.carnet || 'N/A',
              nombre: `${ausente.nombres || ''} ${ausente.apellidos || ''}`.trim(),
              tipo: tipo,
              grado: gradoCargo,
              seccion: esAlumno ? (ausente.seccion || '-') : '-',
              jornada: capitalize(ausente.jornada || 'Matutina'),
              evento: 'N/A',
              estado: 'Ausente',
              colorEstado: 'red_bg' // Indicador especial para fondo rojo/texto rojo
          });
      });
  }

  return {
    titulo: 'REPORTE DE ASISTENCIAS',
    institucion: institucion?.nombre || 'Instituto Educativo',
    logo: institucion?.logo_base64,
    rango: filtrosGenerated.fechaInicio && filtrosGenerated.fechaFin
      ? `Del ${formatDate(new Date(filtrosGenerated.fechaInicio + 'T00:00:00'))} al ${formatDate(new Date(filtrosGenerated.fechaFin + 'T00:00:00'))}`
      : `Fecha de emisión: ${formatDate(new Date())}`,

    // Metadatos extra para encabezados PDF/Excel
    stats: apiData.stats,
    
    // Columnas Definición
    columnas: [
      { header: 'Fecha', key: 'fecha', width: 12 },
      { header: 'Hora', key: 'hora', width: 10 },
      { header: 'Carnet', key: 'carnet', width: 15 },
      { header: 'Nombre Completo', key: 'nombre', width: 35 },
      { header: 'Tipo / Grado', key: 'tipo_grado', width: 30 }, // Combinado para Excel visual
      { header: 'Sección', key: 'seccion', width: 8 },
      { header: 'Jornada', key: 'jornada', width: 12 },
      { header: 'Evento', key: 'evento', width: 12 },
      { header: 'Estado', key: 'estado', width: 15 }
    ],

    filas: filas
  };
}
