# Correcciones del Instalador - v1.0.2

## Fecha: 2026-01-27

### Problemas Críticos Solucionados

#### 1. Aplicación No Se Ejecutaba Después de Instalación
- **Problema**: El `package.json` especificaba `"main": "backend/server.js"` en lugar de `"main": "electron/main.js"`
- **Impacto**: Electron intentaba ejecutar el servidor Express directamente, sin crear ventanas
- **Solución**: Corregido el punto de entrada a `electron/main.js`

#### 2. Falta de Página de Licencia en Instalador
- **Problema**: La configuración NSIS no incluía el archivo de licencia GPL-3.0
- **Impacto**: Los usuarios no podían revisar los términos de licencia durante la instalación
- **Solución**: Agregado `"license": "LICENSE"` a la configuración NSIS

#### 3. Backend No Iniciaba en Modo Producción
- **Problema**: `electron/main.js` no estaba configurado para iniciar el servidor backend automáticamente
- **Impacto**: La aplicación empaquetada no tenía backend funcionando
- **Solución**: Reescrito `electron/main.js` para:
  - Detectar modo producción (`app.isPackaged`)
  - Iniciar `backend/server.js` como proceso hijo
  - Esperar a que el backend responda en `http://localhost:5000/api/health`
  - Cargar la interfaz desde el backend en lugar de archivos estáticos

#### 4. Rutas de Iconos Incorrectas
- **Problema**: Las rutas de iconos no se resolvían correctamente en modo producción
- **Impacto**: Iconos faltantes en la aplicación empaquetada
- **Solución**: Implementada lógica condicional para resolver rutas según el modo (desarrollo/producción)

### Mejoras Adicionales

#### Simplificación de Configuración NSIS
- Removidas configuraciones redundantes de `build/installer.nsh` que ya están manejadas por electron-builder
- Mantenidas solo las personalizaciones necesarias (ShowInstDetails)

#### Limpieza de Repositorio
- Actualizado `.gitignore` para excluir:
  - `release/` - Directorio de builds
  - `.icon-ico/` - Caché de iconos de electron-builder
  - `node_modules/.cache/` - Caché de dependencias

### Archivos Modificados

1. **package.json**
   - Línea 5: `"main": "electron/main.js"` (antes: `"backend/server.js"`)
   - Línea 131: Agregado `"license": "LICENSE"` en configuración NSIS

2. **electron/main.js**
   - Reescrito completamente para soportar modo producción
   - Agregada función `waitForBackend()` para health checks
   - Implementado inicio automático del backend con `spawn()`
   - Manejo de limpieza de procesos en eventos `will-quit` y `window-all-closed`

3. **build/installer.nsh**
   - Removidas líneas redundantes (RequestExecutionLevel, InstallDir)
   - Mantenida configuración de visualización de detalles

4. **.gitignore**
   - Agregadas exclusiones para electron-builder

### Próximos Pasos

1. Limpiar caché de electron-builder:
   ```powershell
   Remove-Item -Recurse -Force release, node_modules\.cache
   ```

2. Reconstruir el instalador:
   ```powershell
   npm run build:frontend
   npm run dist:win
   ```

3. Probar instalación en máquina limpia

### Notas Técnicas

- El backend ahora se ejecuta con `NODE_ENV=production` en modo empaquetado
- La interfaz se carga desde `http://localhost:5000` en producción (no desde archivos estáticos)
- El proceso backend se limpia automáticamente al cerrar la aplicación
- Timeout de health check: 30 segundos (30 intentos × 1 segundo)
