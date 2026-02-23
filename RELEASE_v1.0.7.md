# 🚀 SAE v1.0.7 - Release Info

**Fecha de Release**: 22 de febrero de 2026  
**Estado**: Production Ready ✅  

---

## 📝 Cambios en esta versión

### 🔊 Sistema de Audio Completamente Reescrito

**Problema corregido**: Los sonidos del sistema dependían de URLs externas de `mixkit.co`, lo que causaba que no funcionaran en producción (sistema local-only, sin internet).

✅ **Nuevo `soundService.js`** — Motor de sonidos local basado en Web Audio API
- Genera tonos sintetizados directamente en el navegador
- Funciona 100% offline y en Electron producción
- Sin archivos externos ni dependencias de red
- Sonidos diferenciados: login, error, notificación, logout, conexión

✅ **Archivos corregidos**:
- `notificationService.js` — Sonido de nueva notificación de equipo
- `LoginPage.jsx` — Sonidos de login exitoso y error de credenciales
- `ConnectionModal.jsx` — Sonidos de estados de conexión (connecting, synchronizing, connected, error)
- `App.jsx` — Sonido de cierre de sesión

### 🔧 Corrección de Llamadas Externas

✅ **`AsistenciasPanel.jsx`** — Eliminado fetch a `worldtimeapi.org`
- El panel de asistencias hacía una request externa para obtener la hora actual
- Reemplazado por `new Date().toLocaleString('es-ES')` (hora local del sistema)
- El sistema es local-only; la hora del sistema Windows es la correcta

### 📋 Sincronización de Cargos del Personal

✅ **`SetupWizard.jsx`** — Alineados los cargos con la validación del backend
- Eliminados cargos inválidos (`Administrador`, `Coordinador`) del Wizard de configuración
- Agregadas variantes correctas: `Secretaria`, `Secretario`, `Secretaria General`, `Secretario General`
- Ahora el wizard no puede generar datos que el backend rechace con error 400

✅ **`validation.js`** — Lista de cargos expandida en `validarCrearDocente` y `validarActualizarDocente`

---

## 🐛 Bugs Corregidos

| Bug | Archivo | Descripción |
|-----|---------|-------------|
| Audio sin internet | `notificationService.js`, `LoginPage.jsx`, `ConnectionModal.jsx` | URLs externas de mixkit.co reemplazadas |
| Ruta incorrecta de logout.mp3 | `App.jsx` | Ruta `/sounds/...` no funciona en `file://` de Electron |
| Llamada a worldtimeapi.org | `AsistenciasPanel.jsx` | Request externa innecesaria |
| Error 400 en wizard | `SetupWizard.jsx` | Cargos inválidos que el backend rechazaba |

---

## 📦 No hay cambios en el instalador

Esta versión contiene únicamente correcciones de bugs del frontend. No se requiere regenerar el instalador NSIS para despliegues ya instalados. Aplicar actualizando los archivos del frontend.

---

**Versión anterior**: v1.0.6  
**Tipo de release**: Patch (corrección de bugs)
