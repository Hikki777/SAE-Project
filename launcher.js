const { spawn } = require('child_process');
const path = require('path');

// Flag de Windows para CREATE_NO_WINDOW
const CREATE_NO_WINDOW = 0x08000000;

const isWindows = process.platform === 'win32';

// Ejecutar el script principal SIN mostrar ventanas
const child = spawn('node', [path.join(__dirname, 'scripts', 'start-electron-dev.js')], {
  stdio: 'ignore',  // Ignorar toda salida
  detached: true,   // Proceso independiente
  windowsHide: true,
  ...(isWindows && { creationFlags: CREATE_NO_WINDOW })
});

// Manejar errores
child.on('error', (err) => {
  console.error('Error al iniciar el sistema:', err.message);
  process.exit(1);
});

// Desconectar del proceso hijo para que continue independiente
child.unref();

// Esperar un momento para asegurar que el proceso hijo se inicie correctamente
setTimeout(() => {
  process.exit(0);
}, 500);
