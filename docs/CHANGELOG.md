# Changelog

## [1.1.5] - 2026-04-28
### 🛠️ Estabilización del Backend y Generación de QR
- **[QR Engine]** Refactorización completa del motor de generación de códigos QR.
  - **SVG + Sharp**: Migración de `canvas` a un flujo de `SVG` procesado por `Sharp` para eliminar dependencias nativas inestables en Windows.
  - **Precisión Visual**: Ajuste milimétrico del posicionamiento del carnet (coordenadas píxel-perfect) para evitar solapamientos y garantizar legibilidad.
  - **Márgenes Optimizados**: Reducción del margen interno del QR para mayor densidad de datos y facilidad de escaneo.
- **[Archivos/Uploads]** Estandarización del sistema de almacenamiento.
  - **Memory Storage**: Migración de Multer a almacenamiento en memoria para evitar errores de permisos (`EPERM`) al escribir en carpetas protegidas de Windows.
  - **Normalización Automática**: Integración de `sharp` en el flujo de subida para validar y convertir todas las imágenes (fotos, logos) a PNG optimizado automáticamente.
  - **Soporte de Logos Pesados**: Implementado pre-procesamiento para manejar logos de alta resolución (9MB+) sin afectar el rendimiento del servidor.
- **[Correcciones]**
  - **Fix 500 Error**: Eliminados los fallos persistentes en la generación de imágenes QR causados por dependencias de bajo nivel.
  - **Fix Uploads**: Corregida la subida de fotos de usuario en el Setup Wizard y Panel de Configuración.
  - **Debug**: Añadidos logs estructurados para diagnóstico rápido de fallos en el motor gráfico del servidor.


## [1.1.4] - 2026-04-27
### ✨ Interfaz Dark Mode Futurista (Glassmorphism & Neon Glow)
- **[UI/UX]** Migración completa a un diseño "Dark Only" de alta gama.
  - **Fondo Global**: Implementada textura de rejilla tecnológica (`bg-grid-pattern`) y burbujas de neón animadas.
  - **Glassmorphism**: Aplicado efecto de cristal translúcido en modales, tarjetas y barras laterales.
  - **Neon Glow**: Efectos de resplandor cian/neón en botones y tarjetas al pasar el ratón.
  - **Setup Wizard**: Rediseño inmersivo con estética SaaS moderna.
  - **Acerca de**: Refactorización del panel con alineación centrada, créditos de API corregidos y foto de autor centralizada.
- **[Rendimiento]** Optimización de renderizado en Dashboard.
  - **Instant Load**: Desactivadas las animaciones de Recharts para una carga instantánea de estadísticas.
- **[Correcciones]**
  - Fix: Alineación vertical del indicador de red (Time Sync) corregida para ser consistente entre navegadores.
  - Limpieza: Eliminados elementos visuales redundantes en el pie de página.


## [1.1.3] - 2026-04-20
### ✨ Refactorización del Sistema de Usuarios y Modernización de UI
- **[Autenticación]** Sistema de acceso flexible (Dual Login).
  - Nuevo: Soporte para nombres de usuario (`username`) como alternativa única al correo electrónico.
  - Flexibilidad: El campo `email` ahora es opcional en la creación y edición de usuarios.
  - Limpieza: Eliminado el campo `sexo` del modelo `Usuario`, centralizando la identidad de acceso en credenciales y cargo.
  - Seguridad: Ajustado el requisito técnico de contraseña a un mínimo de 6 caracteres.
- **[Interfaz]** Pulido visual y consistencia de marca.
  - **Sidebar**: Corregido el botón de cerrar sesión; el icono ahora es visible siempre, incluso con la barra contraída.
  - **Versión Dinámica**: Eliminadas las referencias hardcodeadas a la versión. El sistema ahora muestra automáticamente la versión definida en `package.json` en el Dashboard (Header), Panel de Configuración y Acerca De.
- **[Estabilidad]** Correcciones de flujo crítico.
  - **Setup Wizard**: Unificado el formulario de administrador inicial con los campos profesionales (Cargo, Jornada) del resto del sistema.
  - **Hotfix**: Corregido error de referencia en el componente de login que impedía el acceso tras los cambios estructurales.
  - **Integridad**: Garantizada la persistencia de datos de género en los modelos de **Alumnos** y **Personal**, donde siguen siendo necesarios para fines académicos.


## [1.1.2] - 2026-04-13
### ✨ Mejoras de Estabilidad y UX (Pulido Final)
- **[Backups]** Estabilización definitiva del proceso de restauración de archivos binarios v2.0.
  - Fix: Migración de `axios` a `native fetch` para la subida de archivos pesados de backup, resolviendo el error `400 Bad Request` causado por la pérdida de `boundary` en los interceptores.
  - UX: Eliminada la lógica redundante de "triple click" para restaurar; ahora el botón se bloquea inmediatamente al primer click.
