# SAE - Sistema de Administración Educativa - Estado del Proyecto

**Fecha:** 13 de abril de 2026  
**Versión:** 1.1.2 (Release Stable)  
**Estado:** ✅ Listo para Release de Producción

---

## 🎯 Resumen del Sistema

Sistema integral de gestión educativa diseñado específicamente para instituciones guatemaltecas. Controla asistencias mediante códigos QR, administra expedientes completos de alumnos y personal, gestiona justificaciones de ausencias, y provee métricas en tiempo real. 

**Arquitectura:** Aplicación de Escritorio (Electron) con base de datos local (SQLite) que funciona 100% offline.

---

## ✅ Funcionalidades Implementadas (v1.1.2)

### 🖥️ Plataforma y Core
- **Aplicación de Escritorio:** Electron v39 para Windows (Linux y macOS en desarrollo)
- **Setup Wizard:** Asistente de instalación inicial intuitivo
- **100% Offline:** No requiere conexión a internet para funcionar
- **Base de Datos Local:** SQLite con modo WAL para alto rendimiento
- **Dark Mode:** Tema oscuro integrado en toda la aplicación

### 👥 Gestión de Usuarios
- **Alumnos:** 
  - Expediente completo con foto
  - Generación automática de carnets con código QR
  - Historial de asistencias
  - Gestión de estados (Activo/Inactivo/Repitente)
  - Soporte para todos los niveles (Preprimaria, Primaria, Básicos, Diversificado)
  
- **Personal:** 
  - Gestión de docentes y administrativos
  - Asignación de cursos múltiples para docentes
  - Grado guía para maestros
  - Diferentes cargos (Docente, Director, Subdirector, Secretaria, etc.)

- **Control de Acceso (RBAC):** 
  - Rol Administrador (acceso total al sistema)
  - Rol Operador (solo toma de asistencias y consultas)

### ⏱️ Control de Asistencias
- **Scanner QR:** Lectura rápida mediante cámara web o lector físico
- **Registro Manual:** Opción de respaldo para entrada manual de asistencias
- **Validación de Horarios:** Detección automática de retardos según configuración institucional
- **Gestión de Salidas:** Control de salidas tempranas y permisos
- **Modal de entrada sin salida previa:** Advertencia al marcar asistencia sin salida del día anterior

### 📝 Justificaciones y Excusas
- **Módulo completo** para gestionar ausencias médicas, familiares y otras
- **Flujo de estados:** Pendiente → Aprobada/Rechazada
- **Adjuntar documentos** de respaldo
- **Historial completo** por alumno/personal

### 📊 Análisis y Reportes
- **Dashboard en Tiempo Real:** 
  - Gráficos de asistencia diaria
  - Análisis de puntualidad
  - Estadísticas de ausentismo
  - Métricas por jornada y grado
  
- **Reportes Exportables:** 
  - Generación de Excel (.xlsx) para listados
  - Reportes de asistencias del día
  - Reportes personalizados por fecha
  - Vista de carnets para impresión

### 🎨 Interfaz de Usuario
- **Modal de Vista Previa:** Click en fotos para ver información completa + QR
- **Responsive Design:** Funciona en diferentes tamaños de pantalla
- **Animaciones suaves:** `framer-motion` para mejor UX
- **Feedback visual:** Loading states, toasts, confirmaciones
- **Búsqueda y filtros avanzados** en todos los módulos

### 🔒 Infraestructura y Seguridad
- **Seguridad:**
  - Contraseñas hasheadas con bcrypt
  - JWT para autenticación
  - Rate limiting en endpoints críticos
  - Validación estricta de inputs
  - Headers de seguridad con Helmet
  
- **Backups v2.0:**
  - Sistema de respaldo binario con cifrado AES-256-GCM
  - Migración a streams para manejar archivos grandes sin saturar memoria
  - Restauración ultra-estable vía `native fetch` (mejor compatibilidad Electron)
  - Carpeta `uploads/` integrada en el proceso de empaquetado

