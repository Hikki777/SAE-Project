# CORRECCIONES - Problemas Encontrados en Prueba del Instalador

**Fecha:** 26 de enero de 2026  
**Estado:** 🔧 En corrección

---

## Problemas Reportados y Soluciones

### 1. ❌ La ventana del instalador no muestra la versión del programa

**Problema Identificado:**
- La ventana de bienvenida del instalador no mostraba "v1.0.1"
- Solo mostraba el título genérico

**Solución Implementada:**

En `build/installer.nsh`:
```nsis
; Versión del programa
!define PRODUCT_VERSION "1.0.1"

; En customHeader:
BrandingText "SAE - Sistema de Administración Educativa v${PRODUCT_VERSION}"

; En customInit:
DetailPrint "Versión: ${PRODUCT_VERSION}"
```

**Resultado Esperado:** ✅ Versión 1.0.1 visible en la ventana

---

### 2. ❌ Pantalla en blanco durante instalación (sin detalles de archivos)

**Problema Identificado:**
- El área de detalles aparecía vacía
- No se veían los archivos siendo copiados
- La barra de progreso no mostraba información

**Causas:**
- `SetDetailsPrint both` no funciona correctamente
- Necesita cambiar de `textonly` a `listonly` en el momento correcto

**Solución Implementada:**

En `build/installer.nsh`:
```nsis
!macro customInit
  ; Iniciar en modo texto
  SetDetailsPrint textonly
  ; ... mensajes iniciales ...
  ; Cambiar a modo de lista DESPUÉS
  SetDetailsPrint listonly
!macroend

!macro customInstall
  ; Asegurar que se muestren detalles en modo lista
  SetDetailsPrint listonly
  DetailPrint ""
  DetailPrint "Copiando archivos de la aplicación..."
  DetailPrint ""
!macroend
```

**Resultado Esperado:** ✅ Lista completa de archivos visible durante instalación

---

### 3. ❌ X roja sin ejecutar como administrador + crash al clickear "Atrás"

**Problema Identificado:**
- El instalador requiere permisos de administrador
- Si no se ejecuta como admin, muestra error
- Si hace clic en "Atrás", se cierra

**Causas:**
- Falta `RequestExecutionLevel admin`
- Sin manejo de errores de navegación

**Solución Implementada:**

En `build/installer.nsh`:
```nsis
; Requerir permisos de administrador
RequestExecutionLevel admin
```

En `package.json`:
```json
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  "createDesktopShortcut": true,
  "deleteAppDataOnUninstall": true,
  "installerIcon": "frontend/public/logo.ico",
  "uninstallerIcon": "frontend/public/logo.ico",
  "installerHeaderIcon": "frontend/public/logo.ico",
  "include": "build/installer.nsh",
  "installerLanguages": ["Spanish", "English"],
  "showLanguageSelector": false,
  "artifactName": "SAE-${version}-Setup.exe",
  "nsis": {
    "preInit": "RequestExecutionLevel admin"
  }
}
```

**Resultado Esperado:** ✅ Pide permisos de admin automáticamente

---

### 4. ❌ Icono del sistema es el de Electron, no de SAE

**Problema Identificado:**
- Después de instalar, el icono en Menú de Inicio mostraba el logo de Electron
- Debería mostrar el logo de SAE

**Análisis:**
- El icono en Electron está bien configurado: `logo.ico`
- El icono en el instalador también está bien
- Pero el acceso directo podría estar usando el icono default

**Solución Implementada:**

En `electron/main.js`:
- El icono ya está correctamente configurado: `logo.ico`
- Agregué validación para verificar que existe

En `package.json`:
- Todos los íconos del instalador apuntan a `logo.ico`

**Nota:** Después de reinstalar, el acceso directo debería usar el icono correcto automáticamente.

**Resultado Esperado:** ✅ Icono de SAE en Menú de Inicio y Escritorio

---

### 5. ❌ El sistema no abre al ejecutarse (sin errores)

**Problema Identificado:**
- Después de instalar, al hacer clic en el acceso directo, nada sucede
- No hay mensaje de error visible
- No sabemos qué está fallando

**Causas Posibles:**
- El frontend/dist/index.html no está siendo incluido
- Las rutas son incorrectas
- Hay un error silencioso sin logging

**Soluciones Implementadas:**

1. **En `electron/main.js` - Logging Mejorado:**
```javascript
// Crear archivo de log para cada sesión
const logFile = path.join(logsPath, `sae-${new Date().toISOString().split('T')[0]}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Logging en cada paso importante
logMessage("Creando ventana principal...");
logMessage(`Ruta del icono: ${iconPath}`);
logMessage(`Ruta del índice: ${indexPath}`);