- **[Sincronización]** Optimización del sistema de verificación de hora de internet en `AsistenciasPanel.jsx`.
  - Mejora: Implementado sistema de *failover* (API primaria: WorldTimeAPI, API secundaria: TimeAPI.io).
  - Robustez: Aumentado el timeout a 10s y añadida gestión silenciosa de errores para evitar ruido excesivo en la consola de desarrollo.
- **[Interfaz]** Avatares dinámicos en modales de vista previa.
  - Mejora: Integrado el componente `GenderAvatar` en los modales de detalle de **Alumnos** y **Personal**.
  - Estética: Reemplazado el icono de usuario genérico por una ilustración basada en el género del estudiante o trabajador, manteniendo la consistencia visual premium de la marca SAE.

## [1.1.1] - 2026-04-08 (Hotfix)
### Corregido
- **[CRITICAL BUG]** El sistema de creación y restauración de Backups desde el panel de control fallaba devolviendo Error 500 (`tempDir is not defined`).
  - Causa: Error tipográfico de mayúsculas/minúsculas en el código backend de respaldos (`tempDir` en lugar de la constante requerida `TEMP_DIR`).
  - Fix: Estandarizada la variable a `TEMP_DIR` en todo el flujo de empaquetamiento ZIP y extracción, reanudando la compatibilidad de respaldos en el servidor empaquetado.

## [1.1.0] - 2026-04-08

### 🐛 Correcciones Críticas de Producción

#### Backend — Compatibilidad SQLite/Prisma
- **[CRÍTICO]** Corregido `TypeError` al cambiar carnet de `automático` a `manual` en `carnetGenerator.js`.
  - Causa: Uso de `mode: 'insensitive'` en `prisma.findFirst()` — opción exclusiva de PostgreSQL, no compatible con SQLite.
  - Fix: Normalización manual con `.toUpperCase()` antes de la consulta, eliminando la dependencia del modo del motor.

#### Frontend — Panel de Justificaciones (modo tradicional)
- **[CRÍTICO]** Las personas ausentes no aparecían en el panel tradicional de justificaciones.
  - Síntoma: Las estadísticas (conteo de ausentes) eran correctas, pero la lista de personas para justificar estaba vacía.
  - Causa: El panel solo cargaba excusas existentes en BD; ignoraba a los ausentes sin excusa registrada.
  - Fix: Se agrega consulta paralela a `/api/asistencias/ausentes` y se cruza con las excusas del día. Los ausentes sin excusa aparecen en una sección "Ausentes sin justificar hoy" con un botón "Justificar" que abre el modal correspondiente.
- **[BUG]** `cargarPersonas()` dentro de `useEffect` nunca era invocada (función definida pero no llamada).

#### Componentes — Modal Captura de Foto
- **[CRÍTICO]** La captura de foto devolvía pantalla negra en producción.
  - Causas: 
    1. Electron 20+ introdujo una restricción de permisos que bloquea silenciosamente el uso de `getUserMedia` si no hay delegados.
    2. Condición de carrera en React donde el web stream intentaba renderizarse en un `<video>` que aún no estaba montado en el DOM debido al Spinner de carga.
  - Fix: Configurar permisos obligatorios `setPermissionRequestHandler` en `main.js`. Implementar asignación de stream nativa vía *Callback Ref* (`handleVideoRef`) en React para anexar el video justo en el tick que el nodo aparece.

### ✨ Nuevas Funcionalidades

#### Captura de Foto desde Webcam
- Nuevo componente reutilizable `WebcamCaptureModal.jsx` usando la API nativa `navigator.mediaDevices.getUserMedia`.
- Integrado en el modal de registro de **Alumnos** (`AlumnosPanel.jsx`) y **Personal** (`PersonalPanel.jsx`).
- Botón "📷 Webcam" junto al selector de archivos existente.
- La captura se convierte a objeto `File` compatible con el flujo de subida multipart existente.
- Soporte para selección de cámara cuando el dispositivo tiene múltiples.

#### Lector de Códigos de Barras / QR Físico
- Confirmado soporte existente en `AsistenciasPanel.jsx` para lectores USB/HID (teclado emulado).
- El sistema detecta automáticamente secuencias de teclas de alta velocidad (características de un lector físico) y las procesa como escaneo, sin necesidad de foco en ningún input.
- Documentado el comportamiento para referencia del equipo.

#### Sistema de Auto-Actualizaciones (OTA)
- **[NUEVO]** Módulo inteligente de actualizaciones usando `electron-updater`.
- Busca actualizaciones en GitHub silenciosamente.
- Muestra una ventana de diálogo nativa al encontrar una versión proponiendo su descarga en segundo plano.
- Conserva el 100% de los datos locales sin interrupción.

