const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Versión de Electron y de la app
  getVersion: () => process.versions.electron,

  // ─── Setup Wizard ───────────────────────────────────────────────
  // Consultar si el SetupWizard debe mostrarse (primera ejecución)
  shouldShowSetup: () => ipcRenderer.invoke('setup:should-show'),

  // Marcar el setup como completado desde el frontend
  completeSetup: () => ipcRenderer.invoke('setup:complete'),

  // Obtener el estado completo del setup
  getSetupState: () => ipcRenderer.invoke('setup:get-state'),
});
