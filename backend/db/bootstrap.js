/**
 * Bootstrap de Base de Datos para SAE
 *
 * Estratégia de migración por entorno:
 * - PRODUCCIÓN (Electron): Ejecuta los archivos migration.sql empaquetados
 *   en resources/prisma/migrations, usando _prisma_migrations para control.
 *   Sin npx, sin CLI. 100% nativo.
 * - DESARROLLO: Usa Prisma CLI (npx prisma migrate deploy).
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isElectron = !!process.env.RESOURCES_PATH || !!process.env.ELECTRON_RUN_AS_NODE;

function log(msg, type = 'info') {
  const prefix = {
    info:    '[DB-INIT]',
    success: '[DB-INIT OK]',
    warn:    '[DB-INIT WARN]',
    error:   '[DB-INIT ERROR]'
  }[type] || '[DB-INIT]';
  console.log(`${prefix} ${msg}`);
}

// ─────────────────────────────────────────────────────────────
// MOTOR DE MIGRACIONES NATIVO (Electron / Sin Prisma CLI)
// ─────────────────────────────────────────────────────────────

/**
 * Asegura que la tabla de control _prisma_migrations existe.
 * Esta tabla es compatible con el formato que usa Prisma CLI,
 * lo que permite mezclar ambos métodos (dev CLI + prod nativo).
 */
async function ensureMigrationsTable(prisma) {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id"                  TEXT PRIMARY KEY NOT NULL,
      "checksum"            TEXT NOT NULL,
      "finished_at"         DATETIME,
      "migration_name"      TEXT NOT NULL,
      "logs"                TEXT,
      "rolled_back_at"      DATETIME,
      "started_at"          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )
  `);
}

/**
 * Retorna los nombres de migraciones ya aplicadas a esta BD.
 */
async function getAppliedMigrations(prisma) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL ORDER BY started_at ASC`
    );
    return rows.map(r => r.migration_name);
  } catch {
    return [];
  }
}

/**
 * Divide el SQL de una migración en sentencias individuales.
 * Maneja comentarios, PRAGMAs y bloques de redefinición de tabla.
 */