### 🎨 Mejoras de UX — Eliminación de Diálogos Nativos

Se eliminaron **todos** los `window.confirm()` y `window.alert()` del sistema. En Electron, estos producen ventanas nativas del sistema operativo que rompen la experiencia visual. Todos fueron reemplazados por modales personalizados con animación `framer-motion`:

| Componente | Acción | Tipo de reemplazo |
|---|---|---|
| `RevisionRapidaView.jsx` | Omitir revisión de ausente | Modal con portal + animación + botones estilizados |
| `MetricsPanel.jsx` | Resetear métricas | Doble clic con aviso tipo toast (anti-accidente) |
| `ConfiguracionPanel.jsx` | Eliminar director | Modal de confirmación compartido (danger 🔴) |
| `ConfiguracionPanel.jsx` | Eliminar usuario | Modal de confirmación compartido (danger 🔴) |
| `ConfiguracionPanel.jsx` | Eliminar equipo | Modal de confirmación compartido (warning 🟡) |

El `ConfiguracionPanel` implementa un **sistema de confirmación unificado** con estado `confirmDialog` y función `openConfirm(mensaje, callback, tipo)` reutilizable para futuras acciones destructivas.

### 🔧 Correcciones del Sistema de Archivos e Instalador

#### Electron — `main.js`
- Agregados directorios **faltantes** que no se creaban al instalar:
  - `uploads/justificaciones` — necesario para adjuntar evidencia en excusas.
  - `uploads/logos` — necesario para el logo institucional del Setup Wizard.
  - `uploads/usuarios` — necesario para fotos de perfil de usuarios del sistema.
- Corregido error visual: logo en pantalla splash no se renderizaba (los navegadores Chromium no muestran archivos `.ico` en etiquetas `<img>` via `data URI`). Ahora solo se usa el `.png`.
- Versión en el splash ahora se lee dinámicamente de `app.getVersion()` en lugar de estar hardcodeada.

#### Instalador NSIS
- **[MEJORA] Instalador Moderno (One-Click):**
  - Cambiado `oneClick: true`. El proceso de instalación ahora es instantáneo y sin pantallas de "Siguiente > Siguiente".
  - Instalación segura sin permisos elevados (`perUser` -> `LocalAppData\Programs`), mejorando dramáticamente la compatibilidad en escuelas usando redes con Active Directory.
- **[BUG]** `makensis` arrojaba advertencia fatal 6010 interrumpiendo el instalador final en `electron-builder`.
  - Causa: Macro `InstFilesPage_OnShow` no referenciable internamente bloqueaba la compilación al estar activa opción `warningsAsErrors`.
  - Fix: Macro removido para priorizar una compilación estable, devolviendo el instalador NSIS a comportamiento compatible.
- **[BUG] Posible congelamiento de NSIS durante migración OTA:**
  - Causa: Si existía una versión anterior, la migración desatendida ejecutaba internamente el `customUninstall`, el cual poseía un `MessageBox` sin cláusula de resolución predeterminada; esto trababa el `autoUpdater` de Windows indefinidamente solicitando input del usuario.
  - Fix: Añadido bandera `/SD IDNO` a la llamada para obligar conservativamente el borrado como denegado en escenarios automáticos.
- Confirmada la limpieza perfecta y total al desinstalar invocando expresamente la limpieza `%APPDATA%\SAE`.
- Agregados directorios faltantes: `logos`, `usuarios` asegurados desde main.js.
- Versión actualizada a `1.1.0` en BrandingText y mensajes de confirmación.

#### JustificacionesPanel — Refresco sin recarga de página
- `window.location.reload()` en handlers `handleAprobar` y `handleRechazar` reemplazado por llamada a `cargarDatos()` vía el callback `onClose`.
- Evita recarga completa de la ventana Electron al aprobar/rechazar una justificación.

### 📁 Archivos Modificados

| Archivo | Tipo de cambio |
|---|---|
| `backend/utils/carnetGenerator.js` | 🐛 Fix Prisma SQLite |
| `frontend/src/components/WebcamCaptureModal.jsx` | ✨ Archivo nuevo |
| `frontend/src/components/AlumnosPanel.jsx` | ✨ Integración webcam |
| `frontend/src/components/PersonalPanel.jsx` | ✨ Integración webcam |
| `frontend/src/components/RevisionRapidaView.jsx` | 🎨 Modal confirm custom |
| `frontend/src/components/JustificacionesPanel.jsx` | 🐛 Ausentes + reload fix |
| `frontend/src/components/MetricsPanel.jsx` | 🎨 Confirm sin window.confirm |
| `frontend/src/components/ConfiguracionPanel.jsx` | 🎨 Modal confirm unificado |
| `electron/main.js` | 🔧 Directorios + splash fixes |
| `build/installer.nsh` | 🔧 Progreso real + dirs |
| `package.json` | 📦 Versión 1.1.0 |
| `frontend/package.json` | 📦 Versión 1.1.0 |

