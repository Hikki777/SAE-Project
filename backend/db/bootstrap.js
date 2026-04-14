/**
 * Bootstrap de Base de Datos
 * 
 * Se ejecuta automáticamente en el startup del backend
 * - En desarrollo: Se ejecuta silenciosamente si hay migraciones pendientes vía Prisma
 * - En producción (Electron): Ejecuta auto-reparación de esquema para actualizaciones de versión
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isElectron = !!process.env.RESOURCES_PATH || !!process.env.ELECTRON_RUN_AS_NODE;

/**
 * Log wrapper
 */
function log(msg, type = 'info') {
  const prefix = {
    info: '[DB-INIT]',
    success: '[DB-INIT✓]',
    warn: '[DB-INIT⚠]',
    error: '[DB-INIT✗]'
  }[type];

  if (isDev || type === 'error' || type === 'warn') {
    console.log(`${prefix} ${msg}`);
  }
}

/**
 * Inicializar la base de datos
 * En Electron: Ejecuta auto-reparación de esquema si faltan columnas (Upgrades)
 * En desarrollo: Aplica migraciones pendientes
 */
async function initializeDatabase() {
  const prisma = require('../prismaClient');

  // 1. MODO PRODUCCIÓN (ELECTRON): Auto-reparación de esquema
  // Útil para actualizaciones de versión donde no hay npx
  if (isElectron) {
    log('Verificando consistencia de esquema (Modo Producción)...', 'info');
    
    try {
      // Reparar Tabla Institucion
      await repairTable(prisma, 'institucion', [
        { name: 'ciclo_escolar', type: 'INTEGER DEFAULT 2026' },
        { name: 'carnet_counter_global', type: 'INTEGER DEFAULT 0' },
        { name: 'carnet_counter_personal', type: 'INTEGER DEFAULT 0' },
        { name: 'carnet_counter_alumnos', type: 'INTEGER DEFAULT 0' },
        { name: 'master_recovery_key', type: 'TEXT' }
      ]);

      // Reparar Tabla Usuarios
      await repairTable(prisma, 'usuarios', [
        { name: 'sexo', type: "TEXT DEFAULT 'Masculino'" },
        { name: 'foto_path', type: 'TEXT' },
        { name: 'cargo', type: 'TEXT' },
        { name: 'jornada', type: 'TEXT' }
      ]);

      // Reparar Tabla Alumnos
      await repairTable(prisma, 'alumnos', [
        { name: 'sexo', type: "TEXT DEFAULT 'Masculino'" },
        { name: 'foto_path', type: 'TEXT' },
        { name: 'nivel_actual', type: 'TEXT' },
        { name: 'grado', type: 'TEXT' },
        { name: 'seccion', type: 'TEXT' }
      ]);

      // Reparar Tabla Personal
      await repairTable(prisma, 'personal', [
        { name: 'sexo', type: "TEXT DEFAULT 'Masculino'" },
        { name: 'foto_path', type: 'TEXT' },
        { name: 'cargo', type: 'TEXT' },
        { name: 'jornada', type: 'TEXT' },
        { name: 'curso', type: 'TEXT' }
      ]);

      // Reparar Tabla CodigosQr (PNG path y vigente)
      await repairTable(prisma, 'codigos_qr', [
        { name: 'png_path', type: 'TEXT' },
        { name: 'vigente', type: 'BOOLEAN DEFAULT 1' }
      ]);

      // Reparar Tabla Excusas
      await repairTable(prisma, 'excusas', [
        { name: 'fecha_ausencia', type: 'DATETIME' },
        { name: 'documento_url', type: 'TEXT' }
      ]);

      log('Sincronización de esquema finalizada correctamente.', 'success');
    } catch (err) {
      log(`Error durante la auto-reparación: ${err.message}`, 'warn');
    }
    return true;
  }

  // 2. MODO DESARROLLO: Aplicar migraciones vía Prisma CLI
  if (isDev) {
    try {
      const projectRoot = path.resolve(__dirname, '..');
      log('Verificando estado de migraciones...', 'info');

      // Usar un timeout y shell:true para evitar bloqueos en Windows
      const execOptions = { 
        cwd: projectRoot, 
        encoding: 'utf-8', 
        stdio: 'pipe',
        shell: true, // Importante para Windows
        timeout: 15000 // 15 segundos máximo para chequear
      };

      let statusOutput = '';
      try {
        statusOutput = execSync('npx prisma migrate status 2>&1', execOptions);
      } catch (err) {
        log('No se pudo verificar estado con npx (posible bloqueo de políticas). Continuando...', 'warn');
        return true; 
      }

      if (statusOutput.includes('Pending migrations')) {
        log('Aplicando migraciones pendientes...', 'warn');
        
        try {
          execSync('npx prisma migrate deploy', { ...execOptions, timeout: 60000 });
          log('Migraciones aplicadas con éxito', 'success');
        } catch (e) {
          log('Fallo en migrate deploy, intentando db push...', 'warn');
          try {
            execSync('npx prisma db push --skip-generate', { ...execOptions, timeout: 60000 });
            log('Schema sincronizado vía db push', 'success');
          } catch (dbPushErr) {
            log(`Fallo crítico al sincronizar BD: ${dbPushErr.message}`, 'error');
          }
        }
      } else {
        log('Base de datos actualizada.', 'info');
      }
    } catch (e) {
      log('Error durante el bootstrap de desarrollo: ' + e.message, 'warn');
    }
  }

  return true;
}

/**
 * Función auxiliar para añadir columnas faltantes de forma segura en SQLite
 */
async function repairTable(prisma, tableName, columns) {
  try {
    const tableInfo = await prisma.$queryRawUnsafe(`PRAGMA table_info(${tableName})`);
    const existingColumns = tableInfo.map(c => c.name);

    for (const col of columns) {
      if (!existingColumns.includes(col.name)) {
        log(`Añadiendo columna faltante [${col.name}] a [${tableName}]...`, 'warn');
        await prisma.$executeRawUnsafe(`ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type}`);
      }
    }
  } catch (e) {
    log(`No se pudo reparar la tabla ${tableName}: ${e.message}`, 'error');
  }
}

module.exports = {
  initializeDatabase
};
