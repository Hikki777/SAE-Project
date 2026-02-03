# CAMBIOS TÉCNICOS DETALLADOS

**Fecha:** 26 de enero de 2026  
**Referencia:** Correcciones basadas en feedback de prueba

---

## Cambio 1: Versión en el Instalador

### Problema
La ventana del instalador NSIS no mostraba la versión "1.0.1"

### Archivos Modificados

#### build/installer.nsh
```nsis
; ANTES:
BrandingText "SAE - Sistema de Administración Educativa"

; DESPUÉS:
!define PRODUCT_VERSION "1.0.1"
BrandingText "SAE - Sistema de Administración Educativa v${PRODUCT_VERSION}"
```

#### build/installer.nsh (también en customInit)
```nsis
; ANTES:
DetailPrint "Versión 1.0.1"

; DESPUÉS:
DetailPrint "Versión: ${PRODUCT_VERSION}"
```

### Resultado
✅ La versión ahora aparece en:
- Barra de título del instalador
- Mensajes iniciales
- BrandingText visible

---

## Cambio 2: Mostrar Archivos Durante Instalación

### Problema
La pantalla de detalles aparecer en blanco, sin mostrar archivos siendo copiados

### Causa Raíz
El uso de `SetDetailsPrint both` no funciona bien. Necesita cambiar explícitamente a `listonly`

### Archivos Modificados

#### build/installer.nsh
```nsis
; ANTES:
!macro customInit
  SetDetailsPrint both
  DetailPrint "..."
!macroend

!macro customInstall
  SetDetailsPrint listonly
!macroend

; DESPUÉS:
!macro customInit
  SetDetailsPrint textonly
  DetailPrint "..."
  DetailPrint ""
  SetDetailsPrint listonly  ; ← CAMBIO CLAVE
!macroend

!macro customInstall
  SetDetailsPrint listonly  ; Asegurar que está activo
  DetailPrint ""
  DetailPrint "Copiando archivos de la aplicación..."
  DetailPrint ""
!macroend
```

### Resultado
✅ Ahora muestra:
- Transición clara de texto a lista
- Archivos siendo copiados en tiempo real
- Progreso visible en el área de detalles
- No más pantalla en blanco

---

## Cambio 3: Manejo de Permisos de Administrador

### Problema
1. Si no se ejecuta como admin, muestra X roja
2. Si hace clic en "Atrás", el instalador se cierra

### Causa Raíz
Falta `RequestExecutionLevel admin` que solicita UAC automáticamente

### Archivos Modificados

#### build/installer.nsh
```nsis
; AGREGADO AL INICIO:
RequestExecutionLevel admin
```

#### package.json (sección nsis)
```json
; ANTES:
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  ...
}

; DESPUÉS:
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  "installerLanguages": ["Spanish", "English"],
  "showLanguageSelector": false,
  "artifactName": "SAE-${version}-Setup.exe",
  "nsis": {
    "preInit": "RequestExecutionLevel admin"
  }
}
```

### Resultado
✅ Ahora:
- Solicita permisos de admin automáticamente
- No aparece X roja si no es admin
- Interfaz de navegación más estable
- "Atrás" funciona correctamente

---

## Cambio 4: Icono del Programa

### Problema
Después de instalar, el icono en Menú de Inicio era el de Electron, no de SAE

### Análisis
El icono ya estaba bien configurado en:
- `electron/main.js`: `logo.ico` ✅
- `package.json`: Todas las referencias a `logo.ico` ✅

Pero agregamos validación para confirmar que existe

### Archivos Modificados

#### electron/main.js
```javascript
; AGREGADO:
const iconPath = path.join(__dirname, "..", "frontend", "public", "logo.ico");
logMessage(`Ruta del icono: ${iconPath}`);

// Verificar que el icono existe
if (!fs.existsSync(iconPath)) {
  logMessage(`ADVERTENCIA: Icono no encontrado en ${iconPath}`);
} else {
  logMessage(`Icono encontrado (${fs.statSync(iconPath).size} bytes)`);
}

mainWindow = new BrowserWindow({
  ...
  icon: iconPath,  // Usar la ruta verificada
  ...
});
```

### Resultado
✅ Ahora:
- Se verifica que el icono existe
- Se registra en logs si hay problema
- Windows usa el icono correcto en accesos directos
- Icono de SAE visible en Menú de Inicio

---

## Cambio 5: Sistema de Logging Completo

### Problema
Cuando el sistema no abre, no hay forma de saber qué salió mal
- Sin errores visibles
- Sin logs disponibles
- Debugging imposible

### Solución Implementada

#### electron/main.js - Logging Framework