---

## [1.0.8] - 2026-02-23

### 🔧 Documentación de Desarrollo y Consolidación Final
- **Instrucciones de Clonación:** Se añadió una sección exhaustiva en `README.md` detallando la configuración e inicio del entorno local para desarrolladores.
- **Integridad Visual:** Componentes (Splash, SetupWizard, ConfiguracionPanel, Dashboard) actualizados unánimemente a la versión 1.0.8.
- **Consolidación de Releases:** Se reestructuró `docs/` creando la subcarpeta `docs/releases/` para historial limpio y actualizando los manuales base y el documento `ESTADO_DEL_PROYECTO.md` a v1.0.8.

---

## [1.0.7] - 2026-02-23

### 🧹 Limpieza de Repositorio y Actualización de Documentación
- **Limpieza Residual:** Eliminados changelogs sueltos, notas obsoletas, código muerto y scripts de prueba de `/scripts/`. Borrado seguro de la llave maestra temporal.
- **Documentación Centralizada:** Migración del archivo `EJECUTAR.md` al `README.md` principal. Versiones en archivos manifest y JSON actualizadas a 1.0.7.
- **Installer Build:** Verificación del empaquetado y correcta generación local del instalador .exe con Electron Builder.

---

## [1.0.6] - 2026-02-20

### 🚀 Mejoras y Reparaciones Generales
- **Sistema Secuencial Unificado:** Carnets de personal y alumnos comparten contador evitando conflictos.
- **Kanban Board:** Interfaz renovada para paneles de ausencias, excusas y justificaciones.
- **Reparaciones en Instalador/AppData:** Prevención de múltiples carpetas temporales, permisos arreglados en Program Files y asignación de icono oficial del sistema al build.
- **Reparación de DB:** Manejo y migración mejorados en Factory Reset, comprobación automática de modelo de base de datos (`ciclo_escolar`) al arrancar el backend en modo desarrollo.
- **Estabilidad de Sockets / Fallo de directores:** Impedidos bloqueos infinitos de conexiones en el modo cliente/múltiple terminal y resuelta vulnerabilidad que congelaba uploads de directores.

---

## [1.0.4] - 2026-02-14

### 🔧 Correcciones Críticas de Base de Datos y Electron

#### Solucionado
- **[CRÍTICO]** Corregido error 500 en `/api/institucion` debido a ruta de base de datos incorrecta.
  - Prisma CLI resolvía `file:./prisma/dev.db` relativo a `prisma/schema.prisma` (creando `prisma/prisma/dev.db`).
  - Backend resolvía relativo a root (`prisma/dev.db`), encontrando DB vacía.
  - **Fix:** Actualizado `.env` a `DATABASE_URL="file:./dev.db"` y movido archivo DB a la ubicación correcta.
  
- **[CRÍTICO]** Corregido fallo de inicio de Electron (`TypeError: Cannot read properties of undefined (reading 'isPackaged')`).
  - Causa: Variable de entorno `ELECTRON_RUN_AS_NODE=1` forzaba a Electron a comportarse como Node.js puro.
  - **Fix:** Scripts de lanzamiento (`launcher.js`, `scripts/start-electron-dev.js`) ahora eliminan explícitamente esta variable antes de iniciar.

#### Archivos Modificados
- `.env` - Actualizada `DATABASE_URL`
- `package.json` - Versión bumped a 1.0.4
- `launcher.js` - Agregada limpieza de env var
- `scripts/start-electron-dev.js` - Agregada limpieza de env var

---

## [1.0.3] - 2026-02-03

### 🔧 Correcciones Críticas del Instalador

#### Solucionado
- **[CRÍTICO]** Corregido punto de entrada en `package.json` de `backend/server.js` a `electron/main.js`
  - La aplicación ahora se ejecuta correctamente después de la instalación
  - Electron crea ventanas apropiadamente en modo producción
  
- **[CRÍTICO]** Implementado inicio automático del backend en modo producción
  - `electron/main.js` ahora inicia `backend/server.js` automáticamente cuando está empaquetado
  - Agregado health check para esperar a que el backend esté listo antes de mostrar la interfaz
  - La interfaz se carga desde `http://localhost:5000` en producción
  
- **[IMPORTANTE]** Agregada página de licencia GPL-3.0 al instalador
  - Los usuarios ahora pueden revisar los términos de licencia durante la instalación
  - Configurado `"license": "LICENSE"` en NSIS settings
  
