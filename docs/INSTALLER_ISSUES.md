# Estado Actual - Problemas Pendientes del Instalador

## Problemas que Persisten

1. **Icono del Instalador**: Sigue mostrando X roja
2. **Icono del Acceso Directo**: Muestra icono de Electron
3. **Error de Prisma**: `Cannot find module '.prisma/client/default'`
4. **Barra de Progreso**: No muestra detalles de archivos

## Intentos Realizados

### Intento 1: Generación de ICO con Script Node.js
- ❌ Falló por problemas con API de Jimp

### Intento 2: Generación de ICO con PowerShell
- ✅ ICO generado exitosamente (48KB, multi-tamaño)
- ❌ electron-builder sigue generando su propio ICO (37KB)

### Intento 3: Mover ICO a build/ y actualizar rutas
- ✅ Cambios aplicados en package.json y electron/main.js
- ❌ Instalador sigue sin cambios visibles

## Observaciones Técnicas

1. **electron-builder genera su propio ICO**: A pesar de especificar `build/icon.ico`, electron-builder crea `.icon-ico/icon.ico` de 37KB
2. **Tamaño del instalador cambió**: De 127MB a 164MB, sugiriendo que Prisma sí se está incluyendo
3. **NSIS include configurado**: `build/installer.nsh` está referenciado en package.json

## Posibles Causas Raíz

1. **Caché de electron-builder**: Puede estar usando archivos cacheados
2. **Formato del ICO**: Aunque generado correctamente, puede no ser compatible con NSIS
3. **Prisma en extraResources**: Puede necesitar configuración adicional en tiempo de ejecución
4. **Rutas relativas**: electron-builder puede no estar resolviendo correctamente las rutas

## Próximos Pasos Sugeridos

### Para el Icono

1. **Limpiar caché de electron-builder**:
   ```powershell
   Remove-Item -Recurse -Force release, node_modules/.cache
   ```

2. **Usar herramienta externa para ICO**:
   - Instalar ImageMagick: `winget install ImageMagick.ImageMagick`
   - Generar ICO: `magick logo.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico`

3. **Verificar formato del ICO**:
   ```powershell
   Get-Content build\icon.ico -Encoding Byte -TotalCount 6
   ```
   Debería mostrar: `0 0 1 0 [número de imágenes] 0`

### Para Prisma

1. **Verificar que extraResources se copió**:
   - Revisar `release/win-unpacked/resources/`
   - Debería contener `node_modules/.prisma/`

2. **Ajustar require en backend**:
   ```javascript
   // En backend/prismaClient.js
   const path = require('path');
   const isDev = !app.isPackaged;
   const prismaPath = isDev 
     ? require('@prisma/client')
     : require(path.join(process.resourcesPath, 'node_modules/@prisma/client'));
   ```

3. **Agregar binarios de Prisma explícitamente**:
   ```json
   "extraResources": [
     {
       "from": "node_modules/.prisma/client",
       "to": "app/node_modules/.prisma/client"
     }
   ]
   ```

### Para NSIS Verbose

1. **Verificar que installer.nsh se está usando**:
   - Revisar `release/builder-debug.yml`
   - Buscar referencia a `installer.nsh`

2. **Alternativa: Usar script NSIS personalizado completo**:
   - Crear `build/installer.nsi` con configuración completa
   - Referenciar en package.json: `"script": "build/installer.nsi"`

## Archivos Modificados en Esta Sesión

- [package.json](file:///c:/Users/Kevin/Documents/Proyectos/Sistema%20de%20Administraci%C3%B3n%20Educativa/package.json)
- [electron/main.js](file:///c:/Users/Kevin/Documents/Proyectos/Sistema%20de%20Administraci%C3%B3n%20Educativa/electron/main.js)
- [scripts/convert-png-to-ico.ps1](file:///c:/Users/Kevin/Documents/Proyectos/Sistema%20de%20Administraci%C3%B3n%20Educativa/scripts/convert-png-to-ico.ps1)
- [scripts/fix-prisma.js](file:///c:/Users/Kevin/Documents/Proyectos/Sistema%20de%20Administraci%C3%B3n%20Educativa/scripts/fix-prisma.js)
- [build/installer.nsh](file:///c:/Users/Kevin/Documents/Proyectos/Sistema%20de%20Administraci%C3%B3n%20Educativa/build/installer.nsh)
- [build/icon.ico](file:///c:/Users/Kevin/Documents/Proyectos/Sistema%20de%20Administraci%C3%B3n%20Educativa/build/icon.ico)

## Referencias Útiles

- [electron-builder Icon Configuration](https://www.electron.build/configuration/nsis#NsisOptions-installerIcon)
- [NSIS Scripting Reference](https://nsis.sourceforge.io/Docs/Chapter4.html)
- [Prisma in Production](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel#vercel-build-time-environment-variables)
