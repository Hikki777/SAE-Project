# SAE - Sistema de Administración Educativa

![Version](https://img.shields.io/badge/version-0.9.0--beta-orange.svg) ![Electron](https://img.shields.io/badge/Electron-v39-9FEAF9.svg) ![React](https://img.shields.io/badge/React-18-61DAFB.svg) ![Node](https://img.shields.io/badge/Node-18%2B-339933.svg) ![Status](https://img.shields.io/badge/Status-Beta-yellow.svg) ![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)

**Gestión Educativa Libre** para instituciones de Guatemala

> **⚠️ VERSIÓN BETA**: Este proyecto está en desarrollo activo. Pueden existir errores y funcionalidades incompletas. Se recomienda usar en entornos de prueba.

---

## ✨ Características Principales

- **📱 Control de Asistencia QR:** Registro rápido de entrada/salida para alumnos y personal con detección de retardos
- **👥 Gestión Académica:** Expedientes digitales completos, generación de carnets y roles de usuario
- **📊 Dashboard Interactivo:** Métricas en tiempo real sobre asistencia, puntualidad y ausentismo
- **📝 Justificaciones:** Módulo nativo para gestionar excusas y permisos (médicos, familiares)
- **🔒 Seguridad:** Roles de acceso (Admin/Operador), backups cifrados, rate limiting y validaciones
- **🚀 Rendimiento:** Code splitting, compresión gzip, caché en memoria
- **🖥️ Aplicación de Escritorio:** Experiencia nativa con Electron para Windows

---

## 🛠️ Requisitos Previos

- **Node.js:** v18.0.0 o superior
- **Git:** Para control de versiones
- **Sistema Operativo:** Windows 10/11 (Recomendado), macOS o Linux

---

## 📦 Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Hikki777/SAE-Project.git
    cd SAE-Project
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    cd frontend
    npm install
    cd ..
    ```

3.  **Configuración Inicial:**
    - El sistema incluye un **Setup Wizard** que se ejecutará la primera vez
    - No es necesario configurar manualmente el `.env` para desarrollo local (SQLite)

---

## ▶️ Uso y Comandos

### Iniciar Desarrollo
Para levantar backend y frontend simultáneamente:
```bash
npm run dev
```

### Iniciar Aplicación de Escritorio
Para abrir la versión Electron:
```bash
npm run electron
```

### Build de Producción
```bash
npm run build:frontend
```

---

## 📂 Estructura de Carpetas

- `/backend`: Servidor API (Express), Base de Datos (Prisma + SQLite) y Lógica
- `/frontend`: Interfaz de Usuario (React + Vite + TailwindCSS)
- `/electron`: Configuraciones de la app de escritorio
- `/scripts`: Herramientas de automatización
- `/backups`: Almacenamiento local de respaldos (No se sube a Git)
- `/uploads`: Archivos multimedia de usuarios (No se sube a Git)

---

## 🔐 Seguridad

- ✅ Dependencias actualizadas (0 vulnerabilidades)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Rate limiting por tipo de endpoint
- ✅ Validación de email y contraseñas
- ✅ Compresión gzip para respuestas

---

## 🚀 Rendimiento

- ✅ Build de producción optimizado
- ✅ Code splitting estratégico
- ✅ Caché en memoria para datos institucionales
- ✅ Paginación en endpoints críticos

---

## 🤝 Contribución

1.  Hacer Fork del repositorio
2.  Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3.  Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4.  Push a la rama (`git push origin feature/AmazingFeature`)
5.  Abrir un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia GPL v3.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Kevin Pérez**  
SAE Project - Sistema de Administración Educativa  
Guatemala 🇬🇹

---

## 📝 Notas de la Versión 0.9.0-beta

### ⚠️ Estado Beta
Esta es una versión beta en desarrollo activo. Se están corrigiendo errores y mejorando funcionalidades.

### Características Implementadas
- ✅ Sistema completo de asistencias con códigos QR
- ✅ Gestión de expedientes académicos
- ✅ Dashboard con métricas en tiempo real
- ✅ Módulo de justificaciones y permisos
- ✅ Backups cifrados con integridad verificada
- ✅ Aplicación de escritorio con Electron
- ✅ Optimizado para hardware básico (4GB RAM)
- ✅ Funcionamiento 100% local (sin internet)

### 🔧 Problemas Conocidos
- Algunos errores menores en la interfaz de usuario
- Validaciones pendientes de optimización
- Documentación en proceso de mejora

### 🚀 Próximas Mejoras (v1.0.0)
- Corrección de bugs reportados
- Optimización de rendimiento
- Mejoras en la experiencia de usuario
- Documentación completa