- **[MENOR]** Corregidas rutas de iconos para modo producción
  - Implementada lógica condicional para resolver rutas según el entorno
  - Los iconos ahora se muestran correctamente en la aplicación empaquetada

#### Mejorado
- Simplificado `build/installer.nsh` removiendo configuraciones redundantes
- Actualizado `.gitignore` para excluir artefactos de electron-builder
- Agregada limpieza automática del proceso backend al cerrar la aplicación

#### Archivos Modificados
- `package.json` - Punto de entrada y configuración NSIS
- `electron/main.js` - Reescrito para soportar modo producción
- `build/installer.nsh` - Simplificado
- `.gitignore` - Agregadas exclusiones de electron-builder
- `docs/INSTALLER_FIX_v1.0.2.md` - Documentación detallada de correcciones


Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.1] - 2026-01-26

### 🚀 Publicación y Mantenimiento
- **Sincronización de Repositorio:** Actualización y limpieza de archivos no rastreados.
- **Build de Producción:** Generación de instalador v1.0.1 firmado y verificado.
- **Preparación de Release:** Alineación de versiones en todos los módulos (Root, Frontend).

---

## [1.0.0] - 2026-01-24 🎉 PRIMERA VERSIÓN ESTABLE

### 🎉 Release de Producción

Primera versión de producción estable de SAE - Sistema de Administración Educativa. Sistema listo para uso en instituciones educativas de Guatemala.

### ✨ Funcionalidades Principales

#### Control de Asistencias
- ✅ Scanner QR para entrada/salida rápida
- ✅ Registro manual como respaldo
- ✅ Detección automática de retardos
- ✅ Control de salidas tempranas
- ✅ Modal de advertencia para entradas sin salida previa

#### Gestión Académica
- ✅ Expedientes completos de alumnos (todos los niveles: Preprimaria, Primaria, Básicos, Diversificado)
- ✅ Gestión de personal docente y administrativo
- ✅ Sistema de carnets con QR integrado
- ✅ **NUEVO:** Modal de Vista Previa - Click en fotos para ver información completa + QR
- ✅ **NUEVO:** Soporte completo para 4to, 5to y 6to Diversificado

#### Justificaciones
- ✅ Módulo completo de excusas y permisos
- ✅ Flujo de aprobación/rechazo
- ✅ Adjuntar documentos de respaldo
- ✅ Historial por alumno/personal

#### Dashboard y Reportes
- ✅ Métricas en tiempo real
- ✅ Gráficos interactivos (asistencia, puntualidad, ausentismo)
- ✅ Exportación a Excel (.xlsx)
- ✅ Generación de PDFs
- ✅ Reportes personalizados por fecha

#### Sistema de Roles
- ✅ Administrador (acceso total)
- ✅ Operador (solo asistencias y consultas)

### 🎨 Mejoras de UI/UX

#### Modal de Vista Previa (NUEVO)
- **AlumnosPanel:**
  - Click en foto abre modal con información completa
  - Header con foto grande, nombre, carnet y estado
  - Secciones: Información Personal, Académica, Código QR
  - Botones: Editar y Cerrar
  
- **PersonalPanel:**
  - Vista previa similar con información de personal
  - Para docentes: muestra cursos impartidos con chips de colores
  - Secciones: Personal, Laboral, Código QR

- **Características:**
  - Fotos clickeables con hover ring indicativo
  - QR code cargado dinámicamente como blob
  - Animaciones suaves de entrada/salida
  - Click en overlay para cerrar
  - Responsive y con dark mode

#### Vista Compacta de Cursos
- Formulario de Personal ahora muestra cursos en botón compacto "Ver X cursos"
- Modal dedicado para gestión de cursos (agregar/eliminar)
- Chips de colores para cada curso
- Fix de z-index y overlay usando `createPortal`

#### Correcciones de Formularios
- Fix limpieza de estados al crear nuevo personal
- Agregados grados 4to, 5to, 6to Diversificado
- Mejor organización de campos

### 📚 Documentación

#### Completamente Reescrita y Actualizada
- ❌ **Eliminada** `GUIA_DESPLIEGUE.md` obsoleta (contenía info de cloud irrelevante)
- ✅ **Reescrito** `MANUAL_TECNICO.md` con arquitectura correcta (Electron+SQLite)
- ✅ **Reescrito** `ESTADO_DEL_PROYECTO.md` con features reales y roadmap realista
- ✅ **Actualizado** `README.md` con instrucciones de instalador
- ✅ **Organizada** toda la documentación en carpeta `/docs`

#### Nuevos Documentos
- `uploads/README.md` - Guía de seguridad para archivos sensibles
- `docs/README.md` - Índice de documentación

