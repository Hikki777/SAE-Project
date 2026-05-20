const { app, BrowserWindow, shell, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs-extra");
const os = require("os");

// SetupStateService — detecta primera ejecución y controla el SetupWizard
// Se importa aquí para que los handlers IPC estén disponibles antes de whenReady
let SetupStateService = null;
try {
  SetupStateService = require("./setupStateLoader");
} catch (_) {
  // En desarrollo, cargamos directamente
  try { SetupStateService = require("../backend/services/setupStateService"); } catch (__) {}
}

let mainWindow;
let backendProcess = null;
const DEFAULT_FALLBACK_PORT = 5000;
const isDev = !app.isPackaged;

// ─────────────────────────────────────────────
//  Handlers IPC — Setup Wizard
//  Se registran antes de whenReady para que estén listos desde el inicio
// ─────────────────────────────────────────────
ipcMain.handle('setup:should-show', async () => {
  if (!SetupStateService) return false;
  try {
    return await SetupStateService.shouldShowSetupWizard();
  } catch (err) {
    console.error('[IPC] Error en setup:should-show:', err.message);
    return false;
  }
});

ipcMain.handle('setup:complete', async () => {
  if (!SetupStateService) return { success: false, error: 'Service unavailable' };
  try {
    await SetupStateService.markSetupComplete();
    return { success: true };
  } catch (err) {
    console.error('[IPC] Error en setup:complete:', err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('setup:get-state', async () => {
  if (!SetupStateService) return null;
  try {
    return await SetupStateService.getSetupState();
  } catch (err) {
    console.error('[IPC] Error en setup:get-state:', err.message);
    return null;
  }
});


// ─────────────────────────────────────────────
//  Configuración Global de Electron
// ─────────────────────────────────────────────
// Forzar userData a %APPDATA%\SAE — nombre simple sin espacios ni acentos
// Se hace fuera de whenReady para evitar que Electron cree la carpeta 'sae-project' por defecto
app.setPath("userData", path.join(app.getPath("appData"), "SAE"));

// Función auxiliar para validar y crear directorios con verificación de permisos
function ensureDataDirectories() {
  const userDataPath = app.getPath("userData");
  const requiredDirs = [
    userDataPath,
    path.join(userDataPath, "prisma"),
    path.join(userDataPath, "uploads"),
    path.join(userDataPath, "uploads", "alumnos"),
    path.join(userDataPath, "uploads", "docentes"),
    path.join(userDataPath, "uploads", "directores"),
    path.join(userDataPath, "uploads", "personal"),
    path.join(userDataPath, "uploads", "qr"),
    path.join(userDataPath, "uploads", "justificaciones"),
    path.join(userDataPath, "uploads", "logos"),
    path.join(userDataPath, "uploads", "usuarios"),
    path.join(userDataPath, "backups"),
    path.join(userDataPath, "logs"),
    path.join(userDataPath, "temp"),
  ];

  let creationErrors = [];

  for (const dir of requiredDirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`✓ Directorio creado: ${dir}`);
      }
    } catch (err) {
      const errMsg = `Error al crear ${dir}: ${err.message}`;
      logError(errMsg);
      creationErrors.push(errMsg);
    }
  }

  return {
    success: creationErrors.length === 0,
    userDataPath,
    errors: creationErrors,
  };
}

/**
 * Crea un backup automático de la base de datos antes de cualquier operación
 * que pueda sobreescribirla. El backup se guarda en %APPDATA%\SAE\backups\<fecha>_pre-update.db
 */
function safeBackupDatabase() {
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "prisma", "dev.db");
  const backupsDir = path.join(userDataPath, "backups");

  if (!fs.existsSync(dbPath)) return; // No hay BD que respaldar

  try {
    fs.ensureDirSync(backupsDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
    const backupPath = path.join(backupsDir, `${timestamp}_pre-update.db`);

    // Solo crear backup si no existe ya uno reciente (menos de 10 min)
    const recentBackup = fs.readdirSync(backupsDir)
      .filter(f => f.endsWith("_pre-update.db"))
      .sort()
      .pop();

    if (recentBackup) {
      const recentTimestamp = fs.statSync(path.join(backupsDir, recentBackup)).mtime;
      const minsSinceBackup = (Date.now() - recentTimestamp.getTime()) / 60000;
      if (minsSinceBackup < 10) {
        log(`[Backup] Backup reciente encontrado (${minsSinceBackup.toFixed(1)} min). Omitiendo.`);
        return;
      }
    }

    fs.copyFileSync(dbPath, backupPath);
    log(`[Backup] Backup preventivo creado: ${backupPath}`);

    // Limpiar backups de pre-update antiguos (conservar solo los últimos 5)
    const preUpdateBackups = fs.readdirSync(backupsDir)
      .filter(f => f.endsWith("_pre-update.db"))
      .sort();
    if (preUpdateBackups.length > 5) {
      const toDelete = preUpdateBackups.slice(0, preUpdateBackups.length - 5);
      toDelete.forEach(f => {
        try { fs.unlinkSync(path.join(backupsDir, f)); } catch (_) {}
      });
    }
  } catch (err) {
    logError(`[Backup] No se pudo crear backup preventivo: ${err.message}`);
  }
}

/**
 * Migra datos de carpetas con nombres antiguos si la nueva carpeta está vacía.
 * Solo se ejecuta si no existe la base de datos en la ruta actual.
 */
function migrateLegacyDataSpeculative() {
  const currentDataPath = app.getPath("userData");
  const dbFile = path.join(currentDataPath, "prisma", "dev.db");

  // 1. Si ya hay una base de datos, NO migramos (evita sobreescribir datos nuevos)
  if (fs.existsSync(dbFile)) {
    log("Directorio de datos actual ya contiene base de datos. Omitiendo migración.");
    return;
  }

  const appData = app.getPath("appData");
  
  // Posibles nombres de carpetas antiguas basados en versiones previas
  const legacyFolders = [
    "SAE - Sistema de Administracion Educativa",
    "SAE - Sistema de Administración Educativa",
    "sae-project",
    "sae"
  ];

  for (const folderName of legacyFolders) {
    const legacyPath = path.join(appData, folderName);
    const legacyDb = path.join(legacyPath, "prisma", "dev.db");

    if (fs.existsSync(legacyDb)) {
      log(`¡Datos antiguos detectados en: ${legacyPath}! Iniciando migración automática...`);
      
      try {
        // Asegurar que el directorio padre existe
        fs.ensureDirSync(currentDataPath);
        
        // Copiar contenido de la carpeta antigua a la nueva
        // No sobreescribimos si algo ya existe por accidente
        fs.copySync(legacyPath, currentDataPath, {
          overwrite: false,
          preserveTimestamps: true,
          errorOnExist: false
        });

        log(`✓ Migración desde "${folderName}" completada con éxito.`);
        
        // NOTA: No borramos la carpeta antigua por seguridad, el usuario puede hacerlo manualmente.
        return; // Detener tras la primera migración exitosa
      } catch (err) {
        logError(`Falló migración desde ${folderName}: ${err.message}`);
      }
    }
  }
}

// ─────────────────────────────────────────────
//  Log a archivo persistente (AppData/SAE/logs)
// ─────────────────────────────────────────────
const electronLog = require('electron-log/main');
electronLog.transports.file.maxSize = 10 * 1024 * 1024; // 10MB file limit before rotation
electronLog.transports.file.resolvePathFn = () => path.join(app.getPath("userData"), "logs", "main.log");
electronLog.initialize();

function initLogFile() {
  if (isDev) return;
  electronLog.info(`\n\n=== SAE Start ${new Date().toISOString()} ===\n`);
}
function writeLog(line) {
  electronLog.info(line);
}
function log(msg) {
  const line = `[Electron] ${msg}`;
  electronLog.info(line);
}
function logError(msg) {
  const line = `[Electron][ERROR] ${msg}`;
  electronLog.error(line);
}

// ─────────────────────────────────────────────
//  Detección de Puerto — Preferido con Fallback
// ─────────────────────────────────────────────
// Intenta el puerto preferido (5123) para que sea predecible en la red local.
// Si el puerto está ocupado, el SO asigna uno libre dinámicamente.
// El frontend siempre recibe el puerto real vía ?apiPort=, así que nada se rompe.
const PREFERRED_PORT = 5123;

function getAvailablePort(preferred = PREFERRED_PORT) {
  const net = require("net");
  return new Promise((resolve) => {
    // Paso 1: intentar el puerto preferido
    const probe = net.createServer();
    probe.listen(preferred, "0.0.0.0", () => {
      const port = probe.address().port;
      probe.close(() => {
        log(`Puerto preferido ${port} disponible. Usando puerto fijo.`);
        resolve(port);
      });
    });
    probe.on("error", () => {
      // Paso 2: puerto preferido ocupado → pedir uno libre al OS
      log(`Puerto preferido ${preferred} ocupado. Solicitando puerto dinámico al OS...`);
      const fallback = net.createServer();
      fallback.listen(0, "0.0.0.0", () => {
        const port = fallback.address().port;
        fallback.close(() => {
          log(`Puerto dinámico asignado: ${port}`);
          resolve(port);
        });
      });
    });
  });
}

// ─────────────────────────────────────────────
//  Iniciar el backend en producción
// ─────────────────────────────────────────────
async function startBackend() {
  if (isDev) return DEFAULT_FALLBACK_PORT;

  const port = await getAvailablePort();
  const resourcesPath = process.resourcesPath;
  const customNode = path.join(resourcesPath, "node.exe");
  const nodeBin = require("fs").existsSync(customNode) ? customNode : process.execPath;
  const serverScript = path.join(
    resourcesPath,
    "app.asar.unpacked",
    "backend",
    "server.js",
  );

  if (!fs.existsSync(serverScript)) {
    logError(`server.js no encontrado: ${serverScript}`);
    return false;
  }

  // ── Rutas ESCRIBIBLES en AppData (independiente del directorio de instalacion) ──
  // C:\Program Files es de solo lectura; %APPDATA%\SAE siempre es escribible
  const userDataPath = app.getPath("userData"); // = %APPDATA%\SAE
  const dataDbDir = path.join(userDataPath, "prisma");
  const dataDbPath = path.join(dataDbDir, "dev.db");
  const dataUploadsDir = path.join(userDataPath, "uploads");

  // Crear directorios si no existen
  [
    dataDbDir,
    dataUploadsDir,
    path.join(dataUploadsDir, "alumnos"),
    path.join(dataUploadsDir, "docentes"),
    path.join(dataUploadsDir, "directores"),
    path.join(dataUploadsDir, "personal"),
    path.join(dataUploadsDir, "qr"),
    path.join(dataUploadsDir, "justificaciones"),
    path.join(dataUploadsDir, "logos"),
    path.join(dataUploadsDir, "usuarios"),
  ].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Copiar BD inicial de resources si no existe en AppData (primera vez)
  // RUTA ÚNICA: Evita colisiones con archivos de desarrollo
  const initialDb = path.join(resourcesPath, "initial-data", "virgin.db");
  if (!fs.existsSync(dataDbPath)) {
    if (fs.existsSync(initialDb)) {
      // DOBLE VERIFICACIÓN: Si por alguna razón hay datos legados no detectados, abortar
      // Este check es defensa en profundidad — migrateLegacyDataSpeculative() ya corrió antes
      log(`[DB] No se encontró BD en AppData. Copiando BD virgen inicial...`);
      try {
        fs.copyFileSync(initialDb, dataDbPath);
        log(`[DB] BD inicial copiada a: ${dataDbPath}`);
      } catch (e) {
        logError(`[DB] No se pudo copiar la BD inicial: ${e.message}`);
      }
    } else {
      logError(`[DB] ADVERTENCIA: No existe ni dev.db ni virgin.db. El sistema puede no iniciar correctamente.`);
    }
  } else {
    // La BD ya existe: hacer backup preventivo antes de que el backend la use
    log(`[DB] BD existente detectada en AppData. Datos del usuario preservados.`);
    safeBackupDatabase();
  }

  // Calcular heap según RAM
  const totalMemGB = os.totalmem() / (1024 * 1024 * 1024);
  let maxOldSpaceSize = totalMemGB < 4.5 ? 512 : totalMemGB < 8.5 ? 1536 : 4096;
  log(`RAM: ${totalMemGB.toFixed(1)}GB → heap=${maxOldSpaceSize}MB`);

  // Motor Prisma (se lanza desde asar.unpacked, puede estar en Program Files pero solo se LEE)
  const prismaEngine = path.join(
    resourcesPath,
    "app.asar.unpacked",
    "backend",
    "prisma-client",
    "query_engine-windows.dll.node",
  );

  // FIX: Convertir backslashes a forward slashes — Prisma SQLite los requiere en Windows
  const dbUrlPath = dataDbPath.replace(/\\/g, "/");

  const env = {
    ...process.env,
    PORT: port.toString(),
    ELECTRON_RUN_AS_NODE: "1", // Force Electron to run as a standard Node.js process for this spawn
    NODE_ENV: "production",
    NODE_NO_WARNINGS: "1",
    RESOURCES_PATH: resourcesPath,
    SAE_DATA_DIR: userDataPath, // ← NUEVO: directorio escribible AppData\SAE
    LOGS_PATH: path.join(userDataPath, "logs"), // ← FIX: asegurar logs en AppData
    DATABASE_URL: `file:${dbUrlPath}`, // ← FIX: forward slashes en la ruta
    PRISMA_SCHEMA_PATH: path.join(resourcesPath, "prisma", "schema.prisma"),
    PRISMA_QUERY_ENGINE_LIBRARY: fs.existsSync(prismaEngine)
      ? prismaEngine
      : undefined,
  };

  // Abrir stream de log del backend
  writeLog(`Iniciando backend: ${serverScript}`);
  electronLog.info(`CWD (spawn): ${userDataPath}`);
  electronLog.info(`NODE_ENV: ${env.NODE_ENV}`);
  electronLog.info(`DATABASE_URL: ${env.DATABASE_URL}`);
  electronLog.info(`PRISMA_QUERY_ENGINE_LIBRARY: ${env.PRISMA_QUERY_ENGINE_LIBRARY}`);

  backendProcess = spawn(
    nodeBin,
    [`--max-old-space-size=${maxOldSpaceSize}`, serverScript],
    {
      // FIX: userDataPath (%APPDATA%\SAE) siempre es escribible.
      // Program Files es de solo lectura — Prisma crashea silenciosamente
      // al intentar escribir archivos temporales (WAL, locks) en ese directorio.
      cwd: userDataPath,
      stdio: ["ignore", "pipe", "pipe"],
      env,
      windowsHide: true,
    },
  );

  backendProcess.stdout.on("data", (data) => {
    // Cuando Pino escribe en prod, no lo imprimimos porque va a su app.log
    // Pero en el raro caso que Node imprima algo fuera de Pino, lo capturamos.
    const text = data.toString().trim();
    if(text) {
      log(`[backend] ${text}`);
    }
  });

  backendProcess.stderr.on("data", (data) => {
    const text = data.toString().trim();
    if(text) {
      logError(`[backend stderr] ${text}`);
    }
  });

  backendProcess.on("error", (err) => {
    logError(`Spawn error: ${err.message}`);
  });

  backendProcess.on("exit", (code, signal) => {
    log(`Backend terminó: code=${code} signal=${signal}`);
    backendProcess = null;
  });

  return waitForBackend(port);
}

// ─────────────────────────────────────────────
//  Esperar a que el backend esté disponible
// ─────────────────────────────────────────────
function waitForBackend(port, maxAttempts = 30, delayMs = 1000) {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      attempts++;
      const req = http.get(`http://localhost:${port}/api/health`, (res) => {
        if (res.statusCode === 200) {
          log(`Backend listo y respondiendo en el puerto ${port}.`);
          resolve(port);
        } else {
          retry();
        }
      });
      req.setTimeout(2000);
      req.on("error", retry);
      req.on("timeout", () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (attempts >= maxAttempts) {
        logError("Backend no respondió tras múltiples intentos.");
        resolve(false);
        return;
      }
      setTimeout(check, delayMs);
    };

    check();
  });
}

