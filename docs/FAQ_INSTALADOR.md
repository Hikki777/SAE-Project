# FAQ - Preguntas Frecuentes sobre el Instalador

**Versión:** 1.0.1  
**Actualizado:** 26 de enero de 2026

---

## General

### P: ¿Dónde está el instalador?
**R:** En la carpeta `release/` del proyecto:
```
C:\Users\Kevin\Documents\Proyectos\Sistema de Administración Educativa\release\
SAE - Sistema de Administración Educativa Setup 1.0.1.exe
```

### P: ¿Cuál es el tamaño del instalador?
**R:** **157.11 MB** (incluye todas las dependencias, Prisma, y frontend compilado)

### P: ¿Es necesario internet para instalar?
**R:** No, el instalador es completamente independiente. Sin embargo, necesitas:
- Windows 7 o superior
- 200 MB de espacio disponible en disco
- Permisos de administrador para instalar

### P: ¿Puedo instalar en una carpeta diferente?
**R:** Sí, el instalador te permite elegir la carpeta de destino.

---

## Instalación

### P: ¿Cómo instalo la aplicación?
**R:** Tienes 3 opciones:

**Opción 1 - Script automático:**
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-installer.ps1
```

**Opción 2 - Doble clic:**
1. Abre el Explorador de Archivos
2. Navega a `release/`
3. Haz doble clic en el `.exe`

**Opción 3 - Instalación silenciosa:**
```powershell
"release\SAE - Sistema de Administración Educativa Setup 1.0.1.exe" /S
```

### P: ¿Qué debo ver durante la instalación?
**R:** Deberías ver:
- ✓ Logo de SAE en la ventana del instalador
- ✓ Lista de archivos siendo copiados
- ✓ Barra de progreso que avanza
- ✓ Opción de crear acceso directo en el escritorio
- ✓ Opción de crear acceso directo en el menú de inicio

### P: ¿Cuánto tiempo tarda la instalación?
**R:** Aproximadamente **30-60 segundos** dependiendo de:
- Velocidad del disco duro
- Carga actual del sistema
- Antivirus activo

### P: ¿Se crea un acceso directo?
**R:** Sí, automáticamente se crea:
- En **Menú de Inicio** → `SAE - Sistema de Administración Educativa`
- En **Escritorio** (opcional, se pregunta durante la instalación)

---

## Ejecución

### P: ¿Cómo ejecuto la aplicación después de instalar?
**R:** Tienes 2 opciones:
1. Haz clic en el acceso directo del menú de inicio
2. Haz clic en el acceso directo del escritorio (si lo creaste)

### P: ¿Dónde se almacenan los datos?
**R:** Los datos se almacenan en:
```
C:\Users\{TuUsuario}\AppData\Roaming\SAE\data\
```

Por ejemplo:
```
C:\Users\Kevin\AppData\Roaming\SAE\data\dev.db  (base de datos)
C:\Users\Kevin\AppData\Roaming\SAE\logs\        (archivos de log)
```

### P: ¿Puedo mover la base de datos a otra ubicación?
**R:** Sí, puedes hacerlo configurando la variable de entorno `DATABASE_URL` antes de ejecutar la aplicación:
```powershell
$env:DATABASE_URL = "file:C:\Mis Datos\sae.db"
```

### P: ¿Qué pasa si la aplicación falla al iniciarse?
**R:** Verifica los logs:
```powershell
Get-Content "$env:APPDATA\SAE\logs\*"
```

Causas comunes:
- Permisos insuficientes en `AppData`
- Antivirus bloqueando la aplicación
- Carpeta de datos corrupta

**Solución:** Reinstala la aplicación.

---

## Problemas Comunes

### P: El logo no se muestra en el instalador
**R:** Esto fue solucionado en esta versión. Si ves este problema:
1. Descarga la versión más reciente
2. Ejecuta el instalador nuevamente

### P: No se muestran detalles durante la instalación
**R:** Esto fue solucionado en esta versión. El script NSIS fue mejorado para mostrar:
- Nombre de archivos siendo copiados
- Progreso en tiempo real
- Mensajes informativos

### P: La barra de progreso se salta o no avanza
**R:** Esto fue solucionado. Ahora:
- Muestra información detallada de cada archivo
- Sincroniza correctamente con el progreso real
- Actualiza continuamente

### P: La aplicación no inicia después de instalar
**R:** Esto fue solucionado. Se implementó:
- Creación automática de directorios de datos
- Configuración correcta de Prisma
- Manejo de errores mejorado

**Si aún así falla:**
1. Verifica los logs: `$env:APPDATA\SAE\logs\`
2. Reinstala la aplicación
3. Contacta al soporte

### P: "Cannot find module '.prisma/client'"
**R:** Esto fue solucionado. Si aparece:
1. Desinstala completamente
2. Limpia: `C:\Users\{Usuario}\AppData\Roaming\SAE`
3. Vuelve a instalar
4. Si persiste, ejecuta: `npm run prisma:push` desde el código fuente

---

## Desinstalación

### P: ¿Cómo desinstalo la aplicación?
**R:** Tienes 2 opciones:

**Opción 1 - Panel de Control:**
1. Abre Configuración → Aplicaciones
2. Busca "SAE - Sistema de Administración Educativa"
3. Haz clic en "Desinstalar"

**Opción 2 - Menú de Inicio:**
1. Abre Menú de Inicio
2. Busca "SAE"
3. Haz clic en "Desinstalar SAE"

### P: ¿Se eliminan los datos al desinstalar?
**R:** No, por defecto se conservan en:
```
C:\Users\{Usuario}\AppData\Roaming\SAE\
```

Para eliminarlos manualmente:
```powershell
Remove-Item -Recurse -Force "$env:APPDATA\SAE"
```

### P: ¿Puedo reinstalar sin perder datos?
**R:** Sí, simplemente:
1. Desinstala la aplicación (los datos permanecen)
2. Instala la nueva versión
3. Los datos se cargarán automáticamente

---

## Actualización

### P: ¿Cómo actualizo a una versión más nueva?
**R:** La aplicación tiene auto-actualizador incorporado. Simplemente:
1. Ejecuta la aplicación
2. Se notificará de actualizaciones disponibles
3. Descargará e instalará automáticamente

O manualmente:
1. Desinstala la versión anterior
2. Instala la nueva versión

### P: ¿Perderé mis datos al actualizar?
**R:** No, los datos se conservan automáticamente en `AppData\Roaming\SAE\`

---

## Requisitos del Sistema

### P: ¿Cuáles son los requisitos mínimos?
**R:** 
- **Sistema Operativo:** Windows 7 o superior (64-bit)
- **Memoria RAM:** Mínimo 2 GB (recomendado 4 GB)
- **Espacio en Disco:** Mínimo 200 MB
- **Procesador:** Cualquier procesador moderno
- **Permisos:** Administrador para instalar

### P: ¿Funciona en Windows 11?
**R:** Sí, totalmente compatible con Windows 11

### P: ¿Funciona en Windows Server?
**R:** Sí, pero se recomienda usar la versión web/servidor para entornos de servidor

---

## Técnico

### P: ¿Qué tecnologías usa el instalador?
**R:** 
- **Electron** - Framework de escritorio
- **Vite** - Compilador de frontend
- **NSIS** - Sistema de instaladores de Windows
- **Prisma** - ORM de base de datos
- **Node.js** - Runtime de JavaScript

### P: ¿Dónde se instalan exactamente los archivos?
**R:** 
```
C:\Program Files\SAE - Sistema de Administración Educativa\
├── resources/
│   ├── app/              (código de la aplicación)
│   ├── node_modules/     (dependencias)
│   └── prisma/           (esquema y migraciones)
└── [otros archivos de Electron]
```

### P: ¿Es seguro descargar de...?
**R:** El instalador contiene:
- ✓ Código open-source verificado
- ✓ Dependencias npm auditadas
- ✓ Binarios de Electron oficiales
- ✓ Base de datos SQLite local (no en la nube)

### P: ¿Qué información se envía a internet?
**R:** La aplicación:
- ✗ NO recopila datos personales
- ✗ NO se conecta a servidores externos (excepto para actualizaciones)
- ✓ Almacena todo localmente en AppData
- ✓ Puedes desactivar actualizaciones automáticas

---

## Soporte

### P: ¿Dónde reporto problemas?
**R:** Por favor documenta:
1. Sistema operativo y versión
2. Carpeta de instalación usada
3. Mensajes de error exactos
4. Pasos para reproducir el problema
5. Contenido de logs en `AppData\Roaming\SAE\logs\`

### P: ¿Hay un log de cambios?
**R:** Sí, consulta:
- `RELEASE_NOTES_v1.0.1.md` - Cambios principales
- `CHANGELOG.md` - Historial completo
- `RESUMEN_CAMBIOS_INSTALADOR.md` - Cambios específicos del instalador

### P: ¿Dónde encuentro documentación?
**R:** En la carpeta `docs/`:
- `MANUAL_USUARIO.md` - Guía de usuario
- `MANUAL_TECNICO.md` - Documentación técnica
- `INSTALADOR_LISTO.md` - Instrucciones de instalación
- `SOLUCION_INSTALADOR.md` - Solución de problemas

---

## Buenas Prácticas

### P: ¿Qué debo hacer después de instalar?
**R:** Se recomienda:
1. Ejecutar la aplicación y verificar que abre correctamente
2. Crear un usuario de administrador
3. Hacer una copia de seguridad de la base de datos
4. Configurar los parámetros de la institución

### P: ¿Debo hacer copias de seguridad?
**R:** Sí, se recomienda:
```powershell
# Hacer copia de seguridad de los datos
Copy-Item -Recurse "$env:APPDATA\SAE\data" "C:\Backups\SAE-$(Get-Date -f yyyyMMdd)"
```

### P: ¿Cómo optimizo el rendimiento?
**R:** 
- Asegúrate de tener suficiente RAM disponible
- Desactiva antivirus innecesarios mientras trabajas
- Mantén el disco duro defragmentado
- Actualiza a versiones más recientes cuando esté disponible

---

## Contacto

**Para más ayuda, consulta:**
- Documentación: `docs/` folder
- Scripts de soporte: `scripts/` folder
- Logs: `%APPDATA%\SAE\logs\`

**Estado del Instalador:** ✅ Listo para producción  
**Versión:** 1.0.1  
**Última Actualización:** 26 de enero de 2026

---

*Este documento se actualiza regularmente con nuevas preguntas y respuestas.*
