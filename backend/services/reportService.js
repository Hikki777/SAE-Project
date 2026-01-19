const prisma = require('../prismaClient');
const { logger } = require('../utils/logger');
const fs = require('fs-extra');
const path = require('path');
const { UPLOADS_DIR } = require('../utils/paths');

class ReportService {
  /**
   * Obtener datos para el reporte (para generar en Frontend)
   */
  async obtenerDatosReporte(filtros = {}) {
    const { fechaInicio, fechaFin, personaTipo, grado, tipoEvento } = filtros;

    logger.info({ filtros }, '[REPORT] Obteniendo datos para reporte');
    
    // Construir query con filtros
    const where = this.construirFiltros(filtros);

    // Obtener datos
    const asistencias = await prisma.asistencia.findMany({
      where,
      include: {
        alumno: {
          select: {
            carnet: true,
            nombres: true,
            apellidos: true,
            grado: true,
            seccion: true,
            jornada: true
          }
        },
        personal: {
          select: {
            carnet: true,
            nombres: true,
            apellidos: true,
            cargo: true,
            jornada: true
          }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Obtener institución
    const institucion = await prisma.institucion.findUnique({ where: { id: 1 } });
    
    // Inyectar logo en base64 para el reporte PDF
    if (institucion && institucion.logo_path) {
        try {
            const logoFullPath = path.join(UPLOADS_DIR, institucion.logo_path);
            if (await fs.pathExists(logoFullPath)) {
                const ext = path.extname(logoFullPath).toLowerCase().replace('.', '');
                const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
                const fileData = await fs.readFile(logoFullPath);
                const base64Data = fileData.toString('base64');
                institucion.logo_base64 = `data:${mime};base64,${base64Data}`;
                logger.info('[REPORT] Logo institucional cargado en memoria para PDF');
            } else {
                logger.warn({ path: logoFullPath }, '[REPORT] Archivo de logo no encontrado en disco');
            }
        } catch (imgErr) {
            logger.error({ err: imgErr }, '[REPORT] Error leyendo archivo de logo');
        }
    }
    
    // Estadísticas
    const stats = this.calcularEstadisticas(asistencias);

    // Obtener ausentes para el rango de fechas
    let ausentes = [];
    
    if (fechaInicio && fechaFin) {
      // Parsear fechas manualmente para evitar UTC offset
      const parseLocalDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
      };
      
      const inicio = parseLocalDate(fechaInicio);
      const fin = parseLocalDate(fechaFin);
      const diffTime = Math.abs(fin - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Solo calcular ausentes si el rango es <= 31 días (evitar sobrecarga)
      if (diffDays <= 31) {
        logger.info({ dias: diffDays, fechaInicio, fechaFin }, '[REPORT] Obteniendo ausentes para rango de fechas...');
        
        try {
          // Obtener ausentes para cada día del rango
          const fechaActual = new Date(inicio);
          const ausentesMap = new Map(); // Usar Map para evitar duplicados
          
          while (fechaActual <= fin) {
            const year = fechaActual.getFullYear();
            const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const day = String(fechaActual.getDate()).padStart(2, '0');
            const fechaStr = `${year}-${month}-${day}`;
            
            logger.info({ fechaStr }, '[REPORT] Obteniendo ausentes para día...');
            const ausentesDia = await this.obtenerAusentesPorFecha(fechaStr, personaTipo);
            logger.info({ fechaStr, count: ausentesDia.length }, '[REPORT] Ausentes del día obtenidos');
            
            // Agregar ausentes con la fecha correspondiente
            ausentesDia.forEach(ausente => {
              const key = `${ausente.id}-${fechaStr}`;
              if (!ausentesMap.has(key)) {
                ausentesMap.set(key, {
                  ...ausente,
                  fechaAusencia: fechaStr
                });
              }
            });
            
            fechaActual.setDate(fechaActual.getDate() + 1);
          }
          
          ausentes = Array.from(ausentesMap.values());
          logger.info({ count: ausentes.length }, '[REPORT] Ausentes obtenidos para rango');
        } catch (err) {
          logger.error({ err }, '[ERROR] Error obteniendo ausentes para reporte');
          // No fallar el reporte si falla la detección de ausentes
        }
      } else {
        logger.warn({ dias: diffDays }, '[REPORT] Rango muy grande, omitiendo cálculo de ausentes');
      }
    }

    logger.info({ count: asistencias.length, ausentes: ausentes.length }, `[OK] Datos obtenidos exitosamente`);

    return { 
      asistencias, 
      ausentes, // Incluir ausentes (vacío si rango > 31 días)
      institucion, 
      stats, 
      filtrosGenerated: {
        fechaInicio,
        fechaFin,
        personaTipo,
        grado
      }
    };
  }

  // Alias para mantener compatibilidad con frontend
  async generarReportePDF(filtros = {}) {
    return this.obtenerDatosReporte(filtros);
  }

  // Alias para mantener compatibilidad con frontend
  async generarReporteExcel(filtros = {}) {
    return this.obtenerDatosReporte(filtros);
  }

  /**
   * Obtener datos por alumno específico
   */
  async generarReporteAlumno(alumnoId, formato = 'pdf') {
    const alumno = await prisma.alumno.findUnique({
      where: { id: parseInt(alumnoId) }
    });

    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    const filtros = {
      personaTipo: 'alumno',
      alumnoId: parseInt(alumnoId)
    };

    return this.obtenerDatosReporte(filtros);
  }

  /**
   * Construir objeto de filtros para Prisma
   */
  construirFiltros(filtros) {
    const where = {};

    if (filtros.fechaInicio || filtros.fechaFin) {
      where.timestamp = {};
      if (filtros.fechaInicio) {
        // Parsear fecha local manualmente YYYY-MM-DD
        const parts = filtros.fechaInicio.split('-');
        let inicio;
        if (parts.length === 3) {
            inicio = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
            inicio = new Date(filtros.fechaInicio);
        }
        inicio.setHours(0, 0, 0, 0);
        where.timestamp.gte = inicio;
      }
      if (filtros.fechaFin) {
        // Parsear fecha local manualmente YYYY-MM-DD
        const parts = filtros.fechaFin.split('-');
        let fin;
        if (parts.length === 3) {
            fin = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
            fin = new Date(filtros.fechaFin);
        }
        fin.setHours(23, 59, 59, 999);
        where.timestamp.lte = fin;
      }
    }

    if (filtros.personaTipo) {
      where.persona_tipo = filtros.personaTipo;
    }

    if (filtros.alumnoId) {
      where.alumno_id = parseInt(filtros.alumnoId);
    }

    if (filtros.personalId) {
      where.personal_id = parseInt(filtros.personalId);
    }

    if (filtros.tipoEvento) {
      where.tipo_evento = filtros.tipoEvento;
    }

    // Filtro por grado (requiere join)
    if (filtros.grado) {
      where.alumno = { grado: filtros.grado };
    }

    return where;
  }

  /**
   * Obtener ausentes para una fecha específica
   */
  async obtenerAusentesPorFecha(fechaStr, personaTipo = 'todos') {
    logger.info({ fechaStr, personaTipo }, '[REPORT] obtenerAusentesPorFecha llamado');
    
    // Parse manual para evitar UTC offset
    let fechaInicio, fechaFin;
    if (fechaStr.includes('-')) {
      const [y, m, d] = fechaStr.split('-').map(Number);
      fechaInicio = new Date(y, m - 1, d);
    } else {
      fechaInicio = new Date(fechaStr);
    }
    fechaInicio.setHours(0, 0, 0, 0);
    
    fechaFin = new Date(fechaInicio);
    fechaFin.setHours(23, 59, 59, 999);

    // Obtener todas las asistencias del día (solo entradas)
    const asistenciasDelDia = await prisma.asistencia.findMany({
      where: {
        timestamp: {
          gte: fechaInicio,
          lte: fechaFin
        },
        tipo_evento: 'entrada' // Solo considerar entradas
      },
      select: {
        alumno_id: true,
        personal_id: true
      }
    });

    logger.info({ count: asistenciasDelDia.length }, '[REPORT] Asistencias del día encontradas');

    // Crear sets de IDs que SÍ asistieron
    const alumnosQueAsistieron = new Set(
      asistenciasDelDia
        .filter(a => a.alumno_id)
        .map(a => a.alumno_id)
    );

    const personalQueAsistio = new Set(
      asistenciasDelDia
        .filter(a => a.personal_id)
        .map(a => a.personal_id)
    );

    logger.info({ 
      alumnosQueAsistieron: alumnosQueAsistieron.size, 
      personalQueAsistio: personalQueAsistio.size 
    }, '[REPORT] Sets de asistentes creados');

    const ausentes = [];

    // Detectar alumnos ausentes
    if (personaTipo === 'todos' || personaTipo === 'alumno') {
      const alumnosActivos = await prisma.alumno.findMany({
        where: {
          estado: 'activo'
        },
        select: {
          id: true,
          carnet: true,
          nombres: true,
          apellidos: true,
          grado: true,
          seccion: true,
          jornada: true
        }
      });

      logger.info({ count: alumnosActivos.length }, '[REPORT] Alumnos activos encontrados');

      alumnosActivos.forEach(alumno => {
        if (!alumnosQueAsistieron.has(alumno.id)) {
          ausentes.push({
            ...alumno,
            tipo: 'alumno'
          });
        }
      });
    }

    // Detectar personal ausente
    if (personaTipo === 'todos' || personaTipo === 'personal' || personaTipo === 'docente') {
      const personalActivo = await prisma.personal.findMany({
        where: {
          estado: 'activo'
        },
        select: {
          id: true,
          carnet: true,
          nombres: true,
          apellidos: true,
          cargo: true,
          jornada: true
        }
      });

      logger.info({ count: personalActivo.length }, '[REPORT] Personal activo encontrado');

      personalActivo.forEach(persona => {
        if (!personalQueAsistio.has(persona.id)) {
          ausentes.push({
            ...persona,
            tipo: 'personal'
          });
        }
      });
    }

    logger.info({ count: ausentes.length }, '[REPORT] Total ausentes detectados');
    return ausentes;
  }

  /**
   * Calcular estadísticas
   */
  calcularEstadisticas(asistencias) {
    return {
      total: asistencias.length,
      entradas: asistencias.filter(a => a.tipo_evento === 'entrada').length,
      salidas: asistencias.filter(a => a.tipo_evento === 'salida').length,
      puntuales: asistencias.filter(a => a.estado_puntualidad === 'puntual').length,
      tardes: asistencias.filter(a => a.estado_puntualidad === 'tarde').length,
      porQR: asistencias.filter(a => a.origen === 'QR').length,
      manual: asistencias.filter(a => a.origen === 'Manual').length
    };
  }


}

module.exports = new ReportService();