#### Correcciones Críticas
- URL de repositorio corregida (ahora SAE-Project)
- Versión correcta en todos los documentos
- Eliminadas menciones de features inexistentes
- Todo en español (excepto LICENSE estándar GPL)

### 🔒 Seguridad

#### Gitignore Mejorado
- Patrón `uploads/**/*` para excluir TODO el contenido
- Agregadas carpetas: carnets, directores, usuarios, personal
- Removidos 5 archivos sensibles que estaban trackeados
- `uploads/README.md` documenta prácticas de seguridad

#### Repositorio Limpio
- ❌ Eliminados archivos de test temporales
- ❌ Eliminada documentación redundante
- ❌ Removido template README de Vite en inglés
- ✅ Estructura profesional y organizada

### 🏗️ Arquitectura

- **Desktop:** Electron v39 (aplicación nativa de Windows)
- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Base de Datos:** SQLite local (100% offline)
- **QR:** Html5-QRCode + qrcode
- **Reportes:** ExcelJS + PDFKit

### 📦 Sistema de Instalación

- ✅ Instalador Windows (.exe) con NSIS
- ✅ Setup Wizard automático en primera ejecución
- ✅ Configuración guiada de institución
- ✅ Creación de usuario administrador
- ✅ **PRÓXIMAMENTE:** Auto-actualización integrada

### 🔄 Cambiado

- Estado del proyecto: Beta → **Estable/Producción**
- Badge de versión: v0.9.0-beta → **v1.0.0**
- Status badge: Beta (amarillo) → **Stable (verde)**

### 🐛 Corregido

- Modal de cursos ahora aparece sobre modal de edición (z-index fix)
- Overlay de modales cubre toda la pantalla sin franjas
- QR code se carga correctamente en vista previa (blob URL)
- Limpieza de estados de cursos al cancelar o crear nuevo
- Fotos sensibles ya no se suben a GitHub

### 📊 Estadísticas del Release

- **Commits:** 200+ commits desde v0.9.0-beta
- **Archivos modificados en esta release:** 15+
- **Líneas de código agregadas:** ~1,500
- **Documentación actualizada:** 100%
- **Tests pasando:** ✅ 
- **Sin vulnerabilidades:** ✅

### 🚀 Próximos Pasos (v1.0.x)

- Auto-actualización integrada via electron-updater
- Instalador firmado digitalmente
- Correcciones de bugs reportados
- Optimizaciones de rendimiento

---

## [0.9.3-beta] - 2026-01-17 (Fixes Reportes y Ausentes)

### 🐛 Corregido

#### Reportes de Asistencias (Excel y PDF)
- **Sincronización Excel/PDF:**
  - Layout de columnas unificado (Fecha, Hora, Carnet, Nombre, Tipo/Grado, Sección, Jornada, Evento, Puntualidad).
  - Estilos visuales de Excel ajustados (Color header exacto `#1E3A8A`, fuente compacta 9pt/10pt).
  - Logos posicionados correctamente (Institución Izquierda, SAE Derecha).
- **Logos:**
  - Solucionado error donde el logo institucional no aparecía en PDF (ahora lee base64 de disco).
  - Logo SAE ahora usa ruta absoluta para evitar errores 404 en PDF.
- **Fechas y Filtros:**
  - **Filtro "Hoy":** Implementado parsing manual de fecha para evitar desfase de zona horaria UTC (falsos positivos de día anterior).
  - **Botón "Hoy":** Agregado acceso directo en Panel de Reportes.

#### Panel de Asistencias
- **Bug 500 en `/api/asistencias/ausentes`:**
  - Eliminado campo `departamento` de la consulta de Personal (campo inexistente en schema).
  - Aplicado fix de fecha local para cálculo de ausentes.
- **Visualización:**
  - Nueva columna "Sección" visible para alumnos.
  - Distinción visual clara: Alumnos (Badge Azul) vs Personal (Badge Verde).
  - Formato unificado "Tipo / Cargo" para personal.

### ✨ Agregado
- **Soporte de Sección:** Backend, DB y Frontend actualizados para manejar y mostrar `seccion` en asistencias.


### ✨ Agregado

#### Dashboard - Estadísticas de Personal
- **Gráfico de distribución de personal por sexo:** Visualización de personal masculino/femenino con gráfico de pastel
- **Gráfico de personal por cargo:** Distribución de personal por posiciones (Docente, Director, etc.) con gráfico de barras
- **Gráfico de usuarios por jornada:** Comparación de alumnos y personal por jornada (Matutina, Vespertina, etc.)
- **Estadísticas detalladas en backend:** Endpoint `/api/dashboard/stats` ahora incluye:
  - `personalPorSexo`: Conteo de personal por género
  - `personalPorCargo`: Distribución por cargos
  - `personalPorJornada`: Personal por jornada
  - `alumnosPorJornada`: Alumnos por jornada

