const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient'); // Use shared client
const { verifyJWT } = require('../middlewares/auth');
const { logger } = require('../utils/logger'); // Ensure logger is imported if used

// Todas las rutas requieren autenticación
router.use(verifyJWT);

/**
 * GET /api/dashboard/stats
 * Obtiene estadísticas completas para el dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    // Obtener todos los alumnos con sus datos
    const alumnos = await prisma.alumno.findMany({
      select: {
        id: true,
        grado: true,
        nivel_actual: true,
        sexo: true,
        jornada: true, // Necesario para estadísticas por jornada
        estado: true, // FIXED: usar estado en lugar de activo
      }
    });

    // Helper para verificar activo
    const esActivo = (a) => a.estado === 'activo';

    // Log para debug
    console.log('📊 Dashboard Stats - Total alumnos:', alumnos.length);
    console.log('📊 Alumnos activos:', alumnos.filter(a => esActivo(a)).length);
    console.log('📊 Niveles únicos:', [...new Set(alumnos.map(a => a.nivel_actual))]);
    console.log('📊 Sexos únicos:', [...new Set(alumnos.map(a => a.sexo))]);

    // Estadísticas por nivel académico (case-insensitive)
    const porNivel = {
      primaria: alumnos.filter(a => a.nivel_actual?.toLowerCase() === 'primaria' && esActivo(a)).length,
      basicos: alumnos.filter(a => {
        const nivel = a.nivel_actual?.toLowerCase();
        return (nivel === 'básicos' || nivel === 'basicos' || nivel === 'básico' || nivel === 'basico') && esActivo(a);
      }).length,
      diversificado: alumnos.filter(a => a.nivel_actual?.toLowerCase() === 'diversificado' && esActivo(a)).length,
    };

    console.log('📊 Por Nivel:', porNivel);

    // Estadísticas por grado
    const gradosUnicos = [...new Set(alumnos.filter(a => esActivo(a)).map(a => a.grado))].sort();
    const porGrado = {};
    gradosUnicos.forEach(grado => {
      porGrado[grado] = alumnos.filter(a => a.grado === grado && esActivo(a)).length;
    });

    console.log('📊 Por Grado:', porGrado);

    // Estadísticas por sexo (case-insensitive y flexible)
    const porSexo = {
      masculino: alumnos.filter(a => {
        const sexo = a.sexo?.toUpperCase();
        return (sexo === 'M' || sexo === 'MASCULINO') && esActivo(a);
      }).length,
      femenino: alumnos.filter(a => {
        const sexo = a.sexo?.toUpperCase();
        return (sexo === 'F' || sexo === 'FEMENINO') && esActivo(a);
      }).length,
    };

    console.log('📊 Por Sexo:', porSexo);

    // Totales
    const totales = {
      activos: alumnos.filter(a => esActivo(a)).length,
      inactivos: alumnos.filter(a => !esActivo(a)).length,
      total: alumnos.length,
    };

    // Obtener personal con estadísticas detalladas
    const personalData = await prisma.personal.findMany({
      select: {
        id: true,
        sexo: true,
        cargo: true,
        jornada: true,
        estado: true,
      }
    });

    const personalActivo = personalData.filter(p => p.estado === 'activo');

    // Estadísticas de personal por sexo
    const personalPorSexo = {
      masculino: personalActivo.filter(p => {
        const sexo = p.sexo?.toUpperCase();
        return sexo === 'M' || sexo === 'MASCULINO';
      }).length,
      femenino: personalActivo.filter(p => {
        const sexo = p.sexo?.toUpperCase();
        return sexo === 'F' || sexo === 'FEMENINO';
      }).length,
    };

    // Estadísticas de personal por cargo
    const cargosUnicos = [...new Set(personalActivo.map(p => p.cargo).filter(Boolean))];
    const personalPorCargo = {};
    cargosUnicos.forEach(cargo => {
      personalPorCargo[cargo] = personalActivo.filter(p => p.cargo === cargo).length;
    });

    // Estadísticas de personal por jornada
    const jornadasUnicas = [...new Set(personalActivo.map(p => p.jornada).filter(Boolean))];
    const personalPorJornada = {};
    jornadasUnicas.forEach(jornada => {
      personalPorJornada[jornada] = personalActivo.filter(p => p.jornada === jornada).length;
    });

    // Estadísticas de alumnos por jornada
    const alumnosJornadasUnicas = [...new Set(alumnos.filter(a => esActivo(a)).map(a => a.jornada).filter(Boolean))];
    const alumnosPorJornada = {};
    alumnosJornadasUnicas.forEach(jornada => {
      alumnosPorJornada[jornada] = alumnos.filter(a => a.jornada === jornada && esActivo(a)).length;
    });

    console.log('📊 Personal por Sexo:', personalPorSexo);
    console.log('📊 Personal por Cargo:', personalPorCargo);
    console.log('📊 Personal por Jornada:', personalPorJornada);
    console.log('📊 Jornadas únicas de alumnos:', alumnosJornadasUnicas);
    console.log('📊 Alumnos por Jornada:', alumnosPorJornada);

    const personal = personalData.length;

    // Obtener asistencias del día
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const asistenciasHoy = await prisma.asistencia.count({
      where: {
        timestamp: {
          gte: hoy,
          lt: manana,
        }
      }
    });

    // QRs generados
    let qrsGenerados = 0;
    try {
      qrsGenerados = await prisma.codigoQr.count();
    } catch (qrErr) {
      logger.warn({ err: qrErr }, '[WARN] Error contando QRs');
    }

    // Excusas pendientes
    const excusasPendientes = await prisma.excusa.count({
      where: {
        estado: 'pendiente'
      }
    });

    // Tendencia semanal (últimos 7 días)
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    
    const asistenciasSemana = await prisma.asistencia.findMany({
      where: {
        timestamp: {
          gte: hace7Dias
        }
      },
      select: {
        timestamp: true,
        tipo_evento: true,
      }
    });

    // Agrupar por día
    const tendenciaSemanal = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      fecha.setHours(0, 0, 0, 0);
      
      const siguienteDia = new Date(fecha);
      siguienteDia.setDate(siguienteDia.getDate() + 1);
      
      const count = asistenciasSemana.filter(a => {
        const timestamp = new Date(a.timestamp);
        return timestamp >= fecha && timestamp < siguienteDia;
      }).length;
      
      tendenciaSemanal.push({
        fecha: fecha.toISOString().split('T')[0],
        asistencias: count
      });
    }

    // Tasa de asistencia promedio (últimos 30 días)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    
    const asistencias30Dias = await prisma.asistencia.count({
      where: {
        timestamp: {
          gte: hace30Dias
        },
        tipo_evento: 'entrada'
      }
    });

    const diasHabiles = 22; // Aproximado
    const alumnosActivos = totales.activos;
    const tasaAsistencia = alumnosActivos > 0 
      ? ((asistencias30Dias / (alumnosActivos * diasHabiles)) * 100).toFixed(1)
      : 0;

    res.json({
      porNivel,
      porGrado,
      porSexo,
      totales,
      personal,
      personalPorSexo,
      personalPorCargo,
      personalPorJornada,
      alumnosPorJornada,
      asistenciasHoy,
      qrsGenerados,
      excusasPendientes,
      tendenciaSemanal,
      tasaAsistencia: parseFloat(tasaAsistencia)
    });

  } catch (error) {
    logger.error({ err: error }, '[ERROR] Error obteniendo estadísticas');
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard', details: error.message, stack: error.stack });
  }
});

/**
 * GET /api/dashboard/top-grados
 * Obtiene los top 5 grados con mejor asistencia
 */