// ─────────────────────────────────────────────
//  Mostrar ventana de carga (splash)
// ─────────────────────────────────────────────
function createSplashWindow() {
  // FIX: En producción usar process.resourcesPath (fuera del asar, siempre accesible).
  // En desarrollo, __dirname/../ apunta a la raíz del proyecto correctamente.
  const base = isDev ? path.join(__dirname, "..") : process.resourcesPath;

  const iconCandidates = [
    path.join(base, "logo.ico"),
    path.join(base, "logo.png"),
  ];
  const splashIcon = iconCandidates.find((p) => fs.existsSync(p));

  // Leer logo como base64 para embeber en el HTML
  // Solo usamos PNG para el data URI — ICO no es renderizable como <img> en Chromium
  let logoDataUri = null;
  const logoCandidates = [
    path.join(base, "logo.png"),
    // ICO omitido intencionalmente — Chromium no lo renderiza via data URI
  ];
  for (const p of logoCandidates) {
    if (fs.existsSync(p)) {
      const b64 = fs.readFileSync(p).toString("base64");
      logoDataUri = `data:image/png;base64,${b64}`;
      break;
    }
  }

  const splash = new BrowserWindow({
    width: 480,
    height: 300,
    transparent: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    backgroundColor: "#1a1a2e",
    icon: splashIcon || undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Splash HTML embebido (sin archivo externo)
  const splashHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: white;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          user-select: none;
        }
        .logo { width: 80px; height: 80px; object-fit: contain; margin-bottom: 12px; border-radius: 12px; }
        .logo-emoji { font-size: 48px; margin-bottom: 12px; }
        h1 { font-size: 20px; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
        .sub { font-size: 13px; color: #a0aec0; margin-bottom: 32px; }
        .bar-bg {
          width: 320px; height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px; overflow: hidden; margin-bottom: 16px;
        }
        .bar { height: 100%; width: 0%; background: linear-gradient(90deg, #4facfe, #00f2fe);
               border-radius: 8px; transition: width 0.3s ease; animation: progress 4s ease-in-out forwards; }
        @keyframes progress {
          0%   { width: 0%; }
          20%  { width: 25%; }
          50%  { width: 55%; }
          80%  { width: 80%; }
          100% { width: 95%; }
        }
        .status { font-size: 12px; color: #718096; }
        .version { position: absolute; bottom: 16px; right: 20px; font-size: 11px; color: #4a5568; }
      </style>
    </head>
    <body>
      ${
        logoDataUri
          ? `<img class="logo" src="${logoDataUri}" alt="SAE Logo" />`
          : `<img class="logo" src="" alt="SAE" style="display:none"/>`
      }
      <h1>SAE</h1>
      <div class="sub">Sistema de Administración Educativa</div>
      <div class="bar-bg"><div class="bar"></div></div>
      <div class="status" id="status">Iniciando servicios...</div>
      <div class="version">v${app.getVersion()}</div>
      <script>
        const messages = [
          'Iniciando servicios...',
          'Conectando base de datos...',
          'Cargando módulos...',
          'Preparando interfaz...',
          'Casi listo...'
        ];
        let i = 0;
        setInterval(() => {
          i = (i + 1) % messages.length;
          document.getElementById('status').textContent = messages[i];
        }, 900);
      </script>
    </body>
    </html>
  `;

  splash.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(splashHtml)}`,
  );
  return splash;
}

// ─────────────────────────────────────────────
//  Crear ventana principal
// ─────────────────────────────────────────────
function createWindow(backendPort) {
  log(`Creando ventana principal... (Backend Port: ${backendPort})`);

  // FIX: En producción usar process.resourcesPath (fuera del asar, siempre accesible).
  const base = isDev ? path.join(__dirname, "..") : process.resourcesPath;

  const iconCandidates = [
    path.join(base, "logo.ico"),
    path.join(base, "logo.png"),
  ];

  const icon = iconCandidates.find((p) => fs.existsSync(p));

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: "SAE - Sistema de Administración Educativa",
    icon: icon || undefined,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Ocultar barra de menú
  mainWindow.setMenuBarVisibility(false);

  // Mostrar ventana cuando cargue
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    log("Ventana principal mostrada.");
  });

  // Cargar la app
  if (isDev) {
    const devUrl = `http://localhost:5173/?apiPort=${backendPort}`;
    log(`Modo desarrollo — cargando ${devUrl}`);
    mainWindow.loadURL(devUrl);
    if (process.env.OPEN_DEVTOOLS === "true") {
      mainWindow.webContents.openDevTools();
    }
  } else {
    const indexPath = path.join(
      __dirname,
      "..",
      "frontend",
      "dist",
      "index.html",
    );
    log(`Modo producción — cargando ${indexPath} con ?apiPort=${backendPort}`);
    mainWindow.loadFile(indexPath, { search: `apiPort=${backendPort}` });
  }

  // Abrir enlaces externos en el navegador del sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // ─────────────────────────────────────────────
  // PERMISOS DE MEDIOS (cámara, micrófono)
  // Sin esto, Electron 20+ deniega getUserMedia silenciosamente
  // causando pantalla negra en el modal de webcam
  // ─────────────────────────────────────────────
  const session = mainWindow.webContents.session;

  // Handler asíncrono — para solicitudes de permiso del renderer
  session.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['media', 'camera', 'microphone', 'mediaKeySystem'];
    if (allowedPermissions.includes(permission)) {
      log(`[PERMISOS] Concediendo: ${permission}`);
      callback(true);
    } else {
      log(`[PERMISOS] Denegando: ${permission}`);
      callback(false);
    }
  });

  // Handler síncrono — para comprobaciones previas de permisos (Electron 15+)
  session.setPermissionCheckHandler((webContents, permission) => {
    const allowedPermissions = ['media', 'camera', 'microphone'];
    return allowedPermissions.includes(permission);
  });

  // Errores de render
  mainWindow.webContents.on("render-process-gone", (event, details) => {
    logError(`Render process gone: ${details.reason}`);
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      logError(
        `Falló la carga de la página: ${errorDescription} (${errorCode})`,
      );
    },
  );

  mainWindow.on("closed", () => {
    log("Ventana cerrada por el usuario.");
    mainWindow = null;
  });
}

// ─────────────────────────────────────────────
//  Apagar backend al cerrar la app
// ─────────────────────────────────────────────
function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    log("Deteniendo proceso backend...");
    try {
      if (process.platform === "win32") {
        const { execSync } = require("child_process");
        try {
          execSync(`taskkill /PID ${backendProcess.pid} /F /T`, {
            stdio: "ignore",
          });
        } catch (_) {}
      } else {
        backendProcess.kill("SIGTERM");
      }
    } catch (e) {
      logError(`Error al detener backend: ${e.message}`);
    }
    backendProcess = null;
  }
}

