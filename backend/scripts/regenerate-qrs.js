/**
 * Script de Regeneración Masiva de QRs
 *
 * Uso: node backend/scripts/regenerate-qrs.js
 *
 * Delega en qrService.regenerarTodosLosQrs() para evitar duplicación de lógica.
 * El servicio obtiene automáticamente el logo desde la BD.
 */
const prisma = require('../prismaClient');
const qrService = require('../services/qrService');
const { logger } = require('../utils/logger');

async function main() {
  console.log('🚀 Iniciando regeneración masiva de QRs...');
  try {
    const { exito, error } = await qrService.regenerarTodosLosQrs();
    console.log('\n==========================================');
    console.log('🎉 Finalizado.');
    console.log(`✅ Exitosos: ${exito}`);
    console.log(`❌ Fallidos: ${error}`);
    console.log('==========================================\n');
  } catch (err) {
    console.error('❌ Error fatal en el script:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
