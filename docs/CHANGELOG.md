# Changelog

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
