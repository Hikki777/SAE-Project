/**
 * Test del endpoint /api/excusas
 * Simular la llamada que hace el frontend
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const prisma = require('../backend/prismaClient');

async function testEndpoint() {
  try {
    console.log('🧪 TEST DEL ENDPOINT /api/excusas\n');

    const hoy = new Date();
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const fechaHoy = formatDate(hoy);
    console.log(`Fecha actual: ${fechaHoy}\n`);

    // Simular los parámetros que envía el frontend
    const params = {
      fechaInicio: fechaHoy,
      fechaFin: fechaHoy
    };

    console.log('📡 Parámetros enviados al endpoint:', params, '\n');

    // Simular la lógica del endpoint
    const where = {};

    if (params.fechaInicio || params.fechaFin) {
      where.fecha_ausencia = {};
      if (params.fechaInicio) {
        const [year, month, day] = params.fechaInicio.split('-');
        const start = new Date(year, month - 1, day, 0, 0, 0, 0);
        where.fecha_ausencia.gte = start;
        console.log(`✓ Fecha inicio procesada: ${start.toLocaleString('es-ES')}`);
      }
      if (params.fechaFin) {
        const [year, month, day] = params.fechaFin.split('-');
        const end = new Date(year, month - 1, day, 23, 59, 59, 999);
        where.fecha_ausencia.lte = end;
        console.log(`✓ Fecha fin procesada: ${end.toLocaleString('es-ES')}`);
      }
    }

    console.log('\n📋 WHERE clause:', JSON.stringify(where, null, 2), '\n');

    // Ejecutar query
    const excusas = await prisma.excusa.findMany({
      where,
      include: {
        alumno: { 
          select: { 
            nombres: true, 
            apellidos: true, 
            carnet: true
          } 
        },
        personal: { 
          select: { 
            nombres: true, 
            apellidos: true, 
            carnet: true
          } 
        },
      },
      orderBy: { fecha_ausencia: 'desc' },
    });

    console.log(`✓ Resultados de la query: ${excusas.length} excusas\n`);

    if (excusas.length > 0) {
      console.log('📊 Detalle de excusas retornadas:');
      excusas.forEach((e, i) => {
        const persona = e.alumno || e.personal;
        console.log(`${i + 1}. ${persona?.nombres} ${persona?.apellidos}`);
        console.log(`   - Motivo: ${e.motivo}`);
        console.log(`   - Estado: ${e.estado}`);
        console.log(`   - Fecha Ausencia (DB): ${e.fecha_ausencia}`);
        console.log(`   - Fecha Ausencia (local): ${new Date(e.fecha_ausencia).toLocaleDateString('es-ES')}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testEndpoint();