function splitSqlStatements(sql) {
  // Eliminar comentarios de línea (-- ...)
  const noComments = sql.replace(/--[^\n]*/g, '');
  // Dividir por punto y coma, filtrar líneas vacías
  return noComments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Ejecuta una migración SQL completa dentro de una transacción.
 * Registra el resultado en _prisma_migrations.
 */
async function applyMigration(prisma, migrationName, sqlContent) {
  const id = `${Date.now()}-${migrationName}`;
  const startedAt = new Date().toISOString();
  let DatabaseSync;

  try {
    DatabaseSync = require('node:sqlite').DatabaseSync;
  } catch (e) {
    DatabaseSync = null; // Fallback para versiones viejas de Node
  }

  log(`Aplicando migración: ${migrationName}`, 'warn');

  if (DatabaseSync && process.env.DATABASE_URL) {
    log(`  -> Usando driver nativo SQLite Seguro para transacciones (Anticorrupción)`);
    const dbPath = process.env.DATABASE_URL.replace('file:', '').trim();
    const db = new DatabaseSync(dbPath);
    
    try {
      // Forzamos desconexión de Foreign Keys previo a la transacción (vital para SQLite Drop Table)
      db.exec('PRAGMA foreign_keys=OFF;');
      db.exec('BEGIN EXCLUSIVE;');

      const statements = splitSqlStatements(sqlContent);
      let appliedSteps = 0;

      for (const stmt of statements) {
        // Ignoramos PRAGMAS conflictivos dentro de la transacción que arruinarían el bloqueo
        if (stmt.toUpperCase().includes('PRAGMA FOREIGN_KEYS=')) continue;
        
        try {
          db.exec(stmt);
          appliedSteps++;
        } catch (stmtErr) {
          const msg = (stmtErr.message || '').toLowerCase();
          const isDuplicate = msg.includes('already exists') || msg.includes('duplicate column');
          if (isDuplicate) {
            log(`    [SKIP] Objeto ya existe: ${stmt.substring(0, 50)}...`, 'info');
            appliedSteps++;
          } else {
            throw stmtErr;
          }
        }
      }

      const finishedAt = new Date().toISOString();
      const insertControl = `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, started_at, finished_at, applied_steps_count) 
                 VALUES ('${id}', 'native-sqlite', '${migrationName}', '${startedAt}', '${finishedAt}', ${appliedSteps})`;
      db.exec(insertControl);
      db.exec('COMMIT;');
      db.close();

      log(`Migración completada de forma 100% segura: ${migrationName} (${appliedSteps} sentencias)`, 'success');
      return;
    } catch (err) {
      db.exec('ROLLBACK;'); // ¡Salvavidas! Restaura la BD a su estado original si algo explota
      db.exec('PRAGMA foreign_keys=ON;');
      
      const safeErrorMsg = err.message.replace(/'/g, "''");
      const insertFail = `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, started_at, logs, applied_steps_count) 
                 VALUES ('${id}', 'native-sqlite', '${migrationName}', '${startedAt}', '${safeErrorMsg}', 0)`;
      db.exec(insertFail);
      db.close();

      log(`FALLO CRÍTICO en migración ${migrationName}: ${err.message}. ROLLBACK EJECUTADO (BD Protegida)`, 'error');
      throw err;
    }
  }

  // ============================================
  // FALLBACK: PRISMA EXEC (Sólo para Node < 22)
  // ============================================
  log(`  -> Advertencia: Usando fallback Prisma Exec (menos seguro)`, 'warn');
  try {
    // Registrar inicio
    await prisma.$executeRawUnsafe(
      `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, started_at, applied_steps_count)
       VALUES (?, ?, ?, ?, 0)`,
      id, 'fallback-runner', migrationName, startedAt
    );

    const statements = splitSqlStatements(sqlContent);
    let appliedSteps = 0;

    for (const stmt of statements) {
      try {
        await prisma.$executeRawUnsafe(stmt);
        appliedSteps++;
      } catch (stmtErr) {
        const msg = (stmtErr.message || '').toLowerCase();
        const isDuplicate = msg.includes('already exists') || msg.includes('duplicate column');
        if (isDuplicate) {
          log(`  [SKIP] Objeto ya existe: ${stmt.substring(0, 50)}...`, 'info');
          appliedSteps++;
        } else {
          throw stmtErr;
        }
      }
    }

    const finishedAt = new Date().toISOString();
    await prisma.$executeRawUnsafe(
      `UPDATE "_prisma_migrations" SET finished_at = ?, applied_steps_count = ? WHERE id = ?`,
      finishedAt, appliedSteps, id
    );

    log(`Migración completada (Fallback): ${migrationName}`, 'success');
  } catch (err) {
    await prisma.$executeRawUnsafe(
      `UPDATE "_prisma_migrations" SET logs = ? WHERE id = ?`,
      err.message, id
    ).catch(() => {});
    log(`FALLO en migración ${migrationName}: ${err.message}`, 'error');
    throw err;
  }
}

/**
 * Motor principal de migraciones para Electron.
 * Lee los archivos migration.sql empaquetados en resources/prisma/migrations
 * y aplica los que aún no han sido ejecutados sobre la BD del usuario.
 */
async function runNativeMigrations(prisma) {
  // Ruta a las migraciones empaquetadas en el instalador
  const resourcesPath = process.env.RESOURCES_PATH;
  const migrationsDir = path.join(resourcesPath, 'prisma', 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    log(`Directorio de migraciones no encontrado: ${migrationsDir}`, 'warn');
    log('Usando repairTable como fallback...', 'warn');
    return false; // Indicar que se debe usar el fallback
  }

  // Asegurar tabla de control
  await ensureMigrationsTable(prisma);

  // Obtener migraciones ya aplicadas
  const applied = await getAppliedMigrations(prisma);
  log(`Migraciones ya aplicadas: ${applied.length}`, 'info');

  // Leer directorio de migraciones y ordenar por nombre (tienen prefijo de timestamp)
  const migrationDirs = fs.readdirSync(migrationsDir)
    .filter(d => fs.statSync(path.join(migrationsDir, d)).isDirectory())
    .sort(); // Orden cronológico asegurado por el prefijo timestamp

  let pendingCount = 0;

  for (const dirName of migrationDirs) {
    if (applied.includes(dirName)) {
      log(`  [OK] ${dirName} (ya aplicada)`, 'info');
      continue;
    }

    const sqlFile = path.join(migrationsDir, dirName, 'migration.sql');
    if (!fs.existsSync(sqlFile)) {
      log(`  [SKIP] ${dirName} (sin migration.sql)`, 'info');
      continue;
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');
    await applyMigration(prisma, dirName, sqlContent);
    pendingCount++;
  }

  if (pendingCount === 0) {
    log('Base de datos al día. No hay migraciones pendientes.', 'success');
  } else {
    log(`${pendingCount} migración(ones) aplicadas exitosamente.`, 'success');
  }

  return true;
}

// ─────────────────────────────────────────────────────────────
// REPARACIÓN DE COLUMNAS (Fallback / Compatibilidad)
// ─────────────────────────────────────────────────────────────

async function repairTable(prisma, tableName, columns) {
  try {
    // Verificar que la tabla existe
    const tables = await prisma.$queryRawUnsafe(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      tableName
    );

    if (!tables || tables.length === 0) {
      log(`Tabla ${tableName} no existe (se creará vía migration). Omitiendo repairTable.`, 'info');
      return;
    }

    const tableInfo = await prisma.$queryRawUnsafe(`PRAGMA table_info(${tableName})`);
    const existingColumns = tableInfo.map(c => c.name);

    for (const col of columns) {
      if (!existingColumns.includes(col.name)) {
        log(`Añadiendo columna faltante [${col.name}] a [${tableName}]...`, 'warn');
        await prisma.$executeRawUnsafe(
          `ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type}`
        );
      }
    }
  } catch (e) {
    log(`No se pudo reparar la tabla ${tableName}: ${e.message}`, 'error');
  }
}

/**
 * Función auxiliar para crear tablas completas si no existen.
 * Usado para tablas que se añadieron después de las migraciones iniciales.
 */
async function repairCreateTable(prisma, tableName, createSQL) {
  try {
    const tables = await prisma.$queryRawUnsafe(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      tableName
    );

    if (!tables || tables.length === 0) {
      log(`Creando tabla faltante [${tableName}]...`, 'warn');
      await prisma.$executeRawUnsafe(createSQL);
      log(`Tabla [${tableName}] creada correctamente.`, 'success');
    }
  } catch (e) {
    log(`No se pudo crear la tabla ${tableName}: ${e.message}`, 'error');
  }
}
// ============================================================================
// FUNCIONES AUXILIARES DE REPARACIÓN
// ============================================================================

async function runEsquemaRepairs(prisma) {
  log('Ejecutando reparaciones de esquema previas...', 'info');
  // ── Tablas existentes: añadir columnas faltantes ──
  await repairTable(prisma, 'institucion', [
    { name: 'horario_salida',          type: 'TEXT' },
    { name: 'direccion',               type: 'TEXT' },
    { name: 'pais',                    type: 'TEXT' },
    { name: 'departamento',            type: 'TEXT' },
    { name: 'municipio',               type: 'TEXT' },
    { name: 'email',                   type: 'TEXT' },
    { name: 'telefono',                type: 'TEXT' },
    { name: 'ciclo_escolar',           type: 'INTEGER DEFAULT 2026' },
    { name: 'inicializado',            type: 'BOOLEAN DEFAULT 0' },
    { name: 'carnet_counter_global',   type: 'INTEGER DEFAULT 0' },
    { name: 'carnet_counter_personal', type: 'INTEGER DEFAULT 0' },
    { name: 'carnet_counter_alumnos',  type: 'INTEGER DEFAULT 0' },
    { name: 'master_recovery_key',     type: 'TEXT' }
  ]);

  await repairTable(prisma, 'alumnos', [
    { name: 'sexo',            type: 'TEXT' },
    { name: 'seccion',         type: 'TEXT' },
    { name: 'carrera',         type: 'TEXT' },
    { name: 'especialidad',    type: 'TEXT' },
    { name: 'anio_ingreso',    type: 'INTEGER' },
    { name: 'anio_graduacion', type: 'INTEGER' },
    { name: 'nivel_actual',    type: 'TEXT' },
    { name: 'motivo_baja',     type: 'TEXT' },
    { name: 'fecha_baja',      type: 'DATETIME' },
    { name: 'foto_path',       type: 'TEXT' }
  ]);

  await repairTable(prisma, 'personal', [
    { name: 'sexo',       type: 'TEXT' },
    { name: 'cargo',      type: 'TEXT' },
    { name: 'grado_guia', type: 'TEXT' },
    { name: 'foto_path',  type: 'TEXT' },
    { name: 'curso',      type: 'TEXT' }
  ]);

  await repairTable(prisma, 'usuarios', [
    { name: 'username',  type: 'TEXT' },
    { name: 'nombres',   type: 'TEXT' },
    { name: 'apellidos', type: 'TEXT' },
    { name: 'foto_path', type: 'TEXT' },
    { name: 'cargo',     type: 'TEXT' },
    { name: 'jornada',   type: 'TEXT' }
  ]);

  await repairTable(prisma, 'codigos_qr', [
    { name: 'png_path', type: 'TEXT' },
    { name: 'vigente',  type: 'BOOLEAN DEFAULT 1' }
  ]);

  // ── Tablas nuevas: crear si no existen ──
  await repairCreateTable(prisma, 'excusas', `
    CREATE TABLE IF NOT EXISTS "excusas" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "alumno_id" INTEGER,
      "personal_id" INTEGER,
      "motivo" TEXT NOT NULL,
      "descripcion" TEXT,
      "estado" TEXT NOT NULL DEFAULT 'pendiente',
      "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "fecha_ausencia" DATETIME,
      "documento_url" TEXT,
      "observaciones" TEXT,
      "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "actualizado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "excusas_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "excusas_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "personal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  await repairCreateTable(prisma, 'historial_academico', `
    CREATE TABLE IF NOT EXISTS "historial_academico" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "alumno_id" INTEGER NOT NULL,
      "anio_escolar" INTEGER NOT NULL,
      "grado_cursado" TEXT NOT NULL,
      "nivel" TEXT NOT NULL,
      "carrera" TEXT,
      "promovido" BOOLEAN NOT NULL DEFAULT true,
      "observaciones" TEXT,
      "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "historial_academico_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  await repairCreateTable(prisma, 'equipos', `
    CREATE TABLE IF NOT EXISTS "equipos" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nombre" TEXT,
      "hostname" TEXT,
      "ip" TEXT NOT NULL,
      "os" TEXT,
      "mac_address" TEXT,
      "aprobado" BOOLEAN NOT NULL DEFAULT false,
      "clave_seguridad" TEXT NOT NULL,
      "ultima_conexion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "actualizado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  log('Reparaciones de esquema completadas.', 'success');
}

// ─────────────────────────────────────────────────────────────
// ENTRADA PRINCIPAL
// ─────────────────────────────────────────────────────────────

async function initializeDatabase() {
  const prisma = require('../prismaClient');

  // ── MODO PRODUCCIÓN (ELECTRON) ──────────────────────────────
  if (isElectron) {
    log('Iniciando verificación de esquema (Modo Producción)...', 'info');

    try {
      // 1. PRE-PARCHEO: Asegurar que TODAS las columnas existan ANTES de que Prisma intente
      // copiar datos. Si una tabla antigua no tiene una columna, el SQLite INSERT INTO SELECT fallaría.
      await runEsquemaRepairs(prisma);

      // 2. Intentar motor nativo de migraciones (Para DDL Completo)
      const nativeOk = await runNativeMigrations(prisma);

      if (!nativeOk) {
        log('Advertencia: El directorio de migraciones no está disponible o falló.', 'warn');
      }
    } catch (err) {
      log(`Error crítico en inicialización de DB en producción: ${err.message}`, 'error');
      // NO matar el proceso — la app puede funcionar parcialmente
    }

    return true;
  }

  // ── MODO DESARROLLO ─────────────────────────────────────────
  if (isDev) {
    try {
      const projectRoot = path.resolve(__dirname, '..', '..');
      log('Verificando estado de migraciones (Modo Desarrollo)...', 'info');

      const execOptions = {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
        shell: true,
        timeout: 20000
      };

      let statusOutput = '';
      try {
        statusOutput = execSync('npx prisma migrate status 2>&1', execOptions);
      } catch (err) {
        log('No se pudo verificar estado con npx. Continuando...', 'warn');
        return true;
      }

      if (statusOutput.includes('Pending migrations')) {
        log('Migraciones pendientes encontradas. Aplicando...', 'warn');
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

  // --- REPARACIÓN DE CONSISTENCIA AUTOMÁTICA ---
  try {
    const { repairDataConsistency } = require('../scripts/repair_db_consistency');
    log('Verificando consistencia de datos...', 'info');
    await repairDataConsistency(prisma);
  } catch (err) {
    log('Error durante la reparación de consistencia: ' + err.message, 'warn');
  }

  return true;
}

module.exports = { initializeDatabase };
