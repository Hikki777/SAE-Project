# Changelog — SAE v1.0.5

> **Fecha de lanzamiento:** 18 de Febrero de 2026  
> **Tipo:** Corrección crítica + mejoras de instalación

---

## Resumen

Esta versión corrige un error crítico que impedía el correcto funcionamiento del programa instalado en Windows: el proceso backend (servidor Node.js) nunca se iniciaba en producción. Además se mejora significativamente la experiencia del instalador con progreso visual, etiquetas de estado y mensajes informativos.

---

## Cambios

### 🔴 Corrección Crítica — `electron/main.js`

**Problema:** Al instalar SAE mediante el instalador `.exe` y ejecutarlo, la ventana de Electron se abría pero las APIs no respondían porque el backend nunca era iniciado. El script `electron/main.js` solo cargaba el frontend, sin arrancar el servidor.

**Solución:**
- Se agregó `startBackend()`: función que en **modo producción** hace `spawn` de `node.exe` (empaquetado en `extraResources`) ejecutando `scripts/start-dynamic.js` → `backend/server.js`.
- Se agregó `waitForBackend()`: polling (máx 30 intentos) a `http://localhost:5000/api/health` antes de cargar la UI.
- Se agrega **ventana splash** (pantalla de carga) animada mientras se inicializa el backend.
- Se agrega **diálogo de error** si el backend no puede iniciarse, en lugar de un crash silencioso.
- Se agrega `stopBackend()` llamado en `window-all-closed` y `before-quit` para matar limpiamente el proceso backend al cerrar la app.
- Logging mejorado con prefijo `[Electron]` / `[Electron][ERROR]`.

### 🟡 Mejora del Instalador — `build/installer.nsh`

El archivo estaba prácticamente vacío (solo 6 líneas). Se reescribió completamente con:

| Macro | Descripción |
|-------|-------------|
| `customHeader` | Texto de marca en barra inferior: `SAE v1.0.5 \| Sistema de Administración Educativa \| GPL-3.0` |
| `customInit` | Mensajes de bienvenida, detección de versión anterior instalada |
| `customInstall` | Pasos visibles numerados (1/4 a 3/4): preparar dirs, copiar archivos, instalar BD |
| `customInstallSuccess` | Paso 4/4: instrucciones de inicio, ruta instalada, link a soporte |
| `customInstallFailed` | Causas probables del error, link a issues de GitHub |
| `customUninstall` | Aviso de que los datos del usuario (BD, uploads, backups) **no serán eliminados** |
| `customUninstallSuccess` | Confirmación limpia |

Directorios creados automáticamente durante la instalación:
- **Ruta de Datos Escribible**: Se movió la base de datos y los uploads a `%APPDATA%\SAE` para evitar errores de permisos en `C:\Program Files`.
- **Logs Persistentes**: Se añadió guardado de logs en `%APPDATA%\SAE\logs\backend.log` para facilitar el soporte técnico.
- **Corrección de URL API**: Se corrigió `VITE_API_URL` para soportar correctamente el protocolo `file://` de Electron.
- **Íconos**: Se corrigió la visualización del favicon y el ícono del instalador.

### 🟡 Mejora del Instalador — `build/installer.nsh`

Se reescribió el script de instalación para:
- Usar solo caracteres ASCII (evita errores de ejecución en Windows).
- Mostrar pasos detallados de progreso.
- Crear automáticamente la estructura de directorios en `%APPDATA%\SAE` y `$INSTDIR`.

### 🔵 Actualización de Versiones


| Archivo | Versión Anterior | Versión Nueva |
|---------|-----------------|---------------|
| `package.json` (raíz) | `1.0.4` | `1.0.5` |
| `frontend/package.json` | `1.0.1` | `1.0.5` |
| `QUICK_START.md` | `1.0.2` | `1.0.5` |
| `build/installer-complete.nsh` | `1.0.1` | `1.0.5` |
| `build/installer.nsh` | n/a (vacío) | `1.0.5` |

---

## Archivos Modificados

```
electron/main.js                   ← Reescrito (backend lifecycle + splash)
build/installer.nsh                ← Reescrito (NSIS completo)
build/installer-complete.nsh       ← Versión actualizada (no usado en build)
package.json                       ← version: 1.0.5
frontend/package.json              ← version: 1.0.5
QUICK_START.md                     ← version: 1.0.5
```

---

## Cómo Actualizar

```powershell
# Compilar el nuevo instalador
npm run dist:win

# El instalador estará en:
# release/SAE-1.0.5-Setup.exe
```

---

## Notas Técnicas

- El `electron/main.js` en modo **desarrollo** (`!app.isPackaged`) no arranca el backend, comportamiento idéntico al anterior (el desarrollador corre el backend por separado).
- La splash screen es HTML embebido (sin archivo externo), compatible con ASAR.
- El path de `node.exe` se lee de `process.resourcesPath`, que corresponde a `extraResources` configurado en `package.json`.

### 🟢 Correcciones RC1 (19 Feb 2026)

Se aplicaron 9 parches adicionales para garantizar la estabilidad del instalador final:

1. **Ruta `userData` forzada**: Se fija en `%APPDATA%\SAE` para evitar problemas con nombres de usuario que contengan espacios o tildes.
2. **Backslashes en `DATABASE_URL`**: Se convierten a separadores tipo Unix (`/`) para compatibilidad total con Prisma SQLite en Windows.
3. **Íconos de Splash**: Se corrigió la ruta de carga de íconos en producción (`process.resourcesPath`) para que la ventana de carga muestre el logo correctamente.
4. **Íconos de Ventana Principal**: Se aplicó la misma corrección de ruta para el ícono de la barra de tareas.
5. **Fallback de Emoji eliminado**: La splash screen ya no muestra un emoji si falla la carga del logo (ahora falla silenciosamente sin romper la estética).
6. **Build Icon**: Se apuntó `win.icon` a `frontend/public/logo.ico` en `package.json`.
7. **Instalador NSIS**: Se actualizaron los íconos del instalador/desinstalador a la ruta correcta.
8. **Progreso de Instalación**: Se añadió `frontend/dist` al `asarUnpack` para que la barra de progreso del instalador sea más fluida y realista.
9. **Recursos Extra**: Se incluyeron explícitamente `logo.png` y `logo.ico` en `extraResources` para su acceso en runtime.
