#!/usr/bin/env node
/**
 * Script para crear o actualizar usuario administrador
 * Sistema de Registro Institucional
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function crearAdmin() {
  try {
    console.log('\n================================================================================');
    console.log('  [ADMIN] Crear/Actualizar Usuario Administrador');
    console.log('================================================================================\n');
    
    // Pedir email (con default)
    const email = await question('[INPUT] Email (admin@test.edu): ') || 'admin@test.edu';
    
    // Pedir contraseña (con default)
    const password = await question('[INPUT] Contrasena (admin123): ') || 'admin123';
    
    // Verificar si ya existe
    const existente = await prisma.usuario.findUnique({
      where: { email }
    });

    const hash = await bcrypt.hash(password, 10);

    if (existente) {
      console.log(`\n[WARN] Usuario ${email} ya existe`);
      
      // Obtener la llave maestra de la base de datos
      const institucion = await prisma.institucion.findFirst({ where: { id: 1 } });
      
      if (!institucion || !institucion.master_recovery_key) {
        console.error('[ERROR] No se ha configurado una llave maestra de recuperación.');
        process.exit(1);
      }

      console.log('\n--------------------------------------------------------------------------------');
      console.log('  [SECURITY] Verificacion de Identidad Requerida');
      console.log('--------------------------------------------------------------------------------');
      const inputKey = await question('[INPUT] Ingrese la Llave Maestra de Recuperacion: ');

      if (inputKey !== institucion.master_recovery_key) {
        console.error('\n[ERROR] Llave Maestra incorrecta. Operacion denegada.');
        process.exit(1);
      }

      const actualizar = await question('\n[OK] Llave verificada. ¿Actualizar contrasena? (S/n): ') || 'S';
      
      if (actualizar.toUpperCase() === 'S') {
        await prisma.usuario.update({
          where: { email },
          data: {
            hash_pass: hash,
            activo: true
          }
        });
        
        console.log('\n[OK] Contrasena actualizada exitosamente');
      } else {
        console.log('\n[INFO] Operacion cancelada');
      }
    } else {
      console.log(`\n[INFO] Creando usuario ${email}...`);
      
      const usuario = await prisma.usuario.create({
        data: {
          email,
          hash_pass: hash,
          rol: 'admin',
          activo: true
        }
      });
      
      console.log('[OK] Usuario creado exitosamente');
      console.log(`[ID] ID: ${usuario.id}`);
    }

    console.log('\n================================================================================');
    console.log('  [CREDENTIALS] Credenciales de Acceso');
    console.log('================================================================================');
    console.log(`  [EMAIL] Email:      ${email}`);
    console.log(`  [PASS] Contrasena: ${password}`);
    console.log(`  [ROLE] Rol:        admin`);
    console.log('================================================================================');
    console.log('  [LOGIN] Inicia sesion en: http://localhost:5173');
    console.log('================================================================================\n');
    
  } catch (error) {
    console.error('\n[ERROR] Error:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

crearAdmin();
