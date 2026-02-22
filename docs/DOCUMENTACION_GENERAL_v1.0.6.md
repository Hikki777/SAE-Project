# 📚 SAE - Sistema de Administración Educativa
## Documentación General v1.0.6

**Última actualización**: 21 de febrero de 2026  
**Versión**: 1.0.6  
**Estado**: Producción  

---

## 📋 Contenido

1. [Descripción General](#descripción-general)
2. [Características Actuales](#características-actuales)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Funcionalidades en Desarrollo](#funcionalidades-futuras)
5. [Requisitos del Sistema](#requisitos-del-sistema)
6. [Instalación y Uso](#instalación-y-uso)
7. [Estructura de Datos](#estructura-de-datos)
8. [API REST](#api-rest)
9. [Roadmap](#roadmap)

---

## 🎯 Descripción General

SAE es una **solución integral de gestión educativa** diseñada para instituciones de Guatemala. Permite administrar de manera centralizada:

- **Asistencias y justificaciones** de estudiantes
- **Control de personal docente y administrativo**
- **Generación de reportes** detallados
- **Gestión de fotos y documentos** del estudiante
- **Códigos QR** para registro rápido de asistencia
- **Backups automáticos** de datos

**Características técnicas principales:**
- ✅ Aplicación de escritorio multiplataforma (Windows, Linux, macOS vía Electron)
- ✅ Backend robusto con Express.js
- ✅ Frontend moderno con React + Vite
- ✅ Base de datos SQLite con Prisma ORM
- ✅ Comunicación en tiempo real con Socket.IO
- ✅ Arquitectura de binarios/datos separados

---

## ✨ Características Actuales

### 1. **Gestión de Asistencias** ✅

#### Registro de Asistencia
- Registro manual de asistencia por alumno/docente
- Registro rápido con código QR
- Búsqueda y filtrado por fecha
- Soporte para múltiples dispositivos conectados en tiempo real (Socket.IO)

#### Reportes
- Reportes diarios, semanales, mensuales
- Exportación a PDF/Excel
- Gráficos de asistencia por estudiante
- Análisis de franjas horarias

#### Justificaciones
- Sistema de excusas/justificaciones
- Carga de evidencia (PDF, imágenes)
- Estados: Pendiente, Aprobada, Rechazada
- Historial de cambios

### 2. **Gestión de Alumnos** ✅

#### Información Básica
- Registro completo de estudiantes
- Cédula/DPI única
- Información de contacto
- Nivel educativo y sección

#### Documentación
- Foto de perfil
- Documentos digitales (cédula, acta de nacimiento)
- Historial académico
- Registros médicos (si aplica)

### 3. **Gestión de Docentes y Personal** ✅

#### Registro
- Base de datos de personal docente y administrativo
- Especialidades y horarios
- Información de contacto

#### Asistencia del Personal
- Control de entrada y salida
- Reportes de puntualidad
- Historial de asistencia

### 4. **Directores y Administradores** ✅

#### Panel Administrativo
- Vista general del sistema
- Estadísticas educativas
- Control de usuarios y permisos
- Auditoría de cambios

#### Gestión del Sistema
- Backup automático de datos
- Restauración de backups
- Administración de usuarios
- Configuración institucional

### 5. **Generación de Reportes** ✅

- **Reportes de Asistencia**: Detallados, sumarizados, gráficos
- **Reportes Académicos**: Rendimiento estudiantil
- **Reportes de Nómina**: Asistencia del personal
- **Exportación**: PDF, Excel, CSV
- **Programación**: Reportes automáticos en fechas específicas

### 6. **Seguridad** ✅

- Autenticación con JWT
- Cifrado de contraseñas con bcrypt
- Control de acceso por roles (RBAC)
- Auditoría de acciones de usuarios
- HTTPS en producción
- Cifrado de backups

### 7. **Sincronización en Tiempo Real** ✅

- Socket.IO para actualizaciones instantáneas
- Múltiples usuarios editando simultáneamente
- Notificaciones push (en navegador)

### 8. **Backups y Recuperación** ✅

- Backup automático diario
- Backup manual bajo demanda
- Cifrado de backups con contraseña
- Restauración completa de datos
- Versioning de backups

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React)                   │
│    Vite + React + TailwindCSS + React Query        │
│                                                     │
│  - Dashboard principal                              │
│  - Gestión de asistencias                          │
│  - Reportes y gráficos (Chart.js)                  │
│  - QR Scanner (jsQR)                               │
│  - Exportación PDF (html2canvas, pdfkit)           │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP/WebSocket
                           │
┌──────────────────────────▼──────────────────────────┐
│              BACKEND (Node.js/Express)              │
│                                                     │
│  - REST API (GET, POST, PUT, DELETE)               │
│  - Socket.IO para tiempo real                      │
│  - Validación express-validator                    │
│  - Autenticación JWT                               │
│  - Multer para uploads                             │
│  - Logs con Pino                                   │
└──────────────────────────┬──────────────────────────┘
                           │ SQL
                           │
┌──────────────────────────▼──────────────────────────┐
│        DATABASE (SQLite + Prisma ORM)               │
│                                                     │
│  - Prisma schema                                    │
│  - Migrations automáticas                          │
│  - Query builder type-safe                         │
│  - Relaciones complejas                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│            FILE STORAGE (%APPDATA%\SAE)             │
│                                                     │
│  - /uploads: Fotos, documentos                     │
│  - /backups: Backups cifrados                      │
│  - /logs: Registros del sistema                    │
│  - /temp: Archivos temporales                      │
└─────────────────────────────────────────────────────┘
```

### Conexión Escritorio (Electron)

```
┌─────────────────────────────────────┐
│      Electron Main Process          │
│  (electron/main.js)                 │
│                                     │
│  - Gestión de ventana               │
│  - IPC comunicación                 │
│  - Spawn backend Node               │
│  - Validación de directorios        │
└────────────────┬────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌─────────────┐      ┌──────────────┐
│ React App   │      │ Backend      │
│ (Renderer)  │      │ (Node)       │
│             │      │              │
└─────────────┘      └──────────────┘
```

### Separación de Rutas

**Binarios** → `C:\Program Files\SAE\`  
- Ejecutables
- Dependencias (node_modules)
- Frontend (dist)
- Código backend

**Datos** → `%APPDATA%\Roaming\SAE\`
- Base de datos SQLite
- Fotos de estudiantes
- Backups
- Logs
- Archivos temporales

---

## 🚀 Funcionalidades Futuras

### **Fase 2.0 - Mejoras de Funcionalidad** (Planificado)

#### 1. **Sistema de Calificaciones Avanzado**
- [ ] Registro de calificaciones por materia
- [ ] Cálculo automático de promedios
- [ ] Boletines digitales
- [ ] Histórico de calificaciones
- [ ] Análisis de desempeño académico

#### 2. **Comunicación Docente-Padre**
- [ ] Sistema de mensajería integrado
- [ ] Notificaciones automáticas (baja asistencia, inasistencia)
- [ ] Alertas de rendimiento académico
- [ ] Comunicados institucionales
- [ ] Feedback en tiempo real

#### 3. **Portal del Padre/Guardián**
- [ ] App web para consultar datos del estudiante
- [ ] Ver asistencia en tiempo real
- [ ] Recibir notificaciones
- [ ] Comunicación directa con docentes
- [ ] Acceso a reportes académicos

#### 4. **Gestión Académica Avanzada**
- [ ] Horarios de clases
- [ ] Asignación de materias a docentes
- [ ] Plan de estudios por nivel
- [ ] Evaluaciones diagnósticas
- [ ] Seguimiento de objetivos educativos

#### 5. **Sistema de Becas y Ayudas**
- [ ] Registro de becarios
- [ ] Seguimiento de condiciones
- [ ] Reportes de desempeño para becarios
- [ ] Auditoría de cumplimiento

### **Fase 2.5 - Integración y Movilidad**

#### 6. **Aplicación Móvil (iOS/Android)**
- [ ] App de docentes para registrar asistencia en aula
- [ ] App de padres para consultar información
- [ ] Sincronización automática
- [ ] Offline-first para zonas sin internet
- [ ] Push notifications

#### 7. **Integración con Sistemas Externos**
- [ ] Sincronización con sistemas contables
- [ ] Integración bancaria para pagos
- [ ] Exportación a formato estándar SEP/MINEDUC
- [ ] Integración con Google Workspace
- [ ] Integración con Microsoft 365

#### 8. **API Abierta para Terceros**
- [ ] Documentación completa (OpenAPI/Swagger)
- [ ] Webhooks
- [ ] Rate limiting
- [ ] OAuth 2.0 para aplicaciones externas
- [ ] Ejemplos de integración

### **Fase 3.0 - Análisis e Inteligencia**

#### 9. **Analytics Avanzado**
- [ ] Dashboard de KPIs educativos
- [ ] Predicción de deserción estudiantil
- [ ] Análisis de patrones de asistencia
- [ ] Heatmaps de actividad
- [ ] Comparativa con otros períodos

#### 10. **Machine Learning (Experimental)**
- [ ] Predicción de rendimiento académico
- [ ] Detección de anomalías en asistencia
- [ ] Sugerencias de mejora accionables
- [ ] Clustering de estudiantes por riesgo
- [ ] Pronóstico de absentismo

#### 11. **Automatización de Procesos**
- [ ] Reglas personalizables (if/then)
- [ ] Workflows automáticos
- [ ] Escaladas automáticas
- [ ] Generación automática de reportes
- [ ] Acciones programadas

### **Fase 3.5 - Experiencia de Usuario**

#### 12. **Mejoras de UX/UI**
- [ ] Temas personalizables (modo oscuro)
- [ ] Internacionalización (i18n)
- [ ] Modo offline completo
- [ ] Mejora de accesibilidad (WCAG 2.1)
- [ ] Progressive Web App (PWA)

#### 13. **Documentación Avanzada**
- [x] Documentación actual
- [ ] Videos tutoriales
- [ ] Documentación interactiva
- [ ] Certificaciones para usuarios
- [ ] Help contextual en la app

---

## 📋 Requisitos del Sistema

### **Mínimos**
- **SO**: Windows 10+, Linux (Ubuntu 18+), macOS 10.13+
- **RAM**: 2GB mínimo
- **Disco**: 500MB (instalación) + espacio para datos
- **Procesador**: Intel/AMD 2GHz+
- **Red**: Conexión a red local

### **Recomendados**
- **SO**: Windows 11, Linux (Ubuntu 22+), macOS 12+
- **RAM**: 4GB o más
- **Disco**: SSD con 2GB+ libre
- **Procesador**: Intel i5 / AMD Ryzen 5+
- **Red**: Gigabit Ethernet

### **Navegador (Modo Web Futuro)**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Instalación y Uso

### 1. **Instalación en Windows**

```bash
# Descargar SAE-1.0.6-Setup.exe desde releases
# Ejecutar como Administrador
SAE-1.0.6-Setup.exe

# El instalador:
# 1. Extrae binarios a C:\Program Files\SAE\
# 2. Crea estructura en %APPDATA%\Roaming\SAE\
# 3. Crea acceso directo en Escritorio
```

### 2. **Primera Ejecución**

```
1. Haz doble clic en el acceso directo "SAE"
2. Espera a que se inicialice la base de datos (primera vez ~30 segundos)
3. Se abrirá con usuario admin por defecto
4. Ingresa el PIN administrativo para acceder
```

### 3. **Creación de Usuarios**

```
1. Inicia sesión como Administrador
2. Ve a Configuración > Usuarios
3. Crea nuevos usuarios (Docentes, Directores, etc.)
4. Asigna roles y permisos
5. Comparte credenciales de manera segura
```

### 4. **Importación de Datos**

```
1. Prepara un archivo Excel con estructura:
   - Cédula, Nombre, Nivel, Sección, Contacto
2. Ve a Gestión > Alumnos > Importar
3. Sube el archivo
4. Revisa y confirma los datos
5. Se crean automáticamente en el sistema
```

### 5. **Configuración Inicial**

```
1. Configuración > Institución
   - Nombre de la institución
   - Logo (opcional)
   - Información de contacto
   
2. Configuración > Jornadas
   - Horarios de entrada y salida
   - Días laborales
   
3. Configuración > Permisos
   - Roles de usuario
   - Acceso a módulos
```

---

## 📊 Estructura de Datos

### **Tablas Principales**

#### Institución
```sql
CREATE TABLE Institución {
  id: Int @id
  nombre: String
  logo: String?
  telefono: String?
  email: String?
  direccion: String?
  pais: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Usuarios
```sql
CREATE TABLE Usuario {
  id: Int @id
  nombre: String
  email: String @unique
  password: String (bcrypt)
  rol: Rol (ADMIN, DOCENTE, DIRECTOR, PERSONAL)
  activo: Boolean
  ultimoAcceso: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Alumnos
```sql
CREATE TABLE Alumno {
  id: Int @id
  cedula: String @unique
  nombre: String
  apellido: String
  foto: String?
  genero: String
  fecha_nacimiento: DateTime
  nivel: String (1, 2, 3, ..., Básico, Diversificado)
  seccion: String
  estado: String (ACTIVO, INACTIVO, SUSPENDIDO)
  asistencias: Asistencia[]
  excusas: Excusa[]
}
```

#### Asistencias
```sql
CREATE TABLE Asistencia {
  id: Int @id
  alumno_id: Int
  tipo: String (PRESENTE, AUSENTE, RETARDO, LICENCIA)
  fecha: DateTime
  hora_entrada: DateTime?
  hora_salida: DateTime?
  registrador_id: Int
  notas: String?
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Excusas/Justificaciones
```sql
CREATE TABLE Excusa {
  id: Int @id
  alumno_id: Int
  personal_id: Int?
  tipo: String (MEDICA, FAMILIAR, PERSONAL, OTRO)
  motivo: String
  fecha_ausencia: DateTime
  descripcion: String?
  estado: String (PENDIENTE, APROBADA, RECHAZADA)
  archivo: String? (PDF, imagen)
  revisado_por: Int?
  nota_revision: String?
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Docentes
```sql
CREATE TABLE Docente {
  id: Int @id
  cedula: String @unique
  nombre: String
  apellido: String
  especialidad: String
  email: String
  telefonoContacto: String
  asistencias: Asistencia[]
  usuario: Usuario?
}
```

#### Backup
```sql
CREATE TABLE Backup {
  id: Int @id
  nombre: String
  fecha: DateTime
  tamaño: BigInt
  ruta: String
  cifrado: Boolean
  version_sae: String
  createdAt: DateTime
  createdBy: Int
}
```

---

## 🔗 API REST

### **Base URL**
```
http://localhost:5000/api
```

### **Autenticación**
```bash
# Obtener token
POST /api/auth/login
{
  "email": "usuario@institucion.gt",
  "password": "contraseña"
}

# Usar token en headers
Authorization: Bearer <token>
```

### **Endpoints Principales**

#### Asistencias
```
GET    /api/asistencias           - Listar asistencias (con filtros)
GET    /api/asistencias/:id       - Obtener asistencia
POST   /api/asistencias           - Registrar asistencia
PUT    /api/asistencias/:id       - Actualizar asistencia
DELETE /api/asistencias/:id       - Eliminar asistencia
```

#### Alumnos
```
GET    /api/alumnos               - Listar alumnos
GET    /api/alumnos/:id           - Obtener alumno
POST   /api/alumnos               - Crear alumno
PUT    /api/alumnos/:id           - Actualizar alumno
DELETE /api/alumnos/:id           - Eliminar alumno
POST   /api/alumnos/importar      - Importar desde archivo
```

#### Reportes
```
GET    /api/reportes/asistencias  - Reporte de asistencias
GET    /api/reportes/estudiante   - Reporte por estudiante
GET    /api/reportes/pdf/:id      - Descargar PDF
GET    /api/reportes/excel/:id    - Descargar Excel
```

#### Backups
```
POST   /api/backup/crear          - Crear backup
GET    /api/backup/listar         - Listar backups
POST   /api/backup/restaurar      - Restaurar backup
DELETE /api/backup/:id            - Eliminar backup
```

### **Parámetros de Query Comunes**
```
?limite=50         - Límite de resultados
?pagina=1          - Número de página
?ordenar=fecha     - Campo para ordenar
?orden=DESC        - ASC o DESC
?filtro[campo]=valor
?desde=2026-01-01
?hasta=2026-02-21
```

---

## 📈 Roadmap

### **Timeline de Desarrollo**

```
v1.0.6 (ACTUAL)
├─ ✅ Control de asistencia
├─ ✅ Gestión de alumnos/docentes
├─ ✅ Reportes básicos
├─ ✅ Sistema de justificaciones
├─ ✅ Backups automatizados
└─ ✅ Interfaz UI/UX mejorada

v1.1.0 (Q2 2026)
├─ [ ] Mejoras de rendimiento
├─ [ ] Reportes avanzados (BI)
├─ [ ] Integración SMTP (correos)
├─ [ ] API mejorada
└─ [ ] Documentación técnica completa

v2.0.0 (Q4 2026)
├─ [ ] Calificaciones y boletines
├─ [ ] Portal de padres
├─ [ ] Comunicación integrada
├─ [ ] Webhooks
└─ [ ] API abierta

v2.5.0 (2027)
├─ [ ] App móvil iOS/Android
├─ [ ] Integraciones externas
├─ [ ] Marketplace de extensiones
└─ [ ] SaaS versión en cloud

v3.0.0 (2027-2028)
├─ [ ] Machine Learning
├─ [ ] Analytics avanzado
├─ [ ] Automatización
└─ [ ] Internacionalización
```

---

## 📞 Soporte y Contribuciones

### **Reportar Problemas**
```
GitHub Issues: https://github.com/Hikki777/SAE-Project/issues
Correo: soporte@sae-educativa.gt (futuro)
```

### **Contribuir al Proyecto**
```
1. Fork el repositorio
2. Crea rama feature (git checkout -b feature/nueva-funcion)
3. Commit cambios (git commit -m 'Agrega nueva función')
4. Push a rama (git push origin feature/nueva-funcion)
5. Abre Pull Request
```

### **Licencia**
```
SAE está bajo licencia GPL-3.0
Eres libre de usar, modificar y distribuir
con atribución y bajo la misma licencia
```

---

## 📚 Documentación Relacionada

- [Manual de Usuario](./MANUAL_USUARIO.md)
- [Manual Técnico](./MANUAL_TECNICO.md)
- [Guía de Instalación](../DOWNLOAD_INSTRUCTIONS.md)
- [FAQ del Instalador](./FAQ_INSTALADOR.md)
- [Cambios en v1.0.6](../CHANGELOG_v1.0.6.md)

---

## 🔐 Seguridad

### **Políticas Implementadas**
- ✅ Cifrado bcrypt para contraseñas (salted, 10 rounds)
- ✅ JWT con expiración de tokens
- ✅ HTTPS en producción
- ✅ Validación de entrada (express-validator)
- ✅ Sanitización de datos
- ✅ CORS configurado
- ✅ Rate limiting en endpoints sensibles
- ✅ Auditoría de cambios
- ✅ Backups cifrados

### **Políticas Futuras**
- [ ] 2FA (Two-Factor Authentication)
- [ ] OAuth2 / SAML
- [ ] Certificados SSL/TLS
- [ ] Encriptación end-to-end
- [ ] Cumplimiento GDPR/LOPD

---

## 📊 Estadísticas Técnicas

- **Líneas de código**: ~25,000+
- **Archivos**: 150+
- **Dependencias**: 80+
- **Pruebas**: 30+ (cobertura 60%+)
- **Documentación**: 500+ páginas

---

**Última actualización**: 21 de febrero de 2026  
**Próxima revisión**: 15 de marzo de 2026

Para más información, visita: https://github.com/Hikki777/SAE-Project
