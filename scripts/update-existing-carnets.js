/**
 * Script para actualizar carnets existentes al nuevo sistema de secuencia dual
 * 
 * Este script:
 * 1. Obtiene todo el personal y alumnos existentes
 * 2. Los ordena por ID (orden de creación)
 * 3. Reasigna carnets según la nueva secuencia dual
 * 4. Actualiza los carnets en la base de datos
 * 5. Regenera los códigos QR con los nuevos carnets
 * 
 * IMPORTANTE: Ejecutar solo una vez
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs-extra');
const qrcode = require('qrcode');
const { getCarnetPrefix } = require('../backend/utils/carnetGenerator');

const prisma = new PrismaClient();

async function regenerarQR(personaTipo, personaId, carnet) {
  try {
    // Generar token único para el QR
    const token = `${personaTipo}-${personaId}-${Date.now()}`;
    
    // Determinar directorio de QRs
    const qrDir = path.join(__dirname, '..', 'uploads', 'qrs');
    await fs.ensureDir(qrDir);
    
    // Generar archivo QR
    const qrFilename = `qr-${carnet.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    const qrPath = path.join(qrDir, qrFilename);
    
    await qrcode.toFile(qrPath, token, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Actualizar o crear registro en la BD
    const existingQR = await prisma.codigoQr.findFirst({
      where: {
        persona_tipo: personaTipo,
        ...(personaTipo === 'alumno' ? { alumno_id: personaId } : { personal_id: personaId })
      }
    });
    
    if (existingQR) {
      // Actualizar QR existente
      await prisma.codigoQr.update({
        where: { id: existingQR.id },
        data: {
          token,
          png_path: `/qrs/${qrFilename}`,
          vigente: true,
          regenerado_en: new Date()
        }
      });
    } else {
      // Crear nuevo QR
      await prisma.codigoQr.create({
        data: {
          persona_tipo: personaTipo,
          ...(personaTipo === 'alumno' ? { alumno_id: personaId } : { personal_id: personaId }),
          token,
          png_path: `/qrs/${qrFilename}`,
          vigente: true
        }
      });
    }
    
    return qrFilename;
  } catch (error) {
    console.error(`Error regenerando QR para ${personaTipo} ${personaId}:`, error.message);
    throw error;
  }
}

async function updateExistingCarnets() {
  console.log('🔄 Iniciando actualización de carnets existentes...\n');

  try {
    // Obtener institución
    const institucion = await prisma.institucion.findFirst();
    if (!institucion) {
      throw new Error('No se encontró la institución');
    }

    const year = institucion.ciclo_escolar || new Date().getFullYear();
    
    // PASO 1: Actualizar Personal
    console.log('📋 PASO 1: Actualizando carnets de Personal\n');
    
    const todoPersonal = await prisma.personal.findMany({
      orderBy: { id: 'asc' }, // Orden de creación
      select: { id: true, carnet: true, cargo: true, nombres: true, apellidos: true }
    });
    
    console.log(`   Encontrados: ${todoPersonal.length} miembros del personal\n`);
    
    let personalCounter = 0;
    const personalUpdates = [];
    
    for (const persona of todoPersonal) {
      personalCounter++;
      const prefix = getCarnetPrefix(persona.cargo);
      const nuevoCarnet = `${prefix}-${year}${String(personalCounter).padStart(3, '0')}`;
      
      if (persona.carnet !== nuevoCarnet) {
        console.log(`   ${persona.nombres} ${persona.apellidos}`);
        console.log(`   └─ ${persona.carnet} → ${nuevoCarnet}`);
        
        personalUpdates.push({
          id: persona.id,
          carnetAnterior: persona.carnet,
          carnetNuevo: nuevoCarnet
        });
      }
    }
    
    // Actualizar carnets de personal
    console.log('\n   💾 Actualizando base de datos...');
    for (const update of personalUpdates) {
      await prisma.personal.update({
        where: { id: update.id },
        data: { carnet: update.carnetNuevo }
      });
      
      // Regenerar QR
      await regenerarQR('personal', update.id, update.carnetNuevo);
    }
    
    console.log(`   ✅ ${personalUpdates.length} carnets de personal actualizados\n`);
    
    // Actualizar contador de personal en institución
    await prisma.institucion.update({
      where: { id: institucion.id },
      data: { carnet_counter_personal: personalCounter }
    });
    
    console.log(`   📊 Contador de personal actualizado: ${personalCounter}\n`);
    
    // PASO 2: Actualizar Alumnos
    console.log('📋 PASO 2: Actualizando carnets de Alumnos\n');
    
    const todosAlumnos = await prisma.alumno.findMany({
      orderBy: { id: 'asc' }, // Orden de creación
      select: { id: true, carnet: true, nombres: true, apellidos: true }
    });
    
    console.log(`   Encontrados: ${todosAlumnos.length} alumnos\n`);
    
    let alumnoCounter = 0;
    const alumnoUpdates = [];
    
    for (const alumno of todosAlumnos) {
      alumnoCounter++;
      const nuevoCarnet = `A-${year}${String(alumnoCounter).padStart(3, '0')}`;
      
      if (alumno.carnet !== nuevoCarnet) {
        console.log(`   ${alumno.nombres} ${alumno.apellidos}`);
        console.log(`   └─ ${alumno.carnet} → ${nuevoCarnet}`);
        
        alumnoUpdates.push({
          id: alumno.id,
          carnetAnterior: alumno.carnet,
          carnetNuevo: nuevoCarnet
        });
      }
    }
    
    // Actualizar carnets de alumnos
    console.log('\n   💾 Actualizando base de datos...');
    for (const update of alumnoUpdates) {
      await prisma.alumno.update({
        where: { id: update.id },
        data: { carnet: update.carnetNuevo }
      });
      
      // Regenerar QR
      await regenerarQR('alumno', update.id, update.carnetNuevo);
    }
    
    console.log(`   ✅ ${alumnoUpdates.length} carnets de alumnos actualizados\n`);
    
    // Actualizar contador de alumnos en institución
    await prisma.institucion.update({
      where: { id: institucion.id },
      data: { carnet_counter_alumnos: alumnoCounter }
    });
    
    console.log(`   📊 Contador de alumnos actualizado: ${alumnoCounter}\n`);
    
    // RESUMEN
    console.log('📊 RESUMEN DE ACTUALIZACIÓN:\n');
    console.log(`   Personal:`);
    console.log(`   ├─ Total: ${todoPersonal.length}`);
    console.log(`   ├─ Actualizados: ${personalUpdates.length}`);
    console.log(`   └─ Contador final: ${personalCounter}\n`);
    
    console.log(`   Alumnos:`);
    console.log(`   ├─ Total: ${todosAlumnos.length}`);
    console.log(`   ├─ Actualizados: ${alumnoUpdates.length}`);
    console.log(`   └─ Contador final: ${alumnoCounter}\n`);
    
    console.log('🎉 Actualización completada exitosamente!\n');

  } catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
    console.error(error.stack);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar actualización
if (require.main === module) {
  updateExistingCarnets()
    .then(() => {
      console.log('✅ Script finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { updateExistingCarnets };
