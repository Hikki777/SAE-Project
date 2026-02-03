const { spawn } = require('child_process');
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
 * Matar proceso en puerto específico (Windows/Linux/Mac)
 * Solución sin shell=true para evitar deprecation warnings
 */
async function killPort(port) {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // Windows: usar tasklist + taskkill
      const { execSync } = require('child_process');
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
        const pids = output.match(/\s+(\d+)\s*$/gm);
        if (pids && pids.length > 0) {
          const uniquePids = [...new Set(pids.map(p => p.trim()))];
          for (const pid of uniquePids) {
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
              log(`[AUTO-CLEAN] PID ${pid} liberado`, colors.yellow);
            } catch (e) {
              // Ignorar errores, el puerto puede ya estar libero
            }
          }
        }
      } catch (e) {
        // Ignorar errores, el puerto probablemente está libre
      }
      resolve();
    } else {
      // Linux/Mac: usar lsof + kill
      const { execSync } = require('child_process');
      try {
        const output = execSync(`lsof -i :${port} -t`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
        const pids = output.trim().split('\n').filter(p => p.trim());
        if (pids && pids.length > 0) {
          for (const pid of pids) {
            try {
              execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
              log(`[AUTO-CLEAN] PID ${pid} liberado`, colors.yellow);
            } catch (e) {
              // Ignorar errores
            }
          }
        }
      } catch (e) {
        // Ignorar errores
      }
      resolve();
    }
  });
}

/**
 * Iniciar Electron con backend y frontend
 */
async function startElectron() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('  [ELECTRON] Iniciando aplicación Electron', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  // Paso 0: Limpieza preventiva de puertos
  await killPort(5000);
  await killPort(5173);
  await killPort(5174);
  log('[AUTO-CLEAN] Puertos verificados y limpios.', colors.green);
  
  // Paso 1: Iniciar backend (usando gestor de memoria dinámico)
  log('[1/4] Iniciando backend...', colors.cyan);
  
  const backend = spawn('node', ['scripts/start-dynamic.js', 'backend/server.js'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    cwd: path.join(__dirname, '..')
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
  
  const npxCommand = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : '/bin/bash';
  const npxArgs = process.platform === 'win32' 
    ? ['/c', 'npm', 'run', 'dev']
    : ['-c', 'npm run dev'];
  
  const frontend = spawn(npxCommand, npxArgs, {
    cwd: path.join(__dirname, '../frontend'),
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: false
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
  
  // Paso 4: Iniciar Electron
  log('[4/4] Iniciando Electron...', colors.cyan);
  
  const electronPath = process.platform === 'win32' 
    ? path.join(__dirname, '..', 'node_modules', '.bin', 'electron.cmd')
    : path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

  // En Windows, usar cmd /c para ejecutar electron.cmd
  const shellCommand = process.platform === 'win32' 
    ? `"${electronPath}" electron/main.js`
    : electronPath;

  const electron = spawn(process.platform === 'win32' ? 'cmd.exe' : electronPath, 
    process.platform === 'win32' ? ['/c', shellCommand] : ['electron/main.js'],
    {
      stdio: 'inherit',
      shell: false,
      cwd: path.join(__dirname, '..')
    }
  );
  
  electron.on('error', (err) => {
    log(`\n[ERROR] Error al iniciar Electron: ${err.message}`, colors.yellow);
    frontend.kill();
    backend.kill();
    process.exit(1);
  });
  
  // Función de limpieza robusta
  const fullCleanup = async () => {
    try {
      log('\n[STOP] Deteniendo servicios y liberando puertos...', colors.yellow);
      
      // 1. Matar procesos hijos conocidos si existen
      if (electron) electron.kill();
      if (frontend) frontend.kill();
      if (backend) backend.kill();
      
      // 2. Limpieza forzada de puertos
      await killPort(5000);
      await killPort(5173);
      await killPort(5174);
      
      log('[STOP] Limpieza completada. Hasta luego!', colors.green);
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  };
  
  electron.on('exit', async (code) => {
    log('\n[ELECTRON] Aplicación cerrada manualmente', colors.cyan);
    await fullCleanup();
  });
  
  process.on('SIGINT', fullCleanup);
  process.on('SIGTERM', fullCleanup);
  process.on('SIGHUP', fullCleanup);
  
  // Mantener el proceso vivo
  process.stdin.resume();
}

// Ejecutar
startElectron().catch((error) => {
  log(`\n[ERROR] Error fatal: ${error.message}`, colors.yellow);
  console.error(error);
  process.exit(1);
});