router.get('/top-grados', async (req, res) => {
  try {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    // Obtener todos los alumnos activos con sus asistencias
    const alumnos = await prisma.alumno.findMany({
      where: { estado: 'activo' }, // FIXED: usar estado en lugar de activo
      select: {
        grado: true,
        asistencias: {
          where: {
            timestamp: { gte: hace30Dias },
            tipo_evento: 'entrada'
          }
        }
      }
    });

    // Agrupar por grado
    const gradosMap = {};
    alumnos.forEach(alumno => {
      if (!gradosMap[alumno.grado]) {
        gradosMap[alumno.grado] = {
          grado: alumno.grado,
          totalAlumnos: 0,
          totalAsistencias: 0
        };
      }
      gradosMap[alumno.grado].totalAlumnos++;
      gradosMap[alumno.grado].totalAsistencias += alumno.asistencias.length;
    });

    // Calcular porcentaje y ordenar
    const gradosArray = Object.values(gradosMap).map(g => ({
      grado: g.grado,
      porcentaje: g.totalAlumnos > 0 
        ? ((g.totalAsistencias / (g.totalAlumnos * 22)) * 100).toFixed(1)
        : 0,
      alumnos: g.totalAlumnos
    })).sort((a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje));

    // Top 5
    const top5 = gradosArray.slice(0, 5);

    res.json({ topGrados: top5 });

  } catch (error) {
    console.error('Error obteniendo top grados:', error);
    res.status(500).json({ error: 'Error al obtener top grados' });
  }
});

module.exports = router;