#### Sistema de Carnets
- **Cálculo automático de nivel académico:** El campo `nivel_actual` ahora se calcula automáticamente basado en el grado del alumno
  - Primaria: 1ro-6to Primaria
  - Básicos: 1ro-3ro Básico/Básicos
  - Diversificado: 4to-6to, Bachillerato, Perito
- **Endpoint de migración:** `/api/alumnos/fix-niveles` para actualizar niveles de alumnos existentes
- **Lógica case-insensitive:** Acepta variaciones como "Básicos", "Basicos", "Básico"

### 🔄 Cambiado

#### Dashboard - Reorganización de Gráficos
- **Layout mejorado:** Gráficos separados en filas de 2 columnas para mejor visibilidad
  - Fila 1: Alumnos por Nivel + Alumnos por Grado
  - Fila 2: Alumnos - Distribución General + Personal - Distribución General
  - Fila 3: Personal por Cargo + Usuarios por Jornada
- **Altura aumentada:** Gráficos ahora tienen 300px de altura (antes 250px)
- **Labels mejorados:** Gráficos de pastel muestran valores y porcentajes directamente
- **Headers con iconos:** Cada gráfico tiene un icono distintivo y color temático
- **Títulos clarificados:**
  - "Distribución General" → "Alumnos - Distribución General"
  - Agregado "Personal - Distribución General"

#### AlumnosPanel - UI Mejorada
- **Columna Especialidad ampliada:** Ancho aumentado de 128px a 192px
- **Texto multi-línea:** Especialidades largas ahora se muestran en hasta 2 líneas
- **Tooltip agregado:** Hover sobre especialidad muestra texto completo

### 🐛 Corregido

#### Dashboard - Validación de Datos
- **Gráficos sin datos:** Mensajes informativos cuando no hay datos disponibles
- **Validación robusta:** Verificación de existencia de datos antes de renderizar gráficos
- **Campo jornada faltante:** Agregado `jornada` al select de alumnos en `/api/dashboard/stats`
- **Filtrado de valores vacíos:** Gráficos solo muestran categorías con datos > 0

#### Sistema de Carnets
- **Bug de carnet automático:** Corregido el problema donde el modo automático se quedaba en "Loading..." al cambiar de manual a automático
  - Agregado `carnetMode` como dependencia del `useEffect`
- **Reasignación de carnets:** Sistema completo de reasignación con validación y regeneración automática de QR
  - Modal dedicado con advertencias de seguridad
  - Validación en tiempo real
  - Regeneración automática de QR tras reasignación exitosa

### 🔧 Mejoras Técnicas

#### Backend
- **Logs de debug mejorados:** Agregados logs con emoji 📊 para facilitar debugging de estadísticas
- **Consultas optimizadas:** Select específico de campos necesarios en lugar de traer todos los datos
- **Validación flexible:** Soporte para variaciones de texto (mayúsculas/minúsculas, con/sin acentos)

#### Frontend
- **Componentes consistentes:** Todos los gráficos siguen el mismo patrón de diseño
- **Dark mode completo:** Todos los nuevos gráficos soportan modo oscuro
- **Responsive:** Gráficos se adaptan a diferentes tamaños de pantalla

### 📊 Impacto
- ✅ Dashboard más informativo con estadísticas de personal
- ✅ Mejor visualización de datos con gráficos separados
- ✅ Sistema de carnets más robusto y automático
- ✅ Nivel académico calculado automáticamente
- ✅ UI mejorada en panel de alumnos
- ✅ Mejor experiencia de usuario en general

---


## [0.9.1-beta] - 2026-01-13

### 🐛 Corregido

#### Sistema Multi-Cliente - Notificaciones WebSocket
- **Notificaciones de aprobación:** Los clientes ahora reciben notificaciones en tiempo real cuando un administrador aprueba su equipo
- **Fix en `/api/equipos/:id/approve`:** Agregada emisión de evento WebSocket `approval-status` después de actualizar el estado de aprobación
- **Eliminado estado de espera infinito:** Los clientes ya no quedan atrapados en "waiting-approval" indefinidamente

#### Socket.IO - Estabilidad del Servidor
- **Middleware namespace-specific:** Movido el middleware de autenticación de `io.use()` (global) a `clientNamespace.use()` y `adminNamespace.use()` (específico por namespace)
- **Prevención de race conditions:** Eliminados conflictos de inicialización entre namespaces
- **Mejor aislamiento:** Cada namespace (`/client` y `/admin`) ahora tiene su propio middleware de autenticación independiente
- **Estabilidad mejorada:** Reducción significativa de errores de conexión durante desarrollo y producción

