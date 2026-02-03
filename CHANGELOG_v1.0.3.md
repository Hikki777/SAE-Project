# Changelog - Versión 1.0.3

## 🔧 Corrección de Ventanas Emergentes de Terminal

**Fecha:** 2026-02-03  
**Tipo:** Corrección de Bug (Bug Fix)

---

## 📋 Problema Resuelto

Al ejecutar el sistema SAE mediante `npm run electron` o el launcher, aparecían **3 ventanas de terminal emergentes** visibles en la barra de tareas, además de la ventana principal de la aplicación. Esto afectaba la experiencia del usuario y daba una apariencia poco profesional al sistema.

---

## ✅ Cambios Implementados

### 1. **scripts/start-electron-dev.js** - Corrección Principal

#### Flag CREATE_NO_WINDOW
```javascript
const CREATE_NO_WINDOW = 0x08000000;
const isWindows = process.platform === 'win32';
```

#### Backend Spawn
- ✅ Agregado `creationFlags: CREATE_NO_WINDOW`
- ✅ Cambiado `detached: true` → `detached: false`
- ✅ Removido `unref()`

#### Frontend Spawn
- ✅ Agregado wrapper `cmd.exe` para ejecutar npm sin `shell: true`
- ✅ Agregado `creationFlags: CREATE_NO_WINDOW`
- ✅ Cambiado `detached: true` → `detached: false`
- ✅ Removido `shell: true` y `unref()`

```javascript
const frontendCommand = isWindows ? 'cmd.exe' : 'npm';
const frontendArgs = isWindows 
  ? ['/c', 'npm', 'run', 'dev:frontend']
  : ['run', 'dev:frontend'];
```

#### Electron Spawn
- ✅ Agregado wrapper `cmd.exe` para ejecutar npx sin `shell: true`
- ✅ Agregado `creationFlags: CREATE_NO_WINDOW`
- ✅ Cambiado `detached: true` → `detached: false`
- ✅ Removido `shell: true` y `unref()`

```javascript
const electronCommand = isWindows ? 'cmd.exe' : 'npx';
const electronArgs = isWindows 
  ? ['/c', 'npx', 'electron', 'electron/main.js']
  : ['electron', 'electron/main.js'];
```

### 2. **package.json** - Cambio de Launcher

```json
{
  "scripts": {
    "electron": "wscript.exe start-sae.vbs"  // Cambiado de "node launcher.js"
  }
}
```

**Razón:** El archivo VBS (`start-sae.vbs`) es más confiable en Windows para ejecución silenciosa, ya que puede ejecutar comandos completamente ocultos sin necesidad de flags adicionales de Node.js.

### 3. **launcher.js** - Mejora de Estabilidad

```javascript
// Agregado delay de 500ms antes de salir
setTimeout(() => {
  process.exit(0);
}, 500);

// Agregado manejo de errores
child.on('error', (err) => {
  console.error('Error al iniciar el sistema:', err.message);
  process.exit(1);
});
```

---

## 🧪 Pruebas Realizadas

### Prueba 1: Ejecución Directa
**Comando:** `node scripts/start-electron-dev.js`

**Resultado:**
- ✅ Backend iniciado correctamente
- ✅ Frontend iniciado correctamente
- ✅ Electron lanzado correctamente
- ✅ **0 ventanas de terminal visibles**

### Prueba 2: npm run electron
**Comando:** `npm run electron`

**Procesos detectados:**
```
ProcessName    Id    HasWindow  MainWindowTitle
-----------    --    ---------  ---------------
cmd         10708    False
cmd         14404    False
cmd         14476    False
cmd         14624    False
cmd         18064    False
cmd         20036    False
electron    14208    False
electron    15196    False
electron    16072    False
electron    16740    True       SAE - Sistema de Administración Educativa
node         2120    False
node         2320    False
node        10576    False
node        11504    False
node        14464    False
node        16160    False
node        16892    False
node        18260    False
```

**Análisis:**
- ✅ 6 procesos `cmd.exe` - Todos **SIN ventanas visibles**
- ✅ 8 procesos `node` - Todos **SIN ventanas visibles**
- ✅ 4 procesos `electron` - Solo **1 con ventana** (la aplicación SAE)
- ✅ **0 ventanas de terminal emergentes**

### Prueba 3: VBS Launcher
**Comando:** `wscript.exe start-sae.vbs`

**Resultado:**
- ✅ Sistema iniciado completamente silencioso
- ✅ Solo la ventana principal de SAE visible
- ✅ **0 ventanas de terminal emergentes**

---

## 📊 Comparación Antes/Después

| Aspecto | Antes (v1.0.2) | Después (v1.0.3) |
|---------|----------------|------------------|
| **Ventanas de terminal** | ❌ 3 ventanas visibles | ✅ 0 ventanas visibles |
| **Método de spawn** | `shell: true` | `cmd.exe` wrapper + `CREATE_NO_WINDOW` |
| **Procesos detached** | `detached: true` | `detached: false` |
| **Launcher principal** | `node launcher.js` | `wscript.exe start-sae.vbs` |
| **Experiencia de usuario** | ❌ Poco profesional | ✅ Limpia y profesional |

---

## 🎯 Archivos Modificados

1. ✅ `scripts/start-electron-dev.js` - Aplicación de CREATE_NO_WINDOW y wrappers cmd.exe
2. ✅ `package.json` - Cambio de script electron a VBS
3. ✅ `launcher.js` - Mejoras de estabilidad (delay y error handling)
4. ✅ `start-sae.vbs` - Sin cambios (ya funcionaba correctamente)

---

## 🚀 Métodos de Inicio

Ambos métodos funcionan perfectamente sin mostrar ventanas de terminal:

1. **npm run electron** - Usa VBS launcher
2. **Doble clic en start-sae.vbs** - Ejecución directa

---

## 📝 Notas Técnicas

### CREATE_NO_WINDOW Flag
El flag `0x08000000` es una constante de Windows que previene la creación de ventanas de consola al hacer spawn de procesos. Es la solución más efectiva para evitar ventanas emergentes en Windows.

### Wrapper cmd.exe
En Windows, `npm` y `npx` son archivos `.cmd`, no ejecutables binarios. Al usar `spawn()` sin `shell: true`, estos comandos no se encuentran. La solución es usar `cmd.exe /c` como wrapper, que permite ejecutar estos comandos con el flag `CREATE_NO_WINDOW`.

### VBS vs Node Launcher
VBScript puede ejecutar comandos con el parámetro `0` (ocultar ventana) de forma nativa y más confiable que Node.js con procesos detached. Por esta razón, se cambió el método principal de inicio a VBS.

---

## ✅ Conclusión

**Problema completamente resuelto.** El sistema SAE ahora inicia de forma completamente silenciosa, mostrando únicamente la ventana principal de la aplicación. La experiencia del usuario ha mejorado significativamente, presentando una apariencia más profesional y pulida.
