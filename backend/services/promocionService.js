const prisma = require('../prismaClient');
const { getConfiguracion } = require('../config/educationSystems');
const { logger } = require('../utils/logger');

/**
 * Servicio de Migración de Alumnos
 * Maneja promociones, graduaciones y retiros
 */
const migracionService = {
  /**
   * Obtiene configuración educativa
   */
  getConfiguracion() {
    return getConfiguracion();
  },

  /**
   * Determina el siguiente grado según reglas del país
   * @param {string} gradoActual - Grado actual del alumno
   * @param {string} carrera - Carrera (si aplica para Diversificado)
   * @returns {string} Siguiente grado o 'GRADUADO'
   */
  getSiguienteGrado(gradoActual, carrera = null) {
    const config = this.getConfiguracion();
    const regla = config.reglasPromocion[gradoActual];
    
    if (!regla) {
      logger.warn({ grado: gradoActual, carrera }, '[migracionService] No se encontró regla de promoción para el grado');
      return null;
    }
    
    // Si es objeto (depende de carrera - caso Diversificado)
    if (typeof regla === 'object') {
      // 1. Prioridad: Regla explícita en config
      if (carrera && regla[carrera]) {
        return regla[carrera];
      }
      
      // 2. Lógica Dinámica (Heurística)
      if (carrera) {
         const lower = carrera.toLowerCase();
         // Bachillerato General (2 años) -> Gradúa al terminar el grado donde se define la regla (5to)
         if (lower.includes('bachillerato') && !lower.includes('madurez')) {
             return 'GRADUADO';
         }
         // Perito General (3 años) -> Continúa
         if (lower.includes('perito')) {
             return 'Graduandos';
         }
      }

      return regla.default || null;
    }
    
    return regla;
  },

  /**
   * Verifica si un alumno debe graduarse
   */
  debeGraduarse(alumno) {
    const siguienteGrado = this.getSiguienteGrado(
      alumno.grado,
      alumno.carrera
    );
    return siguienteGrado === 'GRADUADO';
  },

  /**
   * Promover alumnos seleccionados
   * @param {number[]} alumnosIds - IDs de alumnos a promover
   * @param {number} anioEscolar - Año escolar (2024, 2025, etc.)
   * @returns {object} Resultados de la promoción
   */
  async promoverAlumnos(alumnosIds, anioEscolar) {
    const resultados = {
      promovidos: [],
      graduados: [],
      errores: []
    };
    
    for (const id of alumnosIds) {
      try {
        const alumno = await prisma.alumno.findUnique({ where: { id } });
        if (!alumno) {
          resultados.errores.push({ id, error: 'Alumno no encontrado' });
          continue;
        }
        
        const siguienteGrado = this.getSiguienteGrado(
          alumno.grado,
          alumno.carrera
        );
        
        if (!siguienteGrado) {
          resultados.errores.push({ id, error: 'No se pudo determinar siguiente grado' });
          continue;
        }
        
        if (siguienteGrado === 'GRADUADO') {
          // Graduar
          await this.graduarAlumno(id, anioEscolar);
          resultados.graduados.push({
            id,
            nombre: `${alumno.nombres} ${alumno.apellidos}`,
            gradoAnterior: alumno.grado,
            carrera: alumno.carrera
          });
        } else {
          // Promover
          await prisma.alumno.update({
            where: { id },
            data: { grado: siguienteGrado }
          });
          
          // Registrar en historial
          await prisma.historialAcademico.create({
            data: {
              alumno_id: id,
              anio_escolar: anioEscolar,
              grado_cursado: alumno.grado,
              nivel: alumno.nivel_actual || this.getNivelDeGrado(alumno.grado),
              carrera: alumno.carrera,
              promovido: true
            }
          });
          
          resultados.promovidos.push({
            id,
            nombre: `${alumno.nombres} ${alumno.apellidos}`,
            gradoAnterior: alumno.grado,
            nuevoGrado: siguienteGrado
          });
        }
      } catch (error) {
        logger.error({ err: error, alumnoId: id }, 'Error promoviendo alumno');
        resultados.errores.push({ id, error: error.message });
      }
    }
    
    logger.info({
      promovidos: resultados.promovidos.length,
      graduados: resultados.graduados.length,
      errores: resultados.errores.length
    }, 'Promoción de alumnos completada');
    
    return resultados;
  },

  /**
   * Graduar alumno
   */
  async graduarAlumno(alumnoId, anioEscolar) {
    const alumno = await prisma.alumno.findUnique({ where: { id: alumnoId } });
    
    await prisma.alumno.update({
      where: { id: alumnoId },
      data: {
        estado: 'graduado',
        anio_graduacion: anioEscolar,
        motivo_baja: 'graduado',
        fecha_baja: new Date()
      }
    });
    
    // Registrar en historial
    await prisma.historialAcademico.create({
      data: {
        alumno_id: alumnoId,
        anio_escolar: anioEscolar,
        grado_cursado: alumno.grado,
        nivel: alumno.nivel_actual || this.getNivelDeGrado(alumno.grado),
        carrera: alumno.carrera,
        promovido: true,
        observaciones: 'Graduado'
      }
    });
    
    logger.info({ alumnoId, grado: alumno.grado }, 'Alumno graduado');
  },

  /**
   * Retirar alumno
   */
  async retirarAlumno(alumnoId, motivo, fecha = new Date()) {
    await prisma.alumno.update({
      where: { id: alumnoId },
      data: {
        estado: 'retirado',
        motivo_baja: motivo,
        fecha_baja: fecha
      }
    });
    
    logger.info({ alumnoId, motivo }, 'Alumno retirado');
  },

  /**
   * Migración masiva de fin de año
   */
  async migracionFinDeAnio(anioEscolar) {
    const alumnosActivos = await prisma.alumno.findMany({
      where: { estado: 'activo' }
    });
    
    const ids = alumnosActivos.map(a => a.id);
    return await this.promoverAlumnos(ids, anioEscolar);
  },

  /**
   * Preview de migración (sin ejecutar)
   */
  async previewMigracion(anioEscolar) {
    const alumnosActivos = await prisma.alumno.findMany({
      where: { estado: 'activo' }
    });
    
    const preview = {
      promociones: {},
      graduaciones: [],
      total: alumnosActivos.length
    };
    
    for (const alumno of alumnosActivos) {
      const siguienteGrado = this.getSiguienteGrado(
        alumno.grado,
        alumno.carrera
      );
      
      if (siguienteGrado === 'GRADUADO') {
        preview.graduaciones.push({
          id: alumno.id,
          nombre: `${alumno.nombres} ${alumno.apellidos}`,
          grado: alumno.grado,
          carrera: alumno.carrera
        });
      } else if (siguienteGrado) {
        const key = `${alumno.grado} → ${siguienteGrado}`;
        if (!preview.promociones[key]) {
          preview.promociones[key] = [];
        }
        preview.promociones[key].push({
          id: alumno.id,
          nombre: `${alumno.nombres} ${alumno.apellidos}`
        });
      }
    }
    
    return preview;
  },

  /**
   * Obtener historial académico de un alumno
   */
  async getHistorialAlumno(alumnoId) {
    return await prisma.historialAcademico.findMany({
      where: { alumno_id: alumnoId },
      orderBy: { anio_escolar: 'asc' }
    });
  },

  /**
   * Determina el nivel educativo de un grado
   */
  getNivelDeGrado(grado) {
    if (grado.includes('Primaria')) return 'Primaria';
    if (grado.includes('Básico')) return 'Básicos';
    if (grado.includes('Diversificado') || grado.includes('Graduandos')) return 'Diversificado';
    if (grado.includes('Secundaria')) return 'Secundaria';
    if (grado.includes('Preparatoria')) return 'Preparatoria';
    return 'Otro';
  },


  /**
   * Verifica el estado de migración de un ciclo escolar
   * Retorna si hay migración pendiente y el detalle de qué alumnos se verían afectados
   * @param {number} anioEscolar - Año escolar a verificar (ej: 2026)
   */
  async estadoMigracion(anioEscolar) {
    // 1. Total de alumnos activos
    const alumnosActivos = await prisma.alumno.findMany({
      where: { estado: 'activo' },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        grado: true,
        seccion: true,
        carrera: true,
        nivel_actual: true
      }
    });

    // 2. Alumnos que YA tienen historial de este año (ya migrados)
    const yaHistorial = await prisma.historialAcademico.findMany({
      where: { anio_escolar: anioEscolar },
      select: { alumno_id: true }
    });
    const idsYaMigrados = new Set(yaHistorial.map(h => h.alumno_id));

    // 3. Alumnos SIN historial del año (pendientes de migrar)
    const alumnosPendientes = alumnosActivos.filter(a => !idsYaMigrados.has(a.id));

    // 4. Si no hay pendientes, la migración ya está completa
    const migracionPendiente = alumnosPendientes.length > 0;

    // 5. Calcular preview de lo que ocurriría con cada alumno pendiente
    const preview = {
      promociones: [],   // Alumnos que subirían de grado
      graduaciones: [],  // Alumnos que se graduarían
      sinRegla: []       // Alumnos cuyo grado no tiene regla de promoción definida
    };

    for (const alumno of alumnosPendientes) {
      const siguienteGrado = this.getSiguienteGrado(alumno.grado, alumno.carrera);

      if (siguienteGrado === 'GRADUADO') {
        preview.graduaciones.push({
          id: alumno.id,
          nombre: `${alumno.nombres} ${alumno.apellidos}`,
          grado: alumno.grado,
          carrera: alumno.carrera || null,
          seccion: alumno.seccion || ''
        });
      } else if (siguienteGrado) {
        preview.promociones.push({
          id: alumno.id,
          nombre: `${alumno.nombres} ${alumno.apellidos}`,
          gradoActual: alumno.grado,
          gradoSiguiente: siguienteGrado,
          seccion: alumno.seccion || '',
          carrera: alumno.carrera || null
        });
      } else {
        preview.sinRegla.push({
          id: alumno.id,
          nombre: `${alumno.nombres} ${alumno.apellidos}`,
          grado: alumno.grado,
          seccion: alumno.seccion || ''
        });
      }
    }

    // 6. Agrupar promociones por transición para el resumen
    const resumenPromocion = {};
    for (const p of preview.promociones) {
      const key = `${p.gradoActual} → ${p.gradoSiguiente}`;
      if (!resumenPromocion[key]) resumenPromocion[key] = 0;
      resumenPromocion[key]++;
    }

    return {
      migracionPendiente,
      totalActivos: alumnosActivos.length,
      totalPendientes: alumnosPendientes.length,
      totalYaMigrados: idsYaMigrados.size,
      preview,
      resumenPromocion
    };
  },

};

module.exports = migracionService;

