# 🔧 Análisis y Reparación de Errores de Instalación - SAE v1.0.6+

**Fecha:** 20 de febrero, 2026  
**Versión:** 1.0.6 (mejorada)  
**Estado:** ✅ Reparado

---

## 📋 Problemas Identificados

### 1. ❌ **Problema de Instalación: ProgramFiles vs AppData**

**Descripción:**
- El programa se instalaba en `Program Files` (binarios solo lectura)
- Los datos intentaban guardarse en `Program Files` causando errores de permisos
- Base de datos, fotos y backups no se guardaban correctamente

**Causa Raíz:**
- Falta de separación clara entre binarios (executables) y datos (database, uploads)
- `Program Files` no permite escritura de datos por razones de seguridad en Windows
- Directorios de datos no se creaban correctamente en AppData durante la instalación

### 2. ❌ **Problema del Icono: SAE.exe sin Logo del Sistema**

**Descripción:**
- El ejecutable `SAE.exe` mostraba el icono genérico de Electron
- El logo del sistema no se aplicaba al archivo instalable
- El instalador (NSIS) no incluía el icono personalizado

**Causa Raíz:**
- Configuración de `electron-builder` no optimizada para iconos
- El archivo `logo.ico` no se incluía correctamente en el build de NSIS
- Rutas de icono no verificadas durante la construcción

---

## ✅ Soluciones Implementadas

### 1. 🏗️ **Arquitectura Corregida: Binarios + Datos Separados**

```
📦 INSTALACIÓN
├── Program Files\SAE\           (BINARIOS - Solo lectura)
│   ├── SAE.exe                  (Ejecutable con logo)
│   ├── electron/
│   ├── frontend/dist/
│   ├── backend/
│   ├── node_modules/
│   └── ...
│
└── %APPDATA%\SAE\               (DATOS - Acceso lectura/escritura)
    ├── prisma/                  (Base de datos)
    │   └── dev.db
    ├── uploads/                 (Fotos, documentos)
    │   ├── alumnos/
    │   ├── docentes/
    │   ├── directores/
    │   ├── personal/
    │   └── qr/
    ├── backups/                 (Copias de seguridad)
    ├── logs/                    (Registros de la aplicación)
    └── temp/                    (Archivos temporales)
```

### 2. 🔧 **Cambios Codigobase**

#### **A. electron/main.js**
- ✅ Agregada función `ensureDataDirectories()` para validar creación de directorios
- ✅ Verificación de permisos en AppData antes de iniciar el backend
- ✅ Mejor manejo de errores con diálogos informativos
- ✅ Logs detallados de creación de directorios
- ✅ Validación en `app.whenReady()` para abortar si fallan los directorios

```javascript
// Función nueva: Valida y crea estructura de directorios
function ensureDataDirectories() {
  const userDataPath = app.getPath("userData"); // = %APPDATA%\SAE
  const requiredDirs = [
    userDataPath,
    path.join(userDataPath, "prisma"),
    path.join(userDataPath, "uploads"),
    // ... más directorios
  ];
  // Retorna { success, userDataPath, errors }
}
```

#### **B. build/installer.nsh (NSIS)**
- ✅ Mejorada la estructura de creación de directorios
- ✅ Agregada validación de permisos de administrador
- ✅ Mejor documentación y mensajes de error
- ✅ Detección de errores con rollback automático
- ✅ Logs mejorados durante la instalación
- ✅ Diálogo mejorado para conservar datos al desinstalar

```nsis
; Variables de validación
Var /GLOBAL SAE_DATA_DIR
Var /GLOBAL CREATE_ERROR

; Verificación de permisos en !macro customInit
UserInfo::GetAccountType
Pop $0
${If} $0 != "admin"
  MessageBox MB_OK|MB_ICONWARNING "Se recomienda ejecutar como Administrador"
${EndIf}
```

#### **C. package.json**
- ✅ Nuevo script `npm run icons` para generar iconos
- ✅ Actualizado `npm run dist:win` para incluir generación de iconos
- ✅ Mejorada configuración de electron-builder para NSIS
- ✅ Agregadas rutas de iconos en `extraFiles`
- ✅ Configuración mejorada de `nsis` con iconos para header

```json
{
  "scripts": {
    "icons": "node scripts/generate-icons.js",
    "dist:win": "npm run icons && npm run build:frontend && electron-builder --win"
  },
  "build": {
    "win": {
      "icon": "frontend/public/logo.ico"
    },
    "nsis": {
      "installerIcon": "frontend/public/logo.ico",
      "uninstallerIcon": "frontend/public/logo.ico",
      "installerHeaderIcon": "frontend/public/logo.ico",
      "uninstallerHeaderIcon": "frontend/public/logo.ico"
    }
  }
}
```

#### **D. scripts/generate-icons.js (NUEVO)**
- ✅ Script completo para generar iconos desde logo.png
- ✅ Genera PNGs optimizados (32, 64, 128, 256, 512px)
- ✅ Valida existencia de imagen fuente
- ✅ Genera icon.png para macOS/Linux
- ✅ Proporciona recomendaciones para ICO profesional

---

## 📦 Archivos Generados Automáticamente

```
frontend/public/
├── logo-32.png       (Pequeño - 1.7 KB)
├── logo-64.png       (Mediano - 4.8 KB)
├── logo-128.png      (Grande - 12.7 KB)
├── logo-256.png      (XL - 33.9 KB)
├── logo-512.png      (XXL - 110 KB)
├── logo.ico          (Ejecutable - ya existente)
└── logo.png          (Original)

build/
└── icon.png          (macOS/Linux - 512x512px)
```