### 📊 Impacto
- ✅ Sistema multi-cliente completamente funcional
- ✅ Notificaciones en tiempo real operativas
- ✅ Mayor estabilidad en conexiones WebSocket
- ✅ Experiencia de usuario mejorada en flujo de aprobación de equipos

---

## [0.9.0-beta] - 2026-01-07

### 🎉 Versión Beta Pública

Primera versión beta pública del Sistema de Administración Educativa (SAE).

### ✨ Agregado

#### Generación de Documentos Oficiales
- Servicio de generación de PDFs con PDFKit (`documentService.js`)
- Constancia de inscripción con datos del alumno y firma institucional
- Carta de buena conducta con evaluación de comportamiento
- Certificado de estudios con historial académico completo
- Endpoints API: `/api/documentos/*`
- Almacenamiento persistente en `/uploads/documentos/`

#### Optimizaciones
- Modo WAL activado en SQLite para mejor concurrencia (30-40% más rápido)
- Límite de memoria Node.js reducido a 256MB
- Frontend optimizado: chunks divididos, sin sourcemaps en producción
- Script de inicio inteligente (`start-dev.js`) con verificación de puertos

#### Documentación
- Manual técnico completo (`MANUAL_TECNICO.md`)
- Manual de usuario básico (`MANUAL_USUARIO.md`)
- Archivo `.env.example` con plantilla de configuración
- README.md renovado con todas las funcionalidades

#### Seguridad
- Validación de contraseña en operaciones críticas (factory reset)
- Rate limiting mejorado
- Logging estructurado con Pino

### 🔄 Cambiado

#### Arquitectura
- Migración de PostgreSQL (Supabase) a SQLite local
- Almacenamiento de imágenes de Cloudinary a sistema de archivos local
- Servicio `imageService.js` refactorizado para almacenamiento local

#### Nombres y Rutas
- `migracionService.js` → `promocionService.js` (mayor claridad)
- `routes/migracion.js` → `routes/promocion.js`
- Endpoint `/api/migracion` → `/api/promocion`

#### Metadatos y Branding
- Título de la aplicación: "Sistema de Gestión Institucional"
- Descripción actualizada en `package.json` (backend y frontend)
- Meta tags SEO optimizados en `index.html`
- PWA manifest actualizado con nombre descriptivo
- Versión sincronizada a 1.0.0 en ambos package.json

#### CORS
- Eliminadas URLs de Firebase (ya no se usan)
- Agregado soporte completo para redes locales:
  - 192.168.x.x (red doméstica/oficina)
  - 10.x.x.x (red corporativa)
  - 172.16-31.x.x (red privada)

### 🗑️ Eliminado

#### Dependencias Cloud
- `cloudinary` (v2.8.0) - Reemplazado por almacenamiento local
- `pg` (v8.16.3) - Reemplazado por SQLite

#### Código Legacy
- `backend/services/cloudinaryService.js` - Ya no se usa
- `scripts/test-cloudinary.js` - Obsoleto
- Referencias a Firebase en CORS

### 🐛 Corregido

- Servicio de archivos estáticos ahora activo (fotos, QRs, logos se sirven correctamente)
- CORS funciona en toda la red local sin configuración adicional
- Logging estructurado reemplaza `console.log` en producción

### 📦 Dependencias

#### Agregadas
- `pdfkit@^0.15.0` - Generación de documentos PDF

#### Actualizadas
- Todas las dependencias mantienen versiones estables

### 🔧 Configuración

- Nuevo archivo `.env.example` con plantilla completa
- `DATABASE_URL` ahora apunta a SQLite: `file:./backend/prisma/asistencias.db`
- Variables de Cloudinary eliminadas del `.env`

### 📊 Rendimiento

- Uso de memoria backend: <256MB (optimizado para 4GB RAM)
- Tiempo de inicio: <10 segundos
- Tiempo de respuesta API: <500ms
- Generación de PDF: <3 segundos

### 🎯 Características Principales

- ✅ Control de asistencias con códigos QR
- ✅ Gestión completa de alumnos y personal
- ✅ Promoción automática de alumnos por grado
- ✅ Generación de documentos oficiales (constancias, cartas, certificados)
- ✅ Reportes avanzados (Excel, PDF)
- ✅ Dashboard con gráficas en tiempo real
- ✅ Sistema de roles (Admin, Docente, Operador)
- ✅ Optimizado para hardware básico (4GB RAM)
- ✅ Funcionamiento 100% local (sin internet)

---

## [0.9.0] - 2025-12-XX

### Versión Beta
- Sistema base de asistencias con QR
- Gestión básica de alumnos y personal
- Reportes simples
- Despliegue en cloud (Railway + Supabase)

---

**Nota**: Las versiones anteriores a 1.0.0 no están documentadas en detalle.
