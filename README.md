# SAE - Sistema de Administración Educativa

![Version](https://img.shields.io/badge/version-1.1.8-brightgreen.svg) ![Electron](https://img.shields.io/badge/Electron-v35-9FEAF9.svg) ![React](https://img.shields.io/badge/React-19-61DAFB.svg) ![Node](https://img.shields.io/badge/Node-18%2B-339933.svg) ![Status](https://img.shields.io/badge/Status-Stable-brightgreen.svg) ![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)

**Gestión Educativa Libre** para instituciones de Guatemala

> **✅ VERSIÓN 1.1.8 ESTABLE**: Sincronización en tiempo real celular-PC, lector QR móvil con cámara sobre HTTPS local/certificado SSL, sonidos acordes idénticos a PC y exportación de Reportes PDF y Excel nativos en móvil.

---

## ✨ Características Principales

- **📱 Control de Asistencia QR:** Registro rápido de entrada/salida para alumnos y personal con detección de retardos
- **👥 Gestión Académica:** Expedientes digitales completos, generación de carnets y control de historial
- **🔄 Migración de Ciclo:** Automatización de promociones y graduaciones de fin de año con pre-visualización interactiva y segura
- **📊 Dashboard Interactivo:** Métricas en tiempo real sobre asistencia, puntualidad y ausentismo
- **📝 Justificaciones:** Módulo nativo para gestionar excusas y permisos (médicos, familiares)
- **🔒 Seguridad:** Roles de acceso (Admin/Operador), backups cifrados, rate limiting y validaciones
- **🚀 Rendimiento:** Code splitting, compresión gzip, caché en memoria
- **🖥️ Aplicación de Escritorio:** Experiencia nativa con Electron para Windows

---

## 🛠️ Requisitos para Desarrollo

- **Node.js:** v18.0.0 o superior
- **Git:** Para control de versiones
- **Sistema Operativo:** Windows 10/11 24H2+ (Recomendado), macOS o Linux
- **CPU:** Intel Core I5 2400+ / AMD Ryzen 5 2400G+
- **RAM:** 4 GB+
- **HDD/SSD:** 2 GB+

---

## 📋 Requisitos para Usuario Final

- **Sistema Operativo:** Windows 10 24H2 (64-bit) o superior
- **HDD/SSD:** 1 GB+ de espacio libre en disco
- **RAM:** 4 GB+ de RAM
- **CPU:** Intel Core I5 2400+ / AMD Ryzen 5 2400G+

---

## 📦 Instalación

### Para Usuarios Finales (Recomendado)

1. **Descargar instalador:**
   - Ir a [Releases en GitHub](https://github.com/Hikki777/SAE-Project/releases)
   - Descargar la última versión `SAE-1.1.8-Setup.exe`

2. **Ejecutar instalador:**
   - Doble click en el archivo descargado
   - Seguir instrucciones del asistente
   - Al finalizar, el sistema se abrirá automáticamente

3. **Configuración Inicial:**
   - El **Setup Wizard** se ejecutará la primera vez
   - Configurar datos de la institución
   - Crear usuario administrador
   - ¡Listo para usar!

### Para Desarrolladores

Si deseas contribuir al código o compilar el proyecto tú mismo, sigue estas instrucciones completas para clonar el repositorio:

#### 1. Requisitos Previos
Debes tener instalado:
- **Git** ([Descargar](https://git-scm.com/downloads))
- **Node.js 18.x o superior** ([Descargar](https://nodejs.org/en/download)). Asegúrate de marcar "Add to PATH" durante la instalación.

#### 2. Clonar y Configurar Dependencias
Abre tu terminal (PowerShell, CMD, Bash) y ejecuta los siguientes comandos en orden:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Hikki777/SAE-Project.git

# 2. Entrar a la carpeta generada
cd SAE-Project

# 3. Instalar las dependencias del servidor e instalador (raíz)
npm install

# 4. Entrar a la carpeta del frontend, instalar sus dependencias y volver a la raíz
cd frontend
npm install
cd ..

# 5. Generar el cliente de Prisma (necesario para la base de datos local embebida)
npx prisma generate
```

#### 3. Levantar Entorno de Desarrollo
Para arrancar tanto el frontend interactivo con Vite como el backend con Socket y base de datos:
```bash
npm run dev
```
*(Si deseas iniciar la versión de escritorio basada en Electron, usa `npm run electron`).*

---

## ▶️ Uso y Comandos

### Iniciar Desarrollo
Para levantar backend y frontend simultáneamente:
```bash
npm run dev
```

### Iniciar Aplicación de Escritorio
Para abrir la versión Electron:

**Windows**
Opción 1 (Sin ventanas - Recomendado):
1. Hacer doble clic en `start-sae.vbs`

Opción 2 (Desde terminal):
```bash
npm run electron
```

### Distribución y Lanzamiento (Generar Instalador)
Para generar el instalador de Windows (`.exe`) y subirlo automáticamente a GitHub:
```bash
npm run dist:publish
```
*Nota: Este comando generará el ejecutable y lo publicará en los Releases de GitHub con todos los metadatos necesarios (latest.yml) para que las actualizaciones automáticas funcionen correctamente.*

**Linux / macOS**
```bash
npm run electron:silent
```

*Nota: Para detener la aplicación, simplemente cierra la ventana de Electron o presiona `Ctrl+C` en la terminal, si la dejaste abierta.*

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

1. Hacer Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia GPL v3.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Kevin Pérez**  
SAE Project - Sistema de Administración Educativa  
Guatemala 🇬🇹

---

## 📝 Notas de la Versión 1.1.8

### 📱 Lector QR Móvil y HTTPS Local Autónomo
- ✅ **Sincronización en Tiempo Real Robustecida**: Al escanear una asistencia en el celular, el backend ahora emite de forma centralizada la actualización por WebSockets. Esto garantiza que la PC muestre la información al instante, incluso si el celular pierde conectividad temporal del socket.
- ✅ **Soporte de Cámara sin Servidores Externos (HTTPS)**: Implementación de la generación automática de certificados SSL locales. Se añade un nuevo panel explicativo con enlace de descarga directa del certificado (`/api/certs/download`) para instalar en Android, iOS o habilitar flags en Chrome sin configuraciones complejas en la red.
- ✅ **Lógica de Sonidos de Alta Fidelidad**: Remodelación acústica en `mobile-scanner.html` con reproducción de acordes (Do-Mi-Sol ascendente para éxitos, tonos graves descendentes para fallos y doble ping para duplicados/advertencias) idénticos al sistema de escritorio.
- ✅ **Reportes Premium en Móvil**: Integración nativa de generación y descarga de reportes diarios en formato PDF (utilizando la ventana de impresión nativa optimizada) y Excel (.xlsx usando SheetJS) en lugar de la anterior descarga simple en CSV.

Esta versión consolida los hotfixes previos en una base de código robusta, optimizada para entornos Windows con instalación de un solo clic y gestión automática de directorios en `%APPDATA%`.
