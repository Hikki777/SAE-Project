const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Esperar a que el backend esté listo
 */
async function waitForBackend() {
  const maxAttempts = 30;
  const delayMs = 1000;
  
  log('[ELECTRON] Esperando a que el backend esté listo...', colors.yellow);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:5000/api/health', (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Backend returned ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.setTimeout(2000);
      });
      
      log('[ELECTRON] Backend listo!', colors.green);
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return false;
}

/**
 * Esperar a que el frontend esté listo
 */
async function waitForFrontend() {
  const maxAttempts = 30;
  const delayMs = 1000;
  
  log('[ELECTRON] Esperando a que el frontend esté listo...', colors.yellow);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:5173/', (res) => {
          if (res.statusCode === 200 || res.statusCode === 304) {
            resolve();
          } else {
            reject(new Error(`Frontend returned ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.setTimeout(2000);
      });
      
      log('[ELECTRON] Frontend listo!', colors.green);
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return false;
}

/**
 * Iniciar Electron con backend y frontend
 */
async function startElectron() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('  [ELECTRON] Iniciando aplicación Electron', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);
  
  const rootDir = path.join(__dirname, '..');
  
  // Paso 1: Iniciar backend
  log('[1/4] Iniciando backend...', colors.cyan);
  
  const backend = spawn('node', ['scripts/start-dynamic.js', 'backend/server.js'], {
    stdio: 'inherit',
    cwd: rootDir
  });
  
  backend.on('error', (err) => {
    log(`\n[ERROR] Error al iniciar backend: ${err.message}`, colors.yellow);
    process.exit(1);
  });
  
  // Paso 2: Esperar a que backend esté listo
  log('[2/4] Esperando backend...', colors.cyan);
  
  const backendReady = await waitForBackend();
  
  if (!backendReady) {
    log('\n[ERROR] Backend no respondió en el tiempo esperado', colors.yellow);
    backend.kill();
    process.exit(1);
  }
  
  // Paso 3: Iniciar frontend
  log('[3/4] Iniciando frontend...', colors.cyan);
  
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const frontend = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.join(rootDir, 'frontend'),
    stdio: 'inherit',
    shell: true
  });
  
  frontend.on('error', (err) => {
    log(`\n[ERROR] Error al iniciar frontend: ${err.message}`, colors.yellow);
    backend.kill();
    process.exit(1);
  });
  
  // Esperar a que frontend esté listo
  const frontendReady = await waitForFrontend();
  
  if (!frontendReady) {
    log('\n[ERROR] Frontend no respondió en el tiempo esperado', colors.yellow);
    frontend.kill();
    backend.kill();
    process.exit(1);
  }
  
  // Paso 4: Iniciar Electron usando execSync (maneja mejor paths con espacios)
  log('[4/4] Iniciando Electron...', colors.cyan);
  
  try {
    const electronCmd = 'npx electron electron/main.js';
    execSync(electronCmd, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true
    });
  } catch (error) {
    log(`\n[ERROR] Error al iniciar Electron: ${error.message}`, colors.yellow);
  }
  
  // Cuando Electron se cierra, limpiar todo
  cleanup();
}

// Función de limpieza
function cleanup() {
  log('\n[STOP] Deteniendo servicios...', colors.yellow);
  process.exit(0);
}

// Manejo de señales
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Ejecutar
startElectron().catch((error) => {
  log(`\n[ERROR] Error fatal: ${error.message}`, colors.yellow);
  console.error(error);
  process.exit(1);
});
