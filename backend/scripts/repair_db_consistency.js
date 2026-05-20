const { PrismaClient } = require('../prisma-client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function repairDataConsistency(prismaInstance = null) {
  const prismaToUse = prismaInstance || prisma;

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║  DEPRECATED - ÚLTIMA VERSIÓN CON SOPORTE: SAE v1.1.7           ║
  // ║  Este script migra datos de BDs anteriores a v1.1.7:           ║
  // ║   - Géneros abreviados (M/F → Masculino/Femenino) [v1.0.x]     ║
  // ║   - Nomenclatura "6to. Diversificado" → "Graduandos" [v1.0.x]  ║
  // ║   - Roles legacy (administrador/superadmin) → admin [v1.0.x]   ║
  // ║   - Usernames nulos → auto-generados [v1.1.x]                  ║
  // ║   - Master recovery key faltante [v1.1.5]                      ║
  // ║  A partir de v1.2.0 este archivo sera eliminado completamente.  ║
  // ╚══════════════════════════════════════════════════════════════════╝
  console.log('--- [LEGACY v1.0-v1.1.6] Starting Database Data Consistency Repair (Last supported version: v1.1.7) ---');

  try {
    // 1. Repair Genders
    const genderMap = {
      'M': 'Masculino',
      'F': 'Femenino',
      'm': 'Masculino',
      'f': 'Femenino'
    };

    const tables = ['alumno', 'personal'];
    
    for (const table of tables) {
      console.log(`Checking genders in table: ${table}...`);
      const records = await prismaToUse[table].findMany({
        where: {
          OR: [
            { sexo: { in: ['M', 'F', 'm', 'f'] } },
            { sexo: null },
            { sexo: '' }
          ]
        }
      });

      console.log(`  Found ${records.length} records to update.`);
      for (const record of records) {
        let newSexo = record.sexo;
        if (genderMap[record.sexo]) {
          newSexo = genderMap[record.sexo];
        } else if (!record.sexo) {
          // Default for Admin or others if null
          newSexo = 'Masculino'; 
        }

        if (newSexo !== record.sexo) {
          await prismaToUse[table].update({
            where: { id: record.id },
            data: { sexo: newSexo }
          });
        }
      }
    }

    // 2. Nomenclature: 6to. Diversificado -> Graduandos
    console.log('Updating nomenclature: 6to. Diversificado -> Graduandos...');
    
    const alumnos6to = await prismaToUse.alumno.updateMany({
      where: { grado: '6to. Diversificado' },
      data: { grado: 'Graduandos' }
    });
    console.log(`  Updated ${alumnos6to.count} alumnos.`);

    const personal6to = await prismaToUse.personal.updateMany({
      where: { grado_guia: '6to. Diversificado' },
      data: { grado_guia: 'Graduandos' }
    });
    console.log(`  Updated ${personal6to.count} personal guia.`);

    // 3. User Roles Migration
    console.log('Migrating User Roles to strictly admin and operador...');
    
    // Elevate any "administrador", "superadmin", etc to "admin"
    const adminsMigrated = await prismaToUse.usuario.updateMany({
      where: {
        rol: {
          in: ['administrador', 'superadmin', 'root']
        }
      },
      data: { rol: 'admin' }
    });
    console.log(`  Elevated ${adminsMigrated.count} deprecated admin roles to 'admin'.`);

    // Downgrade any other non-admin role to 'operador' (failsafe)
    const operadoresMigrated = await prismaToUse.usuario.updateMany({
      where: {
        rol: {
          notIn: ['admin', 'operador']
        }
      },
      data: { rol: 'operador' }
    });
    console.log(`  Downgraded ${operadoresMigrated.count} unknown roles to 'operador'.`);

    console.log('--- Database Repair Completed ---');

    // 4. Fix Usernames for older databases
    console.log('Verificando usernames para usuarios antiguos...');
    const usersWithoutUsername = await prismaToUse.usuario.findMany({
      where: { username: null, email: { not: null } }
    });
    
    if (usersWithoutUsername.length > 0) {
      for (const user of usersWithoutUsername) {
        // Extract prefix from email or use a fallback
        let baseUsername = user.email.split('@')[0];
        // Ensure uniqueness roughly
        let finalUsername = baseUsername;
        let count = 1;
        while (true) {
          const exists = await prismaToUse.usuario.findUnique({ where: { username: finalUsername }});
          if (!exists) break;
          finalUsername = `${baseUsername}${count}`;
          count++;
        }
        await prismaToUse.usuario.update({
          where: { id: user.id },
          data: { username: finalUsername }
        });
      }
      console.log(`  Asignados nombres de usuario a ${usersWithoutUsername.length} cuentas antiguas.`);
    }

    // 5. Generate Master Recovery Key if missing (Legacy Databases)
    console.log('Verificando Llave Maestra de Recuperación...');
    const institucion = await prismaToUse.institucion.findFirst({ where: { id: 1 } });
    if (institucion && !institucion.master_recovery_key) {
      console.log('  [ALERTA] Institución legacy detectada sin Llave Maestra. Generando auto-rescate...');
      const masterRecoveryKey =
        Math.random().toString(36).substring(2, 8).toUpperCase() +
        Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const hash = await bcrypt.hash(masterRecoveryKey, 10);
      
      await prismaToUse.institucion.update({
        where: { id: 1 },
        data: { master_recovery_key: hash, inicializado: true }
      });

      // Guardar la llave en un archivo de texto en la raíz del proyecto para que el administrador la encuentre
      const txtPath = path.resolve(process.cwd(), 'SAE_LLAVE_RECUPERACION_AUTOMATICA.txt');
      const textContent = `LLAVE MAESTRA DE RECUPERACIÓN (GENERADA AUTOMÁTICAMENTE)
========================================================

El sistema detectó que esta base de datos es de una versión anterior y no poseía una Llave Maestra de Recuperación.

Llave generada: ${masterRecoveryKey}
Fecha: ${new Date().toLocaleString('es-GT')}

IMPORTANTE: 
- Guarda esta llave en un lugar seguro.
- Necesitarás esta llave para recuperar el acceso si olvidas la contraseña del Administrador.
- NO compartas este archivo con nadie.

Sistema de Administración Educativa (SAE)
`;
      fs.writeFileSync(txtPath, textContent, 'utf-8');
      console.log(`  [OK] Llave maestra generada y guardada en: ${txtPath}`);
    } else if (institucion) {
      console.log('  Llave Maestra presente. Todo en orden.');
    }
  } finally {
    if (!prismaInstance) {
      await prismaToUse.$disconnect();
    }
  }
}

if (require.main === module) {
  repairDataConsistency().catch(err => {
    console.error('Fatal error during repair:', err);
    process.exit(1);
  });
}

module.exports = { repairDataConsistency };
