const { app, BrowserWindow, shell, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

// Variables globales
let mainWindow;
const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: "SAE - Sistema de Administración Educativa",
    icon: path.join(__dirname, "..", "frontend", "public", "logo.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Ocultar menú por defecto
  mainWindow.setMenuBarVisibility(false);

  // Cargar la app
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // En producción, cargar el archivo local compilado
    mainWindow.loadFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  }

  // Abrir enlaces externos en el navegador
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Configurar auto-updater solo en producción
  if (!isDev) {
    // Verificar actualizaciones al iniciar
    autoUpdater.checkForUpdatesAndNotify();

    // Configurar eventos de actualización
    autoUpdater.on("update-available", (info) => {
      dialog.showMessageBox(mainWindow, {
        type: "info",
        title: "Actualización Disponible",
        message: `Una nueva versión (${info.version}) está disponible.`,
        detail: "La actualización se descargará en segundo plano.",
        buttons: ["OK"],
      });
    });

    autoUpdater.on("update-downloaded", (info) => {
      dialog
        .showMessageBox(mainWindow, {
          type: "info",
          title: "Actualización Lista",
          message: `La versión ${info.version} ha sido descargada.`,
          detail: "Reinicia la aplicación para instalar la actualización.",
          buttons: ["Reiniciar Ahora", "Más Tarde"],
          defaultId: 0,
          cancelId: 1,
        })
        .then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall();
          }
        });
    });

    autoUpdater.on("error", (error) => {
      console.error("Error en auto-updater:", error);
    });
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

