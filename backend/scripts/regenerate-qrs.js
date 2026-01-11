const prisma = require('../prismaClient');
const qrService = require('../services/qrService');
const { logger } = require('../utils/logger');
const path = require('path');
const fs = require('fs-extra');

async function regenerateAllQRs() {
  console.log('🚀 Iniciando regeneración masiva de QRs...');
  
  try {
    // 1. Obtener todos los QRs con su información de persona
    const qrs = await prisma.codigoQr.findMany({
      include: {
        alumno: true,
        personal: true
      }
    });

    console.log(`📊 Total de QRs encontrados: ${qrs.length}`);
    
    // Obtener logo institucional una vez
    const institucion = await prisma.institucion.findUnique({ where: { id: 1 } });
    const logoFuente = institucion?.logo_path || institucion?.logo_base64;

    if (!logoFuente) {
        console.error('❌ Error: No se encontró logo institucional');
        return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const qr of qrs) {
      try {
        const persona = qr.alumno || qr.personal;
        
        if (!persona) {
          console.warn(`⚠️ QR ID ${qr.id} huérfano (sin persona asociada). Saltando...`);
          continue;
        }

        const tipoNormalizado = qr.persona_tipo === 'personal' ? 'docente' : qr.persona_tipo;
        
        // 2. Crear nuevo payload JSON
        const tokenData = {
          tipo: tipoNormalizado,
          id: (qr.alumno_id || qr.personal_id),
          carnet: persona.carnet
        };
        const newToken = JSON.stringify(tokenData);

        // 3. Generar nueva imagen QR
        const { filename } = qrService.obtenerRutasQr(qr.persona_tipo, persona.carnet);
        
        console.log(`🔄 Procesando: ${persona.nombres} (${persona.carnet})...`);

        const qrUrl = await qrService.generarQrConLogo(
          newToken, 
          logoFuente, 
          filename
        );

        if (qrUrl) {
            // 4. Actualizar base de datos
            await prisma.codigoQr.update({
                where: { id: qr.id },
                data: {
                    token: newToken,
                    png_path: qrUrl,
                    regenerado_en: new Date()
                }
            });
            successCount++;
            console.log(`✅ OK: QR actualizado para ${persona.carnet}`);
        } else {
            throw new Error('Falló la generación de la imagen');
        }

      } catch (err) {
        console.error(`❌ Error procesando QR ID ${qr.id}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n==========================================');
    console.log(`🎉 Finalizado.`);
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Fallidos: ${errorCount}`);
    console.log('==========================================\n');

  } catch (error) {
    console.error('❌ Error fatal en el script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

regenerateAllQRs();
