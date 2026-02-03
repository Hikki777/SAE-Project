# Solución de Problemas del Instalador

## Problemas Resueltos

### 1. ✓ Logo No Se Mostraba en el Instalador
**Causa:** El instalador estaba buscando el logo en `build/icon.ico` pero el logo estaba en `frontend/public/logo.ico`

**Solución Implementada:**
- Se actualizó `package.json` para referenciar el logo correcto:
  ```json
  "win": {
    "icon": "frontend/public/logo.ico"
  },
  "nsis": {
    "installerIcon": "frontend/public/logo.ico",
    "uninstallerIcon": "frontend/public/logo.ico",
    "installerHeaderIcon": "frontend/public/logo.ico"
  }
  ```

### 2. ✓ No Se Mostraban Detalles de Archivos Instalados
**Causa:** El script NSIS personalizado era muy básico y no configuraba los detalles de instalación

**Solución Implementada:**
- Se mejoró significativamente `build/installer.nsh` con:
  - Macros `customHeader` para mostrar información
  - Macros `customInit` para detalles iniciales
  - Configuración `SetDetailsPrint` para mostrar lista de archivos
  - Mensajes de progreso en cada fase

### 3. ✓ Barra de Progreso No Era Acorde al Progreso Real
**Causa:** Falta de configuración detallada en el script NSIS

**Solución Implementada:**
- Se agregaron macros para:
  - Mostrar detalles en tiempo real
  - Mensajes de progreso `DetailPrint`
  - Configuración `SetDetailsPrint listonly` para ver archivos siendo copiados

### 4. ✓ El Programa No Se Ejecutaba Después de Instalar
**Causa:** 
- Problemas con rutas de Prisma en producción
- Sin manejo de errores en Electron
- Falta de configuración de variables de entorno

**Soluciones Implementadas:**

#### En `electron/main.js`:
```javascript
// Crear directorios de datos en producción
const appDataPath = app.getPath("appData");
const saeDataPath = path.join(appDataPath, "SAE", "data");
if (!fs.existsSync(saeDataPath)) {
  fs.mkdirSync(saeDataPath, { recursive: true });
}
process.env.NODE_ENV = "production";

// Verificar que los archivos existan antes de cargar
if (fs.existsSync(indexPath)) {
  mainWindow.loadFile(indexPath);
} else {
  dialog.showErrorBox("Error", "No se pudo encontrar los archivos...");
}

// Manejo de errores
mainWindow.webContents.on("crashed", () => {
  dialog.showErrorBox("Error", "La aplicación ha encontrado un error...");
});
```

#### En `backend/prismaClient.js`:
```javascript
// Detectar ambiente y configurar rutas
if (!url) {
  if (process.env.NODE_ENV !== 'production') {
    url = 'file:./prisma/dev.db';
  } else {
    const appDataPath = process.env.APPDATA || process.env.HOME;
    const dbPath = path.join(appDataPath, "SAE", "data", "dev.db");
    url = `file:${dbPath}`;
  }
}
```

#### En `package.json`:
```json
"extraResources": [
  { "from": "prisma/schema.prisma", "to": "prisma/schema.prisma" },
  { "from": "prisma/migrations", "to": "prisma/migrations" },
  { "from": "node_modules/.prisma", "to": "node_modules/.prisma" },
  { "from": "node_modules/@prisma/client", "to": "node_modules/@prisma/client" }
]
```

## Instrucciones para Reconstruir el Instalador

### Opción 1: Usando Script Automatizado (Recomendado)

```powershell
# Abre PowerShell como administrador
cd "C:\Users\Kevin\Documents\Proyectos\Sistema de Administración Educativa"

# Ejecuta el script de reconstrucción
powershell -ExecutionPolicy Bypass -File .\scripts\rebuild-installer.ps1
```

Este script hará automáticamente:
1. Limpiar caché de electron-builder
2. Eliminar release anterior
3. Compilar el frontend
4. Generar el instalador
5. Verificar que se creó correctamente

### Opción 2: Manual

```powershell
# 1. Limpiar caché
Remove-Item -Recurse -Force node_modules\.cache
Remove-Item -Recurse -Force release

# 2. Compilar frontend
npm run build:frontend

# 3. Generar instalador
npm run dist:win

# 4. Verificar
Get-ChildItem -Path release -Filter "*.exe" -Recurse
```

### Opción 3: Verificación Antes de Generar

```powershell
# Verificar que todo esté configurado
node scripts/verify-installer.js

# Si pasa todas las verificaciones
npm run dist:win
```

## Verificación del Instalador Generado

Después de generar el instalador, verifica que:

1. **Logo está visible**: Abre el `.exe` y debería ver el logo en la ventana del instalador
2. **Detalles de archivos**: Durante la instalación, verás una lista de archivos siendo copiados
3. **Barra de progreso**: La barra progresa de acuerdo a los archivos siendo copiados
4. **Ejecución**: Después de instalar, la aplicación debería abrir sin errores

## Archivos Modificados

### Configuración
- [package.json](package.json) - Actualizado rutas de logo y extraResources
- [build/installer.nsh](build/installer.nsh) - Mejorado script NSIS con detalles

### Backend/Electron
- [electron/main.js](electron/main.js) - Agregado manejo de entorno y errores
- [backend/prismaClient.js](backend/prismaClient.js) - Configurado para producción

### Scripts de Utilidad
- [scripts/rebuild-installer.ps1](scripts/rebuild-installer.ps1) - Script automatizado
- [scripts/verify-installer.js](scripts/verify-installer.js) - Verificación de configuración

## Solución de Problemas Adicionales

### Si la aplicación aún no se ejecuta después de instalar:

1. **Verificar que el frontend se compiló:**
   ```powershell
   Test-Path "frontend\dist\index.html"  # Debería retornar True
   ```

2. **Verificar que Prisma se incluyó:**
   - Abre en Explorador: `C:\Users\TuUsuario\AppData\Local\Programs\SAE`
   - Verifica que exista la carpeta `node_modules\.prisma`

3. **Ver logs de error:**
   - Abre una terminal en `C:\Users\TuUsuario\AppData\Roaming\SAE`
   - Revisa los archivos de log si existen

4. **Reinstalar completamente:**
   ```powershell
   # Desinstalar primero
   # Luego ejecutar:
   npm run dist:win
   # E instalar el nuevo ejecutable
   ```

## Próximos Pasos Recomendados

1. ✓ Reconstruir el instalador usando el script automatizado
2. ✓ Instalar en una máquina de prueba
3. ✓ Verificar que todas las funcionalidades funcionen
4. ✓ Hacer pruebas de reinstalación y desinstalación
5. ✓ Verificar que las bases de datos se crean correctamente

## Referencias

- NSIS Documentation: https://nsis.sourceforge.io/
- Electron Builder: https://www.electron.build/
- Prisma in Production: https://www.prisma.io/docs/guides/deployment
