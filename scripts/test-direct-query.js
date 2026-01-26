/**
 * Test directo de los datos de excusas en la base de datos
 * node scripts/test-direct-query.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const prisma = require('../backend/prismaClient');

async function main() {
  try {
    console.log('📊 VERIFICACIÓN DIRECTA DE DATOS DE EXCUSAS\n');

    // 1. Contar excusas totales
    const totalExcusas = await prisma.excusa.count();
    console.log(`Total de excusas en BD: ${totalExcusas}`);

    // 2. Mostrar todas las excusas
    const excusas = await prisma.excusa.findMany({
      include: {
        alumno: { select: { nombres: true, apellidos: true, carnet: true } },
        personal: { select: { nombres: true, apellidos: true, carnet: true } }
      }
    });

    if (excusas.length === 0) {
      console.log('\n❌ No hay excusas en la base de datos');
    } else {
      console.log(`\n✓ Listado de ${excusas.length} excusas:\n`);
      excusas.forEach((e, idx) => {
        const persona = e.alumno || e.personal;
        console.log(`${idx + 1}. ${persona?.nombres || 'N/A'} ${persona?.apellidos || 'N/A'}`);
        console.log(`   - ID: ${e.id}`);
        console.log(`   - Motivo: ${e.motivo}`);
        console.log(`   - Estado: ${e.estado}`);
        console.log(`   - Fecha Ausencia: ${e.fecha_ausencia ? new Date(e.fecha_ausencia).toLocaleDateString('es-ES') : 'N/A'}`);
        console.log(`   - Fecha Registro: ${new Date(e.fecha).toLocaleString('es-ES')}`);
        console.log('');
      });
    }

    // 3. Contar por estado
    const porEstado = await prisma.excusa.groupBy({
      by: ['estado'],
      _count: true
    });

    console.log('📈 Estadísticas por estado:');
    porEstado.forEach(item => {
      console.log(`  • ${item.estado}: ${item._count}`);
    });

    // 4. Test de filtro por fecha (HOY)
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    const excusasHoy = await prisma.excusa.findMany({
      where: {
        fecha_ausencia: {
          gte: inicio,
          lte: fin
        }
      }
    });

    console.log(`\n🎯 Excusas de HOY (${inicio.toLocaleDateString('es-ES')}): ${excusasHoy.length}`);

    // 5. Test de fecha en específico
    console.log('\n📅 Rangos de fechas encontrados:');
    const fechasUnicas = [...new Set(excusas.map(e => {
      const d = new Date(e.fecha_ausencia);
      return d.toLocaleDateString('es-ES');
    }))].sort();
    
    fechasUnicas.forEach(fecha => {
      const count = excusas.filter(e => new Date(e.fecha_ausencia).toLocaleDateString('es-ES') === fecha).length;
      console.log(`  • ${fecha}: ${count} excusa(s)`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