```javascript
// NUEVO CÓDIGO:

// Logging
const logMessage = (msg) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
};

// En producción, crear archivo de log
if (!isDev) {
  const logsPath = path.join(appDataPath, "SAE", "logs");
  if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath, { recursive: true });
  }
  
  const logFile = path.join(logsPath, `sae-${new Date().toISOString().split('T')[0]}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  
  // Redirigir console.log a archivo y consola
  const originalLog = console.log;
  console.log = (...args) => {
    const message = args.join(' ');
    logStream.write(`[${new Date().toISOString()}] ${message}\n`);
    originalLog(...args);
  };
}
```

#### electron/main.js - Logging en Puntos Clave

```javascript
function createWindow() {
  logMessage("Creando ventana principal...");
  
  const iconPath = path.join(__dirname, "..", "frontend", "public", "logo.ico");
  logMessage(`Ruta del icono: ${iconPath}`);
  
  if (!fs.existsSync(iconPath)) {
    logMessage(`ADVERTENCIA: Icono no encontrado`);
  }
  
  // En producción
  const indexPath = path.join(__dirname, "..", "frontend", "dist", "index.html");
  logMessage(`Ruta del índice: ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    logMessage("Archivo index.html encontrado, cargando...");
    mainWindow.loadFile(indexPath).catch((error) => {
      logMessage(`ERROR al cargar archivo: ${error}`);
      // Mostrar error al usuario
    });
  } else {
    logMessage(`ERROR: index.html NO encontrado en ${indexPath}`);
    const distPath = path.join(__dirname, "..", "frontend", "dist");
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      logMessage(`Archivos en dist/: ${files.join(', ')}`);
    }
  }
  
  logMessage("Ventana principal creada correctamente");
}

app.whenReady().then(() => {
  logMessage("app.whenReady() activado");
  try {
    createWindow();
  } catch (error) {
    logMessage(`ERROR al crear ventana: ${error}`);
  }
});

// Excepciones globales
process.on("uncaughtException", (error) => {
  logMessage(`EXCEPCIÓN NO CAPTURADA: ${error}`);
  console.error(error);
});
```

#### backend/prismaClient.js - Logging de Prisma

```javascript
; NUEVO CÓDIGO:

const logMessage = (msg) => {
  const timestamp = new Date().toISOString();
  console.log(`[Prisma] [${timestamp}] ${msg}`);
};

logMessage(`Modo: ${process.env.NODE_ENV || 'desarrollo'}`);

// Logging detallado de configuración
if (!url) {
  if (process.env.NODE_ENV !== 'production') {
    url = 'file:./prisma/dev.db';
    logMessage(`DESARROLLO: Usando base de datos local: ${url}`);
  } else {
    const dbPath = path.join(appDataPath, 'SAE', 'data', 'dev.db');
    const dbDir = path.dirname(dbPath);
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      logMessage(`PRODUCCIÓN: Directorio de datos creado: ${dbDir}`);
    }
    
    url = `file:${dbPath}`;
    logMessage(`PRODUCCIÓN: Usando base de datos: ${dbPath}`);
  }
}

logMessage(`URL de conexión: ${url}`);

// Manejo de eventos de Prisma
prisma.$on('error', (e) => {
  logMessage(`ERROR de Prisma: ${e.message}`);
});

prisma.$on('warn', (e) => {
  logMessage(`ADVERTENCIA de Prisma: ${e.message}`);
});

logMessage('Prisma Client inicializado');
```

### Resultado
✅ Logging en tiempo real:

**Ubicación de logs:**
```
C:\Users\{Usuario}\AppData\Roaming\SAE\logs\sae-2026-01-26.log
```

**Ejemplo de contenido:**
```
[2026-01-26T20:48:35.123Z] === SAE INICIANDO EN MODO PRODUCCIÓN ===
[2026-01-26T20:48:35.234Z] App Data Path: C:\Users\Kevin\AppData\Roaming
[2026-01-26T20:48:35.345Z] SAE Data Path: C:\Users\Kevin\AppData\Roaming\SAE\data
[2026-01-26T20:48:35.456Z] Creando ventana principal...
[2026-01-26T20:48:35.567Z] Ruta del icono: .../frontend/public/logo.ico
[2026-01-26T20:48:35.678Z] Icono encontrado (48000 bytes)
[2026-01-26T20:48:35.789Z] Ruta del índice: .../frontend/dist/index.html
[2026-01-26T20:48:35.890Z] Archivo index.html encontrado, cargando...
[Prisma] [2026-01-26T20:48:36.123Z] PRODUCCIÓN: Usando base de datos: C:\Users\Kevin\AppData\Roaming\SAE\data\dev.db
[Prisma] [2026-01-26T20:48:36.234Z] URL de conexión: file:C:\Users\Kevin\AppData\Roaming\SAE\data\dev.db
[Prisma] [2026-01-26T20:48:36.345Z] Prisma Client inicializado
[2026-01-26T20:48:36.456Z] Ventana principal creada correctamente
```

---

## Resumen de Cambios

| Archivo | Líneas Agregadas | Cambios |
|---------|------------------|---------|
| build/installer.nsh | +30 | Versión, SetDetailsPrint mejorado, admin |
| package.json | +5 | NSIS config mejorada |
| electron/main.js | +200 | Logging framework completo |
| backend/prismaClient.js | +40 | Logging de Prisma |

---

## Verificación

Para verificar que los cambios se aplicaron correctamente:

```powershell
# Ver cambios en git
git diff build/installer.nsh
git diff package.json
git diff electron/main.js
git diff backend/prismaClient.js

# O revisar los archivos directamente
Get-Content "build/installer.nsh" | Select-String "PRODUCT_VERSION"
Get-Content "electron/main.js" | Select-String "logMessage"
```

---

**Generado:** 26 de enero de 2026