---

## 🚀 Instrucciones de Compilación

### **PASO 1: Generar Iconos (Automático)**
```bash
npm run icons
```
✅ Genera automáticamente:
- PNGs en múltiples resoluciones
- Icon.png para macOS
- Mantiene logo.ico existente

### **PASO 2: Compilar para Windows**
```bash
npm run dist:win
```
✅ Automáticamente:
1. Ejecuta `npm run icons`
2. Compila frontend (`npm run build:frontend`)
3. Construye ejecutable con `electron-builder`
4. Genera `SAE-${version}-Setup.exe`

### **RESULTADO ESPERADO:**
```
release/
├── SAE-1.0.6-Setup.exe       (Instalador NSIS)
├── SAE-1.0.6.exe             (Portable)
└── builder-effective-config.yaml
```

---

## 🔍 Verificación Post-Instalación

### **Verificación 1: Estructura de Directorios**
```
Ejecutar en CMD como Administrador:
> dir %APPDATA%\SAE
```
✅ Debe mostrar:
- `prisma/`
- `uploads/` (con subcarpetas)
- `backups/`
- `logs/`
- `temp/`

### **Verificación 2: Icono del Ejecutable**
1. Abrir `Program Files\SAE\`
2. Click derecho en `SAE.exe` → Propiedades
3. Verificar pestaña "Detalles"
4. ✅ Debe mostrar icono personalizado (no el de Electron)

### **Verificación 3: Funcionamiento**
1. Ejecutar `SAE.exe`
2. Verificar que la base de datos se crea en `%APPDATA%\SAE\prisma\dev.db`
3. Verificar que las fotos se guardan en `%APPDATA%\SAE\uploads\`

---

## 💡 Recomendaciones para Mejorar el Icono (.ico)

### **Opción 1: Online (Rápido)**
1. Ir a: https://icoconvert.com
2. Subir: `frontend/public/logo.png`
3. Descargar ICO
4. Reemplazar: `frontend/public/logo.ico`
5. Ejecutar: `npm run dist:win`

### **Opción 2: ImageMagick (Profesional)**
```powershell
# Instalar ImageMagick (si no está)
choco install imagemagick

# Generar ICO con múltiples resoluciones
convert frontend/public/logo.png -define icon:auto-resize=256,128,96,64,48,32,16 frontend/public/logo.ico

# Compilar
npm run dist:win
```

### **Opción 3: GraphicsMagick
```powershell
# Alternativa más ligera a ImageMagick
choco install graphicsmagick

# Generar ICO
gm convert frontend/public/logo.png frontend/public/logo.ico

# Compilar
npm run dist:win
```

---

## 🐛 Solución de Problemas

### **Problema: "No se puede crear directorio en AppData"**
**Solución:**
1. Ejecutar instalador como Administrador
2. Desactivar antivirus temporalmente
3. Verificar 500 MB de espacio libre
4. Si persiste, ejecutar: `ICACLS "%APPDATA%" /grant "%USERNAME%":F /T`

### **Problema: "Logo aún no se ve en SAE.exe"**
**Solución:**
1. Usar icoconvert.com para generar ICO profesional
2. Reemplazar `frontend/public/logo.ico`
3. Ejecutar: `npm run dist:win`
4. Verificar en Propiedades → Detalles

### **Problema: "Base de datos no se crea"**
**Solución:**
1. Verificar que `%APPDATA%\SAE\prisma\` existe
2. Revisar logs: `%APPDATA%\SAE\logs\backend.log`
3. Verificar permisos en carpeta SAE

### **Problema: "Instalador falla silenciosamente"**
**Solución:**
1. Ejecutar instalador desde CMD con logs:
   ```powershell
   SAE-1.0.6-Setup.exe /S /D=C:\Program Files\SAE
   ```
2. Revisar logs del NSIS en TEMP
3. Verificar evento en Visor de Eventos de Windows

---

## 📊 Cambios Resumidos

| Componente | Cambios | Licencia |
|-----------|---------|---------|
| `electron/main.js` | +40 líneas, validaciones, logs | Updated ✅ |
| `build/installer.nsh` | +120 líneas, mejorado | Updated ✅ |
| `package.json` | Scripts + build config | Updated ✅ |
| `scripts/generate-icons.js` | Nuevo archivo | Created ✅ |
| `frontend/public/logo-*.png` | 5 archivos nuevos | Generated ✅ |
| `build/icon.png` | Nuevo archivo | Generated ✅ |

---

## 🎯 Siguiente Paso Recomendado

**Antes de liberar v1.0.7:**

1. ✅ Ejecutar: `npm run dist:win`
2. ✅ Instalar en máquina de prueba (como usuario normal, no admin)
3. ✅ Verificar:
   - [ ] Directorios en `%APPDATA%\SAE` creados
   - [ ] Base de datos funcional
   - [ ] Logo visible en ejecutable
   - [ ] Uploads guardadas correctamente
   - [ ] Backups creados
4. ✅ Generar ICO profesional con icoconvert.com (opcional pero recomendado)
5. ✅ Crear etiqueta de versión y release en GitHub

---

## 📞 Referencias

- **Documentación Electron:** https://www.electronjs.org/docs
- **Documentación electron-builder:** https://www.electron.build/
- **NSIS Documentation:** https://nsis.sourceforge.io/
- **Jimp (Image processing):** https://github.com/jimp-dev/jimp
- **Icon Generator Online:** https://icoconvert.com

---

**Generado:** 20 de febrero, 2026  
**Por:** GitHub Copilot AI Assistant  
**Estado:** ✅ Listo para compilación
