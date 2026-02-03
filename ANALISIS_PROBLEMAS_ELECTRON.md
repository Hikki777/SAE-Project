# Análisis Completo de Problemas - Electron y API

## Problemas Identificados

### 1. **URLs de API Inconsistentes en Frontend**
- **Ubicación**: `frontend/src/**/*.jsx` archivos múltiples
- **Problema**: Las URLs de API se obtienen de múltiples formas y lugares, causando conflictos:
  - Algunas usan `import.meta.env.VITE_API_URL`
  - Otras usan `localStorage.getItem('api_url')`
  - Algunas tienen URLs hardcodeadas como `'http://localhost:5000/api'`
  - Esto causa que en Electron (con `file://`) no funcione correctamente

**Archivos afectados**:
- `frontend/src/App.jsx` (línea 266)
- `frontend/src/pages/LoginPage.jsx` (línea 8-9)
- `frontend/src/components/CardAusente.jsx` (línea 4-5)
- `frontend/src/components/AsistenciasPanel.jsx` (línea 14-15)
- `frontend/src/components/AlumnosPanel.jsx` (línea 11)
- Y potencialmente más en otros componentes

### 2. **Falta de Variable de Entorno VITE_API_URL**
- **Problema**: El frontend espera `VITE_API_URL` pero no está configurada en los archivos `.env` para Vite
- **Impacto**: El frontend fallará al conectarse a la API en desarrollo con Electron

### 3. **CORS Incompleto en Backend**
- **Ubicación**: `backend/server.js` líneas 135-147
- **Problema**: Aunque permite `file://`, falta permitir explícitamente las rutas relativas `/api`
- **Impacto**: Las solicitudes desde Electron pueden fallar si el frontend no se carga correctamente

### 4. **Variables de Entorno Conflictivas en Producción**
- **Problema**: En `electron/main.js`, al empaquetar, no se copian correctamente los archivos `.env` necesarios
- **Impacto**: La aplicación empaquetada no funciona porque no encuentra las variables de entorno

### 5. **DATABASE_URL Apunta a `debug.db` en Desarrollo**
- **Ubicación**: `.env` - `DATABASE_URL="file:./prisma/debug.db"`
- **Problema**: Debería apuntar a `./prisma/dev.db` para consistencia
- **Impacto**: Base de datos inconsistente entre desarrollo y pruebas

### 6. **Script start-electron.js Tiene Problemas de Compatibilidad**
- **Ubicación**: `scripts/start-electron.js` líneas 79-113
- **Problema**: Usa `spawn` con `{ shell: true }` que genera deprecation warnings
- **Impacto**: Inseguridad y advertencias en consola

### 7. **frontend/dist No Existe en Desarrollo**
- **Problema**: En desarrollo, `electron/main.js` intenta cargar desde `frontend/dist/index.html` que no existe
- **Solución**: Debe detectar si está en desarrollo y usar `http://localhost:5173`

## Soluciones a Implementar

### 1. Crear archivo de entorno para frontend
- `frontend/.env.development`
- `frontend/.env.production`

### 2. Centralizar cliente HTTP
- Crear `frontend/src/api/client.js` con lógica centralizada

### 3. Mejorar CORS en backend
- Permitir rutas relativas `/api`
- Mejor manejo de headers

### 4. Corregir paths en Electron
- Mejorar detección de modo desarrollo vs producción

### 5. Agregar .env al empaquetado
- Incluir en `electron-builder` config

### 6. Actualizar database.url
- Cambiar `debug.db` a `dev.db` en `.env`

