# 📚 SAE - Sistema de Administración Educativa
## Documentación General v1.0.8

**Última actualización**: 22 de febrero de 2026  
**Versión**: 1.0.8  
**Estado**: Producción  

---

## 📋 Contenido

1. [Descripción General](#descripción-general)
2. [Características Actuales](#características-actuales)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Funcionalidades Futuras](#funcionalidades-futuras)
5. [Requisitos del Sistema](#requisitos-del-sistema)
6. [Instalación y Uso](#instalación-y-uso)
7. [Estructura de Datos](#estructura-de-datos)
8. [API REST](#api-rest)
9. [Roadmap](#roadmap)

---

## 🎯 Descripción General

SAE es una **aplicación de escritorio** de gestión educativa diseñada para instituciones de Guatemala. Funciona **100% de forma local** (sin necesidad de internet ni servidores externos), instalándose en Windows como una aplicación nativa con Electron.

Permite administrar de manera centralizada:

- **Asistencias y justificaciones** de estudiantes y personal
- **Control de personal docente y administrativo**
- **Generación de reportes** en PDF y Excel
- **Fotos de perfil** de alumnos y personal
- **Códigos QR** para registro rápido de asistencia
- **Backups** manuales de la base de datos
- **Gestión de equipos** conectados en red local

**Características técnicas principales:**
- ✅ Aplicación de escritorio para Windows (Electron)
- ✅ Backend robusto con Node.js + Express.js
- ✅ Frontend moderno con React + Vite + TailwindCSS
- ✅ Base de datos SQLite gestionada con Prisma ORM
- ✅ Comunicación en tiempo real con Socket.IO
- ✅ Arquitectura de datos separados (binarios en Program Files, datos en AppData)
- ✅ Distribución como instalador NSIS + versión portable

> **Importante**: SAE **no** usa HTTPS, servicios cloud (Firebase, Supabase, Cloudinary, Railway), ni importación masiva desde Excel. Todo funciona en red local o en una sola máquina.

---

## ✨ Características Actuales

### 1. **Gestión de Asistencias** ✅

#### Registro de Asistencia
- Registro de asistencia para **alumnos** y **personal** (misma tabla unificada `asistencias`)
- Registro con código QR (lectura en frontend con `jsQR`)
- Registro manual desde los paneles de Alumnos y Personal
- Tipos de evento: `ENTRADA`, `SALIDA`, `RETARDO`, `LICENCIA`, `AUSENTE`
- Origen del registro: `QR`, `MANUAL`
- Control de puntualidad (`estado_puntualidad`) según horario de la institución
- Filtrado por fecha, tipo de persona, grado, jornada

#### Vista Revisión Rápida
- Panel Kanban (`RevisionRapidaView`) para revisar ausentes del día
- Justificación rápida desde el panel sin recargar la página

#### Reportes de Asistencia
- Reportes diarios, semanales, mensuales
- Exportación a PDF y Excel
- Historial de asistencia por alumno o personal

### 2. **Justificaciones / Excusas** ✅

- CRUD completo de justificaciones (tabla `excusas`)
- Tipos de justificación: motivo libre (texto)
- Carga de evidencia: imágenes o PDF (máx. 5 MB, almacenado en `uploads/justificaciones/`)
- Estados: `pendiente`, `aprobada`, `rechazada`
- Validación de duplicados: no se permite más de una justificación `pendiente` o `aprobada` para la misma persona y fecha
- Filtros por fecha, estado, tipo de persona
- Panel Kanban rediseñado con estadísticas de Ausentes Hoy / Semana / Mes / Pendientes / Rechazadas
- Aprobación/rechazo con notas de revisión (`observaciones`)

### 3. **Gestión de Alumnos** ✅

- Registro completo: carnet (auto o manual), nombres, apellidos, sexo, grado, sección, carrera, especialidad, jornada, año de ingreso
- Sistema de carnets **secuencial unificado** (`carnet_counter_alumnos` en `Institucion`)
- Niveles académicos calculados automáticamente según grado: `Primaria`, `Básicos`, `Diversificado`
- Foto de perfil (subida con compresión vía `sharp`)
- Código QR generado automáticamente al crear al alumno
- Estado: `activo`, `inactivo` (soft delete)
- Paginación cursor-based (máx. 200 por consulta)
- Historial académico por año (`HistorialAcademico`)

### 4. **Gestión de Personal** ✅

- Tabla unificada `personal` para **docentes, directores, administrativos** y cualquier tipo de personal
- Campos: carnet, nombres, apellidos, sexo, cargo, jornada, grado_guia, curso, foto_path
- Sistema de carnets secuencial propio (`carnet_counter_personal` en `Institucion`)
- Foto de perfil y código QR propios
- Estado: `activo`, `inactivo`
- Asistencias y justificaciones compartidas con alumnos (tabla polimórfica)

> **Nota**: No existe una tabla `Docente` separada. Todo el personal (docentes, directores, etc.) se registra en la tabla `personal`. La distinción se hace mediante el campo `cargo`.

### 5. **Generación de Reportes** ✅

- Reportes de asistencia por período
- Exportación a **PDF** (usando `pdfkit`) y **Excel** (formato personalizado)
- Gráficos de asistencia (`Chart.js` en frontend)
- Reporte de personal con control de entradas/salidas
- Los reportes de asistencia tienen sincronía visual entre PDF y Excel (misma estructura de columnas y estilos)

### 6. **Códigos QR** ✅

- Generación automática al crear alumno o personal (servicio `qrService`)
- QR único por persona (token en tabla `codigos_qr`)
- Regeneración manual disponible
- QR almacenado como archivo PNG en `uploads/qr/`
- Lectura en frontend con `jsQR` (sin dependencia de cámara nativa)

### 7. **Configuración de la Institución** ✅

- Nombre, logo (en base64 o path), dirección, país, departamento, municipio, email, teléfono
- Ciclo escolar actual (`ciclo_escolar`)
- Horario de inicio y salida (`horario_inicio`, `horario_salida`)
- Margen de puntualidad en minutos (`margen_puntualidad_min`, default 5)
- Clave de recuperación maestra (`master_recovery_key`)
- Wizard de configuración inicial (`SetupWizard.jsx`) al primer inicio

### 8. **Gestión de Usuarios del Sistema** ✅

- Tabla `usuarios` con roles: `admin`, `operador` (no hay roles separados por tipo de personal a nivel de BD)
- Autenticación JWT (`jsonwebtoken`)
- Contraseñas cifradas con bcrypt (10 rounds)
- Campo `activo` para habilitar/deshabilitar acceso
- Auditoría de acciones (`Auditoria`)

### 9. **Gestión de Equipos / Red Local** ✅

- Tabla `equipos` para registrar máquinas clientes que se conectan
- Aprobación de equipos: `aprobado: Boolean`
- Clave de seguridad única por equipo
- Registro de última conexión, hostname, IP, MAC, OS
- Modal de conexión (`ConnectionModal.jsx`)
- Sincronización via `sync.js` (route backend)

### 10. **Backups** ✅

- Backup manual bajo demanda (endpoint `POST /api/backup/crear`)
- Cifrado de backups con `crypto-js`
- Almacenado en `%APPDATA%\SAE\backups\`
- Listado y restauración desde el panel de configuración
- **No** hay backup automático programado (es manual)

### 11. **Seguridad** ✅

- Autenticación JWT con expiración
- Cifrado de contraseñas bcrypt (10 rounds)
- Rate limiting (`express-rate-limit`) en endpoints sensibles
- Validación de entrada con `express-validator`
- Headers seguros con `helmet`
- CORS configurado para red local
- Auditoría de cambios en tabla `Auditoria`

### 12. **Comunicación en Tiempo Real** ✅

- Socket.IO para actualizaciones instantáneas entre dispositivos en red local
- Notificaciones de asistencia registrada
- Sincronización de datos entre múltiples terminales

### 13. **Dashboard y Métricas** ✅

- Panel principal con estadísticas del día: total presentes, ausentes, retardos
- Métricas de justificaciones pendientes
- `MetricsPanel.jsx` con filtros de período
- Gráficos de tendencia con Chart.js

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React)                   │
│    Vite + React + TailwindCSS + Chart.js            │
│                                                     │
│  - Dashboard principal                              │
│  - Gestión de asistencias (manual + QR)             │
│  - Reportes y gráficos                              │
│  - QR Scanner (jsQR)                                │
│  - Exportación PDF/Excel                            │
│  - Panel Kanban de justificaciones                  │
│  - Wizard de configuración inicial                  │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP (localhost:5000)
                           │ WebSocket (Socket.IO)
                           │
┌──────────────────────────▼──────────────────────────┐
│              BACKEND (Node.js/Express)              │
│                                                     │
│  - REST API en /api/*                               │
│  - Socket.IO para tiempo real                       │
│  - Validación express-validator                     │
│  - Autenticación JWT                               │
│  - Multer para uploads (fotos, QR, documentos)      │
│  - PDFKit para reportes PDF                         │
│  - Logs con Pino                                    │
│  - sharp para compresión de imágenes               │
└──────────────────────────┬──────────────────────────┘
                           │ Prisma ORM
                           │
┌──────────────────────────▼──────────────────────────┐
│        DATABASE (SQLite + Prisma ORM)               │
│                                                     │
│  - Archivo dev.db en %APPDATA%\SAE\prisma\         │
│  - Prisma Client generado en backend/prisma-client  │
│  - Migraciones automáticas al iniciar              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         ELECTRON (electron/main.js)                 │
│                                                     │
│  - Lanza el backend como proceso hijo               │
│  - Crea ventana principal (BrowserWindow)           │
│  - Splash screen de inicio                          │
│  - Manejo de permisos y directorios                 │
│  - Logs en %APPDATA%\SAE\logs\                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│        FILE STORAGE (%APPDATA%\SAE\)                │
│                                                     │
│  uploads/alumnos/      → Fotos de alumnos          │
│  uploads/docentes/     → Fotos de docentes         │
│  uploads/directores/   → Fotos de directores       │
│  uploads/personal/     → Fotos de personal         │
│  uploads/qr/           → PNGs de códigos QR        │
│  uploads/justificaciones/ → Evidencia de excusas   │
│  backups/              → Backups cifrados           │
│  logs/                 → main.log + backend.log     │
│  temp/                 → Archivos temporales        │
│  prisma/dev.db         → Base de datos SQLite       │
└─────────────────────────────────────────────────────┘
```

### Separación de Rutas (v1.0.8)

**Binarios** → `C:\Program Files\SAE\` (solo lectura)
- Ejecutable Electron
- `app.asar.unpacked/` con backend, frontend/dist, node_modules
- `resources/prisma/schema.prisma` (referencia)
- `.env` con configuración base

**Datos** → `%APPDATA%\SAE\` (escribible)
- Base de datos SQLite (`prisma/dev.db`)
- Fotos, QRs y documentos (`uploads/`)
- Backups (`backups/`)
- Logs (`logs/main.log`, `logs/backend.log`)
- Archivos temporales (`temp/`)

> Esta separación permite instalar en Program Files (requiere permisos de admin) y que los datos persistan entre actualizaciones sin tocar Program Files.

---

## 🚀 Funcionalidades Futuras

### **Fase 1.1 - Mejoras Inmediatas** (Próximo)

- [ ] Importación masiva de alumnos desde Excel/CSV
- [ ] Integración SMTP para envío de correos (reportes, notificaciones)
- [ ] Backup automático programado (actualmente solo manual)
- [ ] Exportación CSV adicional a PDF/Excel
- [ ] Más roles de usuario (actualmente solo `admin` y `operador`)

### **Fase 2.0 - Nuevas Funcionalidades** (Planificado)

#### 1. **Sistema de Calificaciones**
- [ ] Registro de calificaciones por materia
- [ ] Cálculo automático de promedios
- [ ] Boletines digitales

#### 2. **Comunicación Docente-Padre**
- [ ] Sistema de mensajería integrado
- [ ] Notificaciones de baja asistencia

#### 3. **Portal del Padre**
- [ ] Consulta de asistencia del estudiante
- [ ] Acceso a reportes académicos

#### 4. **Gestión Académica**
- [ ] Horarios de clases
- [ ] Asignación de materias a docentes

### **Fase 2.5 - Movilidad e Integración**

#### 5. **App Móvil**
- [ ] App de docentes para registrar asistencia
- [ ] Offline-first

#### 6. **API Abierta**
- [ ] Documentación OpenAPI/Swagger
- [ ] Webhooks
- [ ] OAuth 2.0

### **Fase 3.0 - Analytics**

- [ ] Dashboard de KPIs educativos
- [ ] Predicción de deserción estudiantil
- [ ] Heatmaps de asistencia

---

## 📋 Requisitos del Sistema

### **Mínimos**
- **SO**: Windows 10+ (64-bit) — *Sistema diseñado para Windows*
- **RAM**: 2 GB mínimo
- **Disco**: 500 MB para instalación + espacio para datos (fotos, backups)
- **Procesador**: Intel/AMD 2 GHz+
- **Red**: Opcional (para múltiples terminales en red local con Socket.IO)

### **Recomendados**
- **SO**: Windows 11 (64-bit)
- **RAM**: 4 GB o más
- **Disco**: SSD con 2 GB+ libre
- **Procesador**: Intel i5 / AMD Ryzen 5+

> **Soporte Linux/macOS**: El `package.json` incluye targets de build para Linux (AppImage) y macOS (dmg). Sin embargo, el desarrollo y pruebas se realizan exclusivamente en Windows. El uso en otros sistemas operativos no está garantizado.

---

## 🚀 Instalación y Uso

### 1. **Instalación en Windows**

```
1. Descargar SAE-1.0.8-Setup.exe desde GitHub Releases
2. Ejecutar como Administrador (click derecho → "Ejecutar como administrador")
3. Seguir el asistente NSIS:
   - Elige directorio de instalación (default: C:\Program Files\SAE)
   - Se instala acceso directo en Escritorio y Menú Inicio
4. Una vez instalado, abre SAE desde el acceso directo
```

### 2. **Primera Ejecución**

```
1. Abre SAE desde el acceso directo
2. Aparece splash screen mientras se inicia el backend
3. Se abre el Wizard de Configuración Inicial:
   - Nombre de la institución
   - Horario de entrada/salida
   - Margen de puntualidad
   - Datos de contacto
4. Después del wizard, ingresa con el usuario admin por defecto
```

> **Credenciales por defecto**: El sistema crea un usuario administrador durante la instalación/setup. Consulta la clave maestra generada en `llave-maestra-*.txt` en caso de emergencia.

### 3. **Creación de Usuarios**

```
1. Inicia sesión como Administrador
2. Ve a Configuración → Usuarios
3. Crea nuevos usuarios (roles: admin, operador)
4. Asigna credenciales y compártelas de forma segura
```

### 4. **Registro de Alumnos y Personal**

```
1. Ve al panel de Alumnos o Personal
2. Clic en "Nuevo"
3. Completa los datos requeridos (nombres, apellidos, grado)
4. El carnet se genera automáticamente (o puedes ingresar uno manual)
5. El QR se genera automáticamente al crear el registro
6. Puedes subir foto de perfil desde el detalle del registro
```

### 5. **Registro de Asistencia**

```
Opción A - QR:
1. Ve a Asistencias → Escáner QR
2. Enfoca el QR del alumno/personal con la cámara o
   carga la imagen del QR
3. La asistencia se registra automáticamente

Opción B - Manual:
1. Ve al panel de Alumnos/Personal
2. Busca a la persona
3. Clic en el botón de asistencia manual
4. Selecciona el tipo (Entrada, Salida, etc.)
```

### 6. **Backups**

```
1. Ve a Configuración → Backups
2. Clic en "Crear Backup"
3. El backup se guarda en %APPDATA%\SAE\backups\
4. Para restaurar: sube el archivo de backup y confirma
```

---

## 📊 Estructura de Datos

### **Tablas Reales en la Base de Datos**

#### Institucion
```sql
-- Configuración global del sistema (solo 1 registro)
TABLE institucion {
  id                      Int      @id
  nombre                  String
  logo_base64             String?   -- Logo embebido en base64
  logo_path               String?   -- O ruta local al logo
  horario_inicio          String?   -- Ej: "07:00"
  horario_salida          String?   -- Ej: "13:00"
  margen_puntualidad_min  Int       @default(5)
  direccion               String?
  pais                    String?
  departamento            String?
  municipio               String?
  email                   String?
  telefono                String?
  ciclo_escolar           Int       @default(2026)
  inicializado            Boolean   @default(false)
  carnet_counter_global   Int       @default(0)
  carnet_counter_personal Int       @default(0)
  carnet_counter_alumnos  Int       @default(0)
  master_recovery_key     String?
  creado_en               DateTime
  actualizado_en          DateTime
}
```

#### Alumno
```sql
TABLE alumnos {
  id              Int      @id
  carnet          String   @unique
  nombres         String
  apellidos       String
  sexo            String?
  grado           String   -- "1ro Primaria", "2do Básico", etc.
  seccion         String?
  carrera         String?
  especialidad    String?
  jornada         String?  -- "Matutina", "Vespertina"
  estado          String   @default("activo") -- "activo" | "inactivo"
  nivel_actual    String?  -- Calculado: "Primaria" | "Básicos" | "Diversificado"
  anio_ingreso    Int?
  anio_graduacion Int?
  motivo_baja     String?
  fecha_baja      DateTime?
  foto_path       String?
  creado_en       DateTime
  actualizado_en  DateTime
  -- Relaciones: asistencias[], codigos_qr[], excusas[], historial[]
}
```

#### Personal
```sql
-- Unifica docentes, directores, administrativos, etc.
TABLE personal {
  id             Int      @id
  carnet         String   @unique
  nombres        String
  apellidos      String
  sexo           String?
  cargo          String?  -- "Docente", "Director", "Secretaria", etc.
  jornada        String?
  grado_guia     String?  -- Grado a su cargo (para docentes)
  curso          String?
  estado         String   @default("activo")
  foto_path      String?
  creado_en      DateTime
  actualizado_en DateTime
  -- Relaciones: asistencias[], codigos_qr[], excusas[]
}
```

#### Asistencia
```sql
-- Tabla polimórfica: alumnos Y personal en la misma tabla
TABLE asistencias {
  id                 Int      @id
  persona_tipo       String   -- "alumno" | "personal"
  alumno_id          Int?     -- FK → alumnos
  personal_id        Int?     -- FK → personal
  tipo_evento        String   -- "ENTRADA" | "SALIDA" | "RETARDO" | "LICENCIA" | "AUSENTE"
  timestamp          DateTime @default(now())
  origen             String   @default("QR") -- "QR" | "MANUAL"
  dispositivo        String?
  estado_puntualidad String?  -- "puntual" | "tarde" | null
  observaciones      String?
  creado_en          DateTime
}
```

#### Usuario
```sql
TABLE usuarios {
  id             Int      @id
  email          String   @unique
  nombres        String?
  apellidos      String?
  foto_path      String?
  cargo          String?
  jornada        String?
  rol            String   @default("operador") -- "admin" | "operador"
  hash_pass      String   -- bcrypt
  activo         Boolean  @default(true)
  creado_en      DateTime
  actualizado_en DateTime
  -- Relaciones: auditorias[]
}
```

#### Excusa (Justificación)
```sql
TABLE excusas {
  id             Int      @id
  alumno_id      Int?     -- FK → alumnos
  personal_id    Int?     -- FK → personal
  motivo         String   -- Texto libre del motivo
  descripcion    String?  -- Descripción adicional
  estado         String   @default("pendiente") -- "pendiente" | "aprobada" | "rechazada"
  fecha          DateTime @default(now())       -- Fecha de creación
  fecha_ausencia DateTime?                      -- Fecha de la ausencia justificada
  documento_url  String?  -- Ruta relativa en uploads/justificaciones/
  observaciones  String?  -- Nota del revisor al aprobar/rechazar
  creado_en      DateTime
  actualizado_en DateTime
}
```

#### CodigoQr
```sql
TABLE codigos_qr {
  id            Int      @id
  persona_tipo  String   -- "alumno" | "personal"
  alumno_id     Int?
  personal_id   Int?
  token         String   @unique
  png_path      String?  -- Ruta local del PNG generado
  vigente       Boolean  @default(true)
  generado_en   DateTime
  regenerado_en DateTime?
}
```

#### Auditoria
```sql
TABLE auditoria {
  id         Int      @id
  entidad    String   -- "Alumno", "Personal", etc.
  entidad_id Int?
  usuario_id Int?
  accion     String   -- "crear", "actualizar", "inactivar", etc.
  detalle    String?  -- JSON con campos modificados
  timestamp  DateTime @default(now())
}
```

#### Equipo
```sql
TABLE equipos {
  id              Int      @id
  nombre          String?
  hostname        String?
  ip              String   @unique
  os              String?
  mac_address     String?  @unique
  aprobado        Boolean  @default(false)
  clave_seguridad String   @unique
  ultima_conexion DateTime
  creado_en       DateTime
  actualizado_en  DateTime
}
```

#### HistorialAcademico
```sql
TABLE historial_academico {
  id            Int      @id
  alumno_id     Int      -- FK → alumnos
  anio_escolar  Int
  grado_cursado String
  nivel         String
  carrera       String?
  promovido     Boolean  @default(true)
  observaciones String?
  creado_en     DateTime
}
```

#### DiagnosticResult
```sql
-- Resultados del diagnóstico interno del sistema
TABLE diagnostic_results {
  id           Int      @id
  tipo         String
  codigo_qr_id Int?
  descripcion  String
  reparado     Boolean  @default(false)
  reparado_en  DateTime?
  timestamp    DateTime @default(now())
}
```

---

## 🔗 API REST

### **Base URL**
```
http://localhost:5000/api
```

> El backend escucha en el puerto **5000** por defecto. Esta URL es solo para red local.

### **Autenticación**
```bash
# Obtener token JWT
POST /api/auth/login
{
  "email": "admin@sae.local",
  "password": "tu_contraseña"
}

# Respuesta
{ "token": "<jwt_token>", "user": { ... } }

# Usar token en headers de todas las solicitudes:
Authorization: Bearer <jwt_token>
```

### **Endpoints Disponibles**

#### Auth
```
POST   /api/auth/login           - Iniciar sesión
POST   /api/auth/logout          - Cerrar sesión
GET    /api/auth/me              - Perfil del usuario actual
```

#### Alumnos
```
GET    /api/alumnos              - Listar alumnos (paginación cursor)
GET    /api/alumnos/:id          - Obtener alumno con QR y últimas asistencias
POST   /api/alumnos              - Crear alumno (genera carnet y QR auto)
PUT    /api/alumnos/:id          - Actualizar alumno
DELETE /api/alumnos/:id          - Inactivar alumno (soft delete)
POST   /api/alumnos/:id/foto     - Subir foto de perfil (multipart)
GET    /api/alumnos/next-carnet  - Preview del siguiente carnet auto
POST   /api/alumnos/validate-carnet - Validar formato y disponibilidad de carnet
POST   /api/alumnos/fix-niveles  - Recalcular nivel_actual de todos los alumnos
```

#### Personal
```
GET    /api/docentes             - Listar personal
GET    /api/docentes/:id         - Obtener personal
POST   /api/docentes             - Crear personal
PUT    /api/docentes/:id         - Actualizar personal
DELETE /api/docentes/:id         - Inactivar personal
POST   /api/docentes/:id/foto    - Subir foto
```

#### Asistencias
```
GET    /api/asistencias          - Listar (filtros: fecha, tipo, grado, jornada)
POST   /api/asistencias          - Registrar asistencia manual
PUT    /api/asistencias/:id      - Actualizar asistencia
DELETE /api/asistencias/:id      - Eliminar asistencia
GET    /api/asistencias/ausentes-hoy - Personas sin entrada hoy
```

#### Justificaciones (Excusas)
```
GET    /api/excusas              - Listar (filtros: fechaInicio, fechaFin, estado, personaTipo)
POST   /api/excusas              - Crear justificación (multipart con archivo)
PUT    /api/excusas/:id          - Aprobar/Rechazar (estado + observaciones)
DELETE /api/excusas/:id          - Eliminar (borra el archivo asociado)
```

#### QR
```
GET    /api/qr/:token            - Obtener info del QR por token
POST   /api/qr/registrar         - Registrar asistencia por QR
POST   /api/qr/regenerar         - Regenerar QR de una persona
GET    /api/qr/:tipo/:id/imagen  - Obtener imagen PNG del QR
```

#### Reportes
```
GET    /api/reportes/asistencias - Reporte de asistencias (PDF o Excel según ?formato=)
GET    /api/reportes/personal    - Reporte de personal
```

#### Backups
```
POST   /api/backup/crear         - Crear backup manual
GET    /api/backup/listar        - Listar backups disponibles
POST   /api/backup/restaurar     - Restaurar desde backup
DELETE /api/backup/:nombre       - Eliminar backup
```

#### Dashboard y Métricas
```
GET    /api/dashboard            - Estadísticas generales del día
GET    /api/metrics              - Métricas de asistencia para gráficos
```

#### Institución
```
GET    /api/institucion          - Obtener configuración
PUT    /api/institucion          - Actualizar configuración
POST   /api/institucion/logo     - Subir logo
```

#### Usuarios del Sistema
```
GET    /api/usuarios             - Listar usuarios del sistema
POST   /api/usuarios             - Crear usuario
PUT    /api/usuarios/:id         - Actualizar usuario
DELETE /api/usuarios/:id         - Desactivar usuario
```

#### Equipos
```
GET    /api/equipos              - Listar equipos
PUT    /api/equipos/:id/aprobar  - Aprobar equipo en red local
DELETE /api/equipos/:id          - Eliminar equipo
```

#### Sincronización
```
POST   /api/sync                 - Sincronizar datos entre terminales
```

#### Health
```
GET    /api/health               - Estado del backend (usado por Electron para saber si está listo)
```

### **Parámetros de Consulta Comunes**
```
?limit=50          - Límite de resultados (max 200 para alumnos)
?cursor=<id>       - Cursor para paginación (ID del último item)
?estado=activo     - Filtrar por estado
?grado=1ro Primaria - Filtrar por grado
?jornada=Matutina  - Filtrar por jornada
?desde=2026-01-01  - Fecha inicio (formato YYYY-MM-DD)
?hasta=2026-02-22  - Fecha fin
?personaTipo=alumno|personal - Tipo de persona para asistencias/excusas
```

---

## 📈 Roadmap

```
v1.0.8 (ACTUAL — feb 2026) ✅
├─ ✅ Control de asistencia (alumnos y personal)
├─ ✅ Gestión de alumnos y personal en tabla unificada
├─ ✅ Reportes PDF y Excel sincronizados
├─ ✅ Sistema de justificaciones con evidencia
├─ ✅ Backups manuales cifrados
├─ ✅ Panel Kanban de justificaciones rediseñado
├─ ✅ Arquitectura AppData (datos separados de binarios)
├─ ✅ Carnets secuenciales unificados
├─ ✅ Gestión de equipos en red local
└─ ✅ Wizard de configuración inicial

v1.1.0 (Q2 2026) — Planificado
├─ [ ] Importación masiva desde Excel/CSV
├─ [ ] Backup automático programado
├─ [ ] Más roles de usuario (director, docente, secretaria)
├─ [ ] Notificaciones por correo (SMTP)
└─ [ ] Mejoras de rendimiento en reportes

v2.0.0 (Q4 2026) — Planificado
├─ [ ] Calificaciones y boletines digitales
├─ [ ] Portal de padres (web)
├─ [ ] Comunicación docente-padre
├─ [ ] Horarios de clases
└─ [ ] API documentada (OpenAPI)

v3.0.0 (2027-2028) — Visión futura
├─ [ ] App móvil iOS/Android
├─ [ ] Machine Learning (predicción deserción)
├─ [ ] Analytics avanzado
└─ [ ] Internacionalización (i18n)
```

---

## 📞 Soporte y Contribuciones

### **Reportar Problemas**
```
GitHub Issues: https://github.com/Hikki777/SAE-Project/issues
```

### **Logs de Diagnóstico**
En caso de problemas, revisar:
```
%APPDATA%\SAE\logs\main.log       — Log principal de Electron
%APPDATA%\SAE\logs\backend.log    — Log del servidor backend
```

### **Contribuir al Proyecto**
```
1. Fork el repositorio: https://github.com/Hikki777/SAE-Project
2. Crea rama feature (git checkout -b feature/nueva-funcion)
3. Commit cambios (git commit -m 'feat: descripción')
4. Push a rama (git push origin feature/nueva-funcion)
5. Abre Pull Request
```

### **Licencia**
```
SAE está bajo licencia GPL-3.0
Eres libre de usar, modificar y distribuir
con atribución y bajo la misma licencia.
```

---

## 📚 Documentación Relacionada

- [Manual de Usuario](./MANUAL_USUARIO.md)
- [Manual Técnico](./MANUAL_TECNICO.md)
- [Guía de Instalación](../DOWNLOAD_INSTRUCTIONS.md)
- [FAQ del Instalador](./FAQ_INSTALADOR.md)
- [Notas de versión v1.0.8](../docs/releases/v1.0.8.md)

---

## 📊 Estadísticas del Proyecto

| Aspecto | Información |
|---------|------------|
| Versión | 1.0.8 |
| Tamaño Setup | ~170 MB |
| BD | SQLite (dev.db) |
| ORM | Prisma 5.x |
| Tablas en BD | 10 modelos |
| Rutas de API | 17 archivos de rutas |
| Componentes Frontend | 23 componentes JSX |
| Dependencias | 30+ producción |
| Licencia | GPL-3.0 |

---

**Última actualización**: 22 de febrero de 2026  
**Próxima revisión**: Con release v1.1.0

Para más información, visita: https://github.com/Hikki777/SAE-Project
