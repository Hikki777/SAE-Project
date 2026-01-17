# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.9.2-beta] - 2026-01-17

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