// ─────────────────────────────────────────────
//  Arranque de la app
// ─────────────────────────────────────────────
app.whenReady().then(async () => {
  initLogFile();
  log(`App lista. Iniciando... (v${app.getVersion()})`);

  // 1. Migración de datos legados (carpetas antiguas → %APPDATA%\SAE)
  migrateLegacyDataSpeculative();

  // Validar directorios de datos antes de iniciar
  const dirCheck = ensureDataDirectories();
  if (!dirCheck.success) {
    logError(
      "Errores al crear directorios: " + dirCheck.errors.join("; "),
    );
    if (!isDev) {
      dialog.showErrorBox(
        "SAE — Error de configuración",
        "No se pudieron crear los directorios necesarios en:\n\n" +
          dirCheck.userDataPath +
          "\n\n" +
          "Posibles causas:\n" +
          "• Permisos insuficientes (ejecute como Administrador)\n" +
          "• Antivirus bloqueando la creación de carpetas\n" +
          "• Espacio en disco insuficiente\n\n" +
          "Errores:\n" +
          dirCheck.errors.join("\n"),
      );
      app.quit();
      return;
    }
  }

  let splash = null;

  try {
    // Mostrar pantalla de carga en producción
    if (!isDev) {
      splash = createSplashWindow();
    }

    // Iniciar backend y esperar que esté listo
    const backendPort = await startBackend();

    if (!backendPort && !isDev) {
      logError("El backend no pudo iniciarse.");
      if (splash) splash.destroy();
      const logDir = path.join(app.getPath("userData"), "logs");
      dialog.showErrorBox(
        "SAE — Error de inicio",
        "No se pudo iniciar el servidor interno de SAE.\n\n" +
          "Código: BACKEND_START_FAILED\n\n" +
          "Para diagnóstico, revise el archivo de log:\n" +
          logDir +
          "\\backend.log\n\n" +
          "Comparta ese archivo con soporte técnico.",
      );
      app.quit();
      return;
    }

    // Crear ventana principal pasándole el puerto dinámico (si es 0, false, etc.)
    createWindow(backendPort || DEFAULT_FALLBACK_PORT);

    // Cerrar splash cuando la ventana principal esté lista
    if (splash) {
      mainWindow.once("ready-to-show", () => {
        splash.destroy();
        splash = null;
        
        // Iniciar configuración de actualización automática después de mostrar la app
        initAutoUpdater();
      });
    } else {
      initAutoUpdater();
    }
  } catch (err) {
    logError(`Error en arranque: ${err.message}`);
    if (splash) splash.destroy();
    app.quit();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(DEFAULT_FALLBACK_PORT); // Fallback if re-opened dynamically
    }
  });
});

