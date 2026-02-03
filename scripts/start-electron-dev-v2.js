const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');

// Configurar UTF-8 en Windows
if (process.platform === 'win32') {
  process.stdout.setEncoding('utf8');
  process.stderr.setEncoding('utf8');
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Limpiar puertos ocupados (Windows/Linux/Mac)
 */
async function killPort(port) {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // Windows: usar netstat + taskkill
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
        const pids = output.match(/\s+(\d+)\s*$/gm);
        if (pids && pids.length > 0) {
          const uniquePids = [...new Set(pids.map(p => p.trim()))];
          for (const pid of uniquePids) {
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
              log(`[AUTO-CLEAN] Puerto ${port} - PID ${pid} liberado`, colors.yellow);
            } catch (e) {}
          }
        }
      } catch (e) {}
      resolve();
    } else {
      // Linux/Mac: usar lsof + kill
      try {
        const pids = execSync(`lsof -i :${port} -t`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] })
          .trim()
          .split('\n')
          .filter(p => p);
        for (const pid of pids) {
          try {
            process.kill(-pid, 'SIGTERM');
            log(`[AUTO-CLEAN] Puerto ${port} - PID ${pid} liberado`, colors.yellow);
          } catch (e) {}
        }
      } catch (e) {}
      resolve();
    }
  });
}

/**
 * Esperar a que el backend esté listo
 */
async function waitForBackend() {
  log('\n[ELECTRON DEV] Esperando a que el backend esté listo...', colors.yellow);
  
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:5000/api/health', (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject();
          }
        });
        req.on('error', reject);
        req.setTimeout(1000);
      });
      
      log('[ELECTRON DEV] [OK] Backend listo!', colors.green);
      return true;
    } catch (error) {
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  log('[ELECTRON DEV] [FAIL] Backend no respondio', colors.red);
  return false;
}

/**
 * Esperar a que el frontend esté listo
 */
async function waitForFrontend() {
  log('[ELECTRON DEV] Esperando a que el frontend esté listo...', colors.yellow);
  
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:5173/', (res) => {
          if (res.statusCode === 200 || res.statusCode === 304) {
            resolve();
          } else {
            reject();
          }
        });
        req.on('error', reject);
        req.setTimeout(1000);
      });
      
      log('[ELECTRON DEV] [OK] Frontend listo!', colors.green);
      return true;
    } catch (error) {
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  log('[ELECTRON DEV] [FAIL] Frontend no respondio', colors.red);
  return false;
}

/**
 * Iniciar Electron
 */