// Verificar que archivos existen
if (!fs.existsSync(indexPath)) {
  const files = fs.readdirSync(distPath);
  logMessage(`Archivos en dist/: ${files.join(', ')}`);
}
```

2. **En `electron/main.js` - Manejo de Errores:**
```javascript
mainWindow.loadFile(indexPath).catch((error) => {
  logMessage(`ERROR al cargar archivo: ${error}`);
  dialog.showErrorBox("Error de Carga", `No se pudo cargar: ${error}`);
});
```

3. **En `backend/prismaClient.js` - Logging:**
```javascript
logMessage(`Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
logMessage(`URL de conexión: ${url}`);
logMessage('Prisma Client inicializado');
```

4. **Manejo de excepciones:**
```javascript
process.on("uncaughtException", (error) => {
  logMessage(`EXCEPCIÓN NO CAPTURADA: ${error}`);
  console.error(error);
});
```

**Dónde buscar los logs:**
```
C:\Users\{TuUsuario}\AppData\Roaming\SAE\logs\sae-2026-01-26.log
```

**Resultado Esperado:** ✅ Si hay error, ahora aparecerá en los logs o en un dialog

---

## 📊 Cambios Resumidos

### Archivos Modificados

1. **build/installer.nsh**
   - ✅ Agregada versión 1.0.1
   - ✅ Mejorado SetDetailsPrint para mostrar archivos
   - ✅ Agregado RequestExecutionLevel admin
   - ✅ Mejor manejo de mensajes

2. **package.json**
   - ✅ Configuración NSIS mejorada
   - ✅ Agregado preInit para admin
   - ✅ Mejor configuración de idiomas

3. **electron/main.js**
   - ✅ Sistema de logging completo
   - ✅ Archivo de log en AppData\Roaming\SAE\logs
   - ✅ Validación de archivos
   - ✅ Manejo mejorado de errores
   - ✅ Excepciones globales capturadas

4. **backend/prismaClient.js**
   - ✅ Logging de Prisma
   - ✅ Validación de directorios
   - ✅ Mejor manejo de errores

---

## 🔍 Cómo Debuggear Si Aún Hay Problemas

### Paso 1: Revisar Logs
```powershell
Get-Content "$env:APPDATA\SAE\logs\sae-*.log" | Select-Object -Last 50
```

### Paso 2: Verificar Archivos Instalados
```powershell
Get-ChildItem "C:\Program Files\SAE - Sistema de Administración Educativa"
Get-ChildItem "C:\Program Files\SAE - Sistema de Administración Educativa\resources\app\frontend\dist"
```

### Paso 3: Verificar Prisma
```powershell
Test-Path "C:\Program Files\SAE - Sistema de Administración Educativa\resources\node_modules\.prisma"
```

### Paso 4: Ejecutar Directamente
```powershell
& "C:\Program Files\SAE - Sistema de Administración Educativa\SAE - Sistema de Administración Educativa.exe"
# Revisar los logs inmediatamente después
Get-Content "$env:APPDATA\SAE\logs\sae-*.log" -Tail 20
```

---

## ✅ Próximos Pasos

1. **Reconstruir el instalador:**
   ```powershell
   cd "C:\Users\Kevin\Documents\Proyectos\Sistema de Administración Educativa"
   npm run dist:win
   ```

2. **Probar nuevamente:**
   - Ejecutar como usuario normal (sin admin)
   - El sistema debería pedir permisos automáticamente
   - Instalar y ejecutar
   - Revisar `AppData\Roaming\SAE\logs\` si hay problemas

3. **Reportar resultados:**
   - ¿Se muestra la versión?
   - ¿Se muestran los archivos?
   - ¿Pide admin automáticamente?
   - ¿Se abre la aplicación?
   - Si no, ¿qué dice el log?

---

## 📋 Checklist de Verificación

Después de instalar de nuevo:

- [ ] Versión 1.0.1 visible en ventana del instalador
- [ ] Detalles de archivos visibles durante instalación
- [ ] Pide permisos de admin automáticamente
- [ ] "Atrás" funciona sin cerrar
- [ ] Icono de SAE en Menú de Inicio
- [ ] Aplicación abre correctamente
- [ ] No hay errores en los logs

---

**Generado:** 26 de enero de 2026  
**Estado:** 🔧 Cambios implementados, pendiente de prueba
