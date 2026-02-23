const { app, BrowserWindow, shell, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const os = require("os");

let mainWindow;
let backendProcess = null;
const isDev = !app.isPackaged;

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

// ─────────────────────────────────────────────
//  Log a archivo persistente (AppData/SAE/logs)
// ─────────────────────────────────────────────
let logStream = null;
function getLogDir() {
  const dir = path.join(app.getPath("userData"), "logs");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function initLogFile() {
  if (isDev) return;
  try {
    const logDir = getLogDir();
    const logFile = path.join(logDir, "main.log");
    logStream = fs.createWriteStream(logFile, { flags: "a" });
    logStream.write(`\n\n=== SAE Start ${new Date().toISOString()} ===\n`);
  } catch (e) {
    /* ignore */
  }
}
function writeLog(line) {
  if (logStream)
    try {
      logStream.write(line + "\n");
    } catch (e) {}
}
function log(msg) {
  const line = `[Electron] ${msg}`;
  console.log(line);
  writeLog(line);
}
function logError(msg) {
  const line = `[Electron][ERROR] ${msg}`;
  console.error(line);
  writeLog(line);
}

// ─────────────────────────────────────────────
//  Iniciar el backend en producción
// ─────────────────────────────────────────────
async function startBackend() {
  if (isDev) return true;

  const resourcesPath = process.resourcesPath;
  const nodeBin = process.execPath; // Use the bundled Electron executable
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
  ].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Copiar BD inicial de resources si no existe en AppData (primera vez)
  const initialDb = path.join(resourcesPath, "prisma", "dev.db");
  if (!fs.existsSync(dataDbPath) && fs.existsSync(initialDb)) {
    try {
      fs.copyFileSync(initialDb, dataDbPath);
      log(`[DB] BD inicial copiada a: ${dataDbPath}`);
    } catch (e) {
      logError(`[DB] No se pudo copiar la BD inicial: ${e.message}`);
    }
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
  const backendLogFile = path.join(getLogDir(), "backend.log");
  writeLog(`Backend log: ${backendLogFile}`);
  let backendLogStream = null;
  try {
    backendLogStream = fs.createWriteStream(backendLogFile, { flags: "a" });
    backendLogStream.write(
      `\n=== Backend Start ${new Date().toISOString()} ===\n`,
    );
    backendLogStream.write(`CWD (spawn): ${userDataPath}\n`);
    backendLogStream.write(`Script: ${serverScript}\n`);
    backendLogStream.write(`NODE_ENV: ${env.NODE_ENV}\n`);
    backendLogStream.write(`DATABASE_URL: ${env.DATABASE_URL}\n`);
    backendLogStream.write(
      `PRISMA_QUERY_ENGINE_LIBRARY: ${env.PRISMA_QUERY_ENGINE_LIBRARY}\n`,
    );
  } catch (e) {}

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
    const text = data.toString();
    if (backendLogStream) backendLogStream.write(text);
    text
      .split("\n")
      .filter(Boolean)
      .forEach((l) => log(`[backend] ${l}`));
  });
  backendProcess.stderr.on("data", (data) => {
    const text = data.toString();
    if (backendLogStream) backendLogStream.write("[ERR] " + text);
    text
      .split("\n")
      .filter(Boolean)
      .forEach((l) => logError(`[backend] ${l}`));
  });
  backendProcess.on("error", (err) => {
    logError(`Spawn error: ${err.message}`);
    if (backendLogStream)
      backendLogStream.write(`SPAWN ERROR: ${err.message}\n`);
  });
  backendProcess.on("exit", (code, signal) => {
    log(`Backend terminó: code=${code} signal=${signal}`);
    if (backendLogStream) {
      backendLogStream.write(`EXIT code=${code} signal=${signal}\n`);
      backendLogStream.end();
    }
    backendProcess = null;
  });

  return waitForBackend();
}

// ─────────────────────────────────────────────
//  Esperar a que el backend esté disponible
// ─────────────────────────────────────────────
function waitForBackend(maxAttempts = 30, delayMs = 1000) {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      attempts++;
      const req = http.get("http://localhost:5000/api/health", (res) => {
        if (res.statusCode === 200) {
          log("Backend listo y respondiendo.");
          resolve(true);
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
  let logoDataUri = null;
  const logoCandidates = [
    path.join(base, "logo.png"),
    path.join(base, "logo.ico"),
  ];
  for (const p of logoCandidates) {
    if (fs.existsSync(p)) {
      const ext = path.extname(p).slice(1).replace("ico", "x-icon");
      const b64 = fs.readFileSync(p).toString("base64");
      logoDataUri = `data:image/${ext};base64,${b64}`;
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
      <div class="version">v1.0.7</div>
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
function createWindow() {
  log("Creando ventana principal...");

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
    log("Modo desarrollo — cargando http://localhost:5173");
    mainWindow.loadURL("http://localhost:5173");
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
    log(`Modo producción — cargando ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }

  // Abrir enlaces externos en el navegador del sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
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
  log("App lista. Iniciando...");

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
    const backendOk = await startBackend();

    if (!backendOk && !isDev) {
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

    // Crear ventana principal
    createWindow();

    // Cerrar splash cuando la ventana principal esté lista
    if (splash) {
      mainWindow.once("ready-to-show", () => {
        splash.destroy();
        splash = null;
      });
    }
  } catch (err) {
    logError(`Error en arranque: ${err.message}`);
    if (splash) splash.destroy();
    app.quit();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
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