async function startElectronDev() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('  [ELECTRON DEV] Iniciando Sistema de Administración Educativa', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  const rootDir = path.join(__dirname, '..');
  const isWindows = process.platform === 'win32';

  // PASO 0: Limpiar puertos
  log('[0/4] Limpiando puertos...', colors.yellow);
  await killPort(5000);
  await killPort(5173);
  log('[0/4] [OK] Puertos limpios', colors.green);

  // Paso 1: Iniciar backend
  log('[1/4] Iniciando backend...', colors.cyan);
  const backend = spawn('node', [
    'scripts/start-dynamic.js',
    'backend/server.js'
  ], {
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: rootDir,
    detached: true,
    windowsHide: true,
    env: { ...process.env, NODE_ENV: 'development', NODE_NO_WARNINGS: '1' }
  });
  
  // Redirigir output del backend
  backend.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  backend.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  backend.unref();

  backend.on('error', (err) => {
    log(`[ELECTRON DEV] Error al iniciar backend: ${err.message}`, colors.red);
    process.exit(1);
  });

  // Paso 2: Esperar backend
  if (!(await waitForBackend())) {
    log('[ELECTRON DEV] Abortando: Backend no respondió', colors.red);
    backend.kill();
    process.exit(1);
  }

  // Paso 3: Iniciar frontend
  log('[2/4] Iniciando frontend...', colors.cyan);
  
  let frontend;
  
  if (isWindows) {
    // En Windows, usar PowerShell con -WindowStyle Hidden para ocultar completamente
    frontend = spawn('powershell.exe', [
      '-WindowStyle', 'Hidden',
      '-NoProfile',
      '-Command', 'npm run dev:frontend'
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: rootDir,
      detached: false,
      windowsHide: true,
      env: { ...process.env, NODE_NO_WARNINGS: '1', FORCE_COLOR: '0' }
    });
  } else {
    // En Linux/Mac
    frontend = spawn('npm', ['run', 'dev:frontend'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: rootDir,
      detached: true,
      env: { ...process.env, NODE_NO_WARNINGS: '1' }
    });
    frontend.unref();
  }
  
  // Redirigir output a este proceso
  frontend.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  frontend.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  frontend.on('error', (err) => {
    log(`[ELECTRON DEV] Error al iniciar frontend: ${err.message}`, colors.red);
    backend.kill();
    process.exit(1);
  });

  // Paso 4: Esperar frontend
  if (!(await waitForFrontend())) {
    log('[ELECTRON DEV] Abortando: Frontend no respondio', colors.red);
    backend.kill();
    frontend.kill();
    process.exit(1);
  }

  // Paso 5: Lanzar Electron
  log('[3/4] Iniciando Electron...', colors.cyan);
  
  let electron;
  
  if (isWindows) {
    // En Windows, usar PowerShell con -WindowStyle Hidden para ocultar completamente
    electron = spawn('powershell.exe', [
      '-WindowStyle', 'Hidden',
      '-NoProfile',
      '-Command', 'npx electron electron/main.js'
    ], {
      stdio: ['ignore', 'ignore', 'ignore'],
      cwd: rootDir,
      detached: false,
      windowsHide: true,
      env: { ...process.env, NODE_NO_WARNINGS: '1' }
    });
  } else {
    // En Linux/Mac
    electron = spawn('npx', ['electron', 'electron/main.js'], {
      stdio: ['ignore', 'ignore', 'ignore'],
      cwd: rootDir,
      detached: true,
      env: { ...process.env, NODE_NO_WARNINGS: '1' }
    });
    electron.unref();
  }

  electron.on('error', (err) => {
    log(`[ELECTRON DEV] Error al iniciar Electron: ${err.message}`, colors.red);
    backend.kill();
    frontend.kill();
    process.exit(1);
  });

  log('[4/4] [OK] Todos los procesos iniciados correctamente', colors.green);
  log('\n' + '='.repeat(60), colors.cyan);
  log('  Sistema en ejecucion. Presiona Ctrl+C para detener.', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  const os = require('os');
  let sigintReceived = false;
  
  // Guardar los PIDs de los procesos para poder matarlos después
  const pids = {
    backend: backend.pid,
    frontend: frontend.pid,
    electron: electron.pid
  };
  
  log(`[ELECTRON DEV] Backend PID: ${pids.backend}`, colors.yellow);
  log(`[ELECTRON DEV] Frontend PID: ${pids.frontend}`, colors.yellow);
  log(`[ELECTRON DEV] Electron PID: ${pids.electron}\n`, colors.yellow);

  // Manejar Ctrl+C para cerrar todos los procesos correctamente
  process.on('SIGINT', () => {
    if (sigintReceived) return;  // Prevenir múltiples Ctrl+C
    
    sigintReceived = true;
    log('\n[ELECTRON DEV] Cerrando aplicación...', colors.yellow);
    
    if (os.platform() === 'win32') {
      // En Windows, usar taskkill
      const { execSync } = require('child_process');
      try {
        if (pids.electron) execSync(`taskkill /PID ${pids.electron} /F /T`, { stdio: 'ignore' });
        if (pids.frontend) execSync(`taskkill /PID ${pids.frontend} /F /T`, { stdio: 'ignore' });
        if (pids.backend) execSync(`taskkill /PID ${pids.backend} /F /T`, { stdio: 'ignore' });
      } catch (e) {}
    } else {
      // En Linux/Mac, usar kill
      try {
        if (pids.electron) process.kill(-pids.electron, 'SIGTERM');
      } catch (e) {}
      setTimeout(() => {
        try {
          if (pids.frontend) process.kill(-pids.frontend, 'SIGTERM');
        } catch (e) {}
        setTimeout(() => {
          try {
            if (pids.backend) process.kill(-pids.backend, 'SIGTERM');
          } catch (e) {}
        }, 300);
      }, 300);
    }
    
    setTimeout(() => {
      log('[ELECTRON DEV] ✓ Aplicación cerrada', colors.green);
      log('[ELECTRON DEV] Limpiando puertos...', colors.yellow);
      
      // Limpiar puertos al salir
      Promise.all([killPort(5000), killPort(5173)]).then(() => {
        log('[ELECTRON DEV] ✓ Puertos limpios', colors.green);
        process.exit(0);
      });
    }, 1000);
  });

  // Si Electron falla, SOLO mostrar log - NO hacer nada automático
  electron.on('exit', (code, signal) => {
    log(`[ELECTRON DEV] Electron salió (código: ${code}, señal: ${signal})`, colors.yellow);
    
    // Solo informar, sin cerrar nada
    if (!sigintReceived) {
      if (code === 0) {
        log('[ELECTRON DEV] Puedes cerrar Electron nuevamente con Ctrl+C.', colors.yellow);
      } else if (code === null && signal === 'SIGTERM') {
        // Cierre normal por SIGTERM
        log('[ELECTRON DEV] Electron cerrado correctamente.', colors.green);
      } else {
        log('[ELECTRON DEV] Backend y Frontend siguen en ejecución.', colors.cyan);
        log('[ELECTRON DEV] Presiona Ctrl+C para detener todo.', colors.yellow);
      }
    }
  });
}

startElectronDev().catch(err => {
  log(`[ELECTRON DEV] Error fatal: ${err.message}`, colors.red);
  process.exit(1);
});
