const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

let mainWindow;
const isDev = !app.isPackaged;

function createWindow() {
  console.log("[Electron] createWindow() llamado");
  
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: "SAE - Sistema de Administración Educativa",
    icon: path.join(__dirname, "..", "frontend", "public", "logo.png"),
    show: false,  // No mostrar hasta que esté lista
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  console.log("[Electron] BrowserWindow creada");

  // Mostrar solo cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log("[Electron] Ventana mostrada");
  });

  // Ocultar menú por defecto
  mainWindow.setMenuBarVisibility(false);

  // Cargar la app
  if (isDev) {
    console.log("[Electron] Modo desarrollo - cargando desde http://localhost:5173");
    mainWindow.loadURL("http://localhost:5173");
    // Solo abrir DevTools si se especifica la variable OPEN_DEVTOOLS
    if (process.env.OPEN_DEVTOOLS === 'true') {
      mainWindow.webContents.openDevTools();
    }
  } else {
    // En producción, cargar el archivo local compilado
    const indexPath = path.join(__dirname, "..", "frontend", "dist", "index.html");
    console.log("[Electron] Modo producción - cargando desde", indexPath);
    mainWindow.loadFile(indexPath);
  }

  // Abrir enlaces externos en el navegador
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Manejar errores de carga
  mainWindow.webContents.on('crashed', () => {
    console.error("[Electron] Contenido web se crashing");
  });

  // Log cuando falla la carga
  mainWindow.webContents.on('failed-to-load', () => {
    console.error("[Electron] Falló la carga de la página");
  });

  mainWindow.on("closed", () => {
    console.log("[Electron] Ventana cerrada por el usuario");
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log("[Electron] App ready, creating window...");
  try {
    createWindow();
    console.log("[Electron] Ventana creada exitosamente");
  } catch (err) {
    console.error("[Electron] Error creando ventana:", err);
    process.exit(1);
  }

  app.on("activate", () => {
    console.log("[Electron] Evento activate");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch(err => {
  console.error("[Electron] Error en app.whenReady():", err);
  process.exit(1);
});

app.on("window-all-closed", () => {
  // En Windows/Linux, NO cerrar automáticamente la app cuando se cierra la ventana
  // El usuario debe presionar Ctrl+C en la terminal para cerrar todo
  console.log("[Electron] Ventana cerrada, pero la app sigue corriendo.");
  console.log("[Electron] Presiona Ctrl+C en la terminal para cerrar completamente.");
  
  // Si es macOS, sí cerrar (comportamiento estándar)
  if (process.platform === "darwin") {
    app.quit();
  }
  // En Windows/Linux, recrear la ventana si se presiona el icono
});

// Manejar errores sin que causen crash
process.on("uncaughtException", (error) => {
  if (error.code === 'EPIPE') {
    return;
  }
  console.error("[Electron] Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  if (reason && reason.code === 'EPIPE') {
    return;
  }
  console.error("[Electron] Unhandled rejection:", reason);
});