// ─────────────────────────────────────────────
//  Cierre de la app
// ─────────────────────────────────────────────
app.on("window-all-closed", () => {
  log("Todas las ventanas cerradas. Cerrando app...");
  stopBackend();
  app.quit();
});

app.on("before-quit", () => {
  stopBackend();
});

// ─────────────────────────────────────────────
//  Manejo de errores globales
// ─────────────────────────────────────────────
process.on("uncaughtException", (error) => {
  if (error.code === "EPIPE") return;
  logError(`Uncaught exception: ${error}`);
});

process.on("unhandledRejection", (reason) => {
  if (reason && reason.code === "EPIPE") return;
  logError(`Unhandled rejection: ${reason}`);
});

// ─────────────────────────────────────────────
//  Sistema de Auto-Actualización
// ─────────────────────────────────────────────
function initAutoUpdater() {
  if (isDev) {
    log("[Updater] Omitiendo búsqueda de actualizaciones en entorno de desarrollo.");
    return;
  }

  // Redirigir logs del updater a nuestro sistema
  autoUpdater.logger = {
    info: (msg) => log(`[Updater] ${msg}`),
    warn: (msg) => log(`[Updater/WARN] ${msg}`),
    error: (msg) => logError(`[Updater/ERROR] ${msg}`),
    debug: () => {}
  };

  // Desactivar descarga automática para pedir permiso al usuario primero
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.checkForUpdates().catch(err => {
    logError(`[Updater] Error al buscar actualizaciones: ${err.message}`);
  });

  // Evento: Actualización encontrada en GitHub
  autoUpdater.on('update-available', (info) => {
    log(`[Updater] Actualización disponible: v${info.version}`);
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Actualización disponible',
      message: `Una nueva versión de SAE (v${info.version}) está disponible.\n\n¿Desea descargarla ahora? (La descarga se realizará en segundo plano sin interrumpir su trabajo).`,
      buttons: ['Descargar ahora', 'Más tarde'],
      defaultId: 0,
      cancelId: 1
    }).then(result => {
      if (result.response === 0) {
        log("[Updater] Usuario aceptó la descarga.");
        autoUpdater.downloadUpdate();
      } else {
        log("[Updater] Usuario pospuso la actualización.");
      }
    });
  });

  // Evento: Actualización descargada exitosamente (.exe en temp)
  autoUpdater.on('update-downloaded', (info) => {
    log(`[Updater] Actualización descargada: v${info.version}`);
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Actualización lista',
      message: 'La actualización se ha descargado completamente.\n\n¿Desea reiniciar el sistema para instalarla ahora? (No se perderá ningún dato)',
      buttons: ['Reiniciar y Actualizar', 'Más tarde'],
      defaultId: 0,
      cancelId: 1
    }).then(result => {
      if (result.response === 0) {
        log("[Updater] Usuario aceptó instalar, reiniciando y aplicando actualización...");
        // force quit=false (para que dispare before-quit y cierre backend), install=true
        autoUpdater.quitAndInstall(false, true); 
      }
    });
  });

  // Otros eventos informativos
  autoUpdater.on('update-not-available', () => {
    log("[Updater] El sistema ya cuenta con la versión más reciente.");
  });

  autoUpdater.on('error', (err) => {
    logError(`[Updater] Hubo un error en el proceso de actualización: ${err.message}`);
  });
}