- **Logs:**
  - Sistema de logging estructurado (Pino)
  - Rotación automática de logs
  - Logs separados por tipo (error, info, http)

---

## ✨ Evolución Reciente (Serie v1.1.x)

### v1.1.2 — Estabilidad y Pulido Premium
- ✅ **Backups v2.0:** Migración a streams binarios con cifrado AES-256-GCM y restauración ultra-estable vía `native fetch`.
- ✅ **Sincronización Horaria:** Sistema de failover robusto (WorldTimeAPI + TimeAPI.io) para prevenir fraudes en asistencias.
- ✅ **Identidad Visual:** Integración de `GenderAvatar` en Scanner, Personal y Alumnos (avatares dinámicos por género).
- ✅ **Nomenclatura:** Estandarización de "Graduandos" en reportes y vistas de 6to Diversificado.

### v1.1.0 — Multimedia y Automatización
- ✅ **Webcam Nativa:** Soporte de captura de fotos en registro de Alumnos, Personal y Usuarios.
- ✅ **Justificaciones v2:** Flujo completo de ausentes justificados integrado en el panel de asistencias.
- ✅ **Auto-Updates:** Sistema de actualizaciones automáticas (OTA) integrado en Electron.
- ✅ **Instalador Moderno:** Instalación "One-Click" en `%APPDATA%` sin requerir permisos de Administrador.

---

## 📂 Arquitectura del Código

### Backend (`/backend`)
```
backend/
├── config/              # Parámetros de versión y sistema
├── middlewares/         # Seguridad, Auth y Logging
├── prisma/             
│   ├── schema.prisma    # Modelo de datos unificado
│   └── dev.db           # SQLite (Modo alto rendimiento)
├── routes/              # API Endpoints (Alumnos, Asistencias, etc)
├── services/            # Lógica de negocio (Backups, Carnets)
└── server.js            # Punto de entrada principal
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── api/             # Cliente API optimizado
│   ├── components/      # UI Components (React + Framer Motion)
│   ├── pages/           # Vistas principales y Dashboard
│   └── App.jsx          # Enrutamiento y App Shell
└── dist/                # Bundle de producción
```

---

## 🚀 Comandos Principales

### Operación
- `npm run electron` - Iniciar entorno de producción
- `npm run dev` - Modo desarrollo (Hot Reload)

### Mantenimiento
- `npm run update` - Actualizar sistema con backup automático
- `npm run rollback` - Revertir a la versión anterior estable
- `npm run admin` - Gestión de usuarios administrativos

---

## 📋 Roadmap 2026

### v1.1.2 (ESTADO ACTUAL)
- ✅ Base de código estable y documentada
- ✅ Motor de backups v2.0 funcional
- ✅ UX/UI de alta fidelidad

### v1.2.0 (Próximo Hito - Q2 2026)
- 🔄 **Búsqueda Global:** Motor de búsqueda instantánea en todo el sistema.
- 🔄 **Reportes Personalizados:** Constructor de tablas dinámicas para exportación.
- 🔄 **Temas dinámicos:** Personalización de colores institucionales.

### v2.0.0 (Visión a Largo Plazo)
- 🚀 **Multi-Sede:** Arquitectura para múltiples establecimientos con PostgreSQL.
- 🚀 **Portal Web:** Consulta de asistencias para padres de familia.
- 🚀 **App Móvil:** Notificaciones push de entradas/salidas en tiempo real.

---

## 🎯 Filosofía del Proyecto

### Principios
1. **Offline-First:** Funcionamiento garantizado sin Internet.
2. **Simple y Robusto:** Interfaz intuitiva tipo "encender y usar".
3. **Privacidad Etica:** Todos los datos pertenecen a la institución.

---

## 📞 Información del Proyecto

- **Nombre:** SAE - Sistema de Administración Educativa
- **Repositorio:** https://github.com/Hikki777/SAE-Project
- **Autor:** Kevin Pérez
- **País:** Guatemala 🇬🇹

---

**Última actualización de este documento:** 13 de Abril, 2026  
**Próxima milestone:** Mantenimiento y Mejoras v1.2.0
