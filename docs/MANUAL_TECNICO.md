# 📘 Manual Técnico - SAE Sistema de Administración Educativa

**Versión:** 1.0.0  
**Fecha:** 24 de Enero, 2026  
**Stack:** Electron + React + Node.js + SQLite  
**Licencia:** GPL v3.0

Este documento describe la arquitectura, instalación y mantenimiento del sistema para personal de TI.

---

## 1. 🏗️ Arquitectura del Sistema

SAE es una **aplicación de escritorio** construida con Electron que funciona completamente offline.

### Componentes Principales

#### 1.1 Backend (Node.js + Express)
- **Puerto:** `5000` (configurable)
- API RESTful para lógica de negocio
- Autenticación JWT
- Sistema de archivos y backups
- WebSocket para sincronización en tiempo real

#### 1.2 Frontend (React 18 + Vite + TailwindCSS)
- **Puerto desarrollo:** `5173`
- Interfaz de usuario moderna y responsive
- Comunicación con backend vía Axios
- Gestión de estado con React hooks
- Dark mode integrado

#### 1.3 Base de Datos (SQLite)
- **Ubicación:** `prisma/dev.db`
- **Modo:** WAL (Write-Ahead Logging) para alto rendimiento
- **ORM:** Prisma para type-safe queries
- **Ventajas:** Sin instalación, portable, backup simple

#### 1.4 Electron Wrapper
- **Versión:** 39.x
- Gestiona los procesos de Node y ventana del navegador
- Integración con sistema operativo
- Auto-actualización integrada (v1.0+)

---

## 2. ⚙️ Requisitos del Sistema

### Requisitos mínimos
- **Sistema Operativo:** Windows 10/11 (64-bit)
- **RAM:** 4GB
- **Espacio en Disco:** 500MB para app + 2GB para datos
- **Procesador:** Dual-core 1.8GHz o superior

### Requisitos recomendados
- **RAM:** 8GB o más
- **Espacio:** 10GB o más (para crecimiento de base de datos)

### Para desarrollo
- **Node.js:** v18.17.0 o superior
- **Git:** Para control de versiones
- **Editor:** VSCode recomendado

---

## 3. 🚀 Instalación

### Para Usuarios Finales (Recomendado)

1. **Descargar instalador**
   - Ir a [Releases en GitHub](https://github.com/Hikki777/SAE-Project/releases)
   - Descargar `SAE-Setup-1.0.0.exe`

2. **Ejecutar instalador**
   - Doble click en el archivo `.exe`
   - Seguir instrucciones del asistente
   - Elegir carpeta de instalación

3. **Primera ejecución**
   - Se abrirá automáticamente el Setup Wizard
   - Configurar datos de la institución
   - Crear usuario administrador
   - ¡Listo!

### Para Desarrolladores

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/Hikki777/SAE-Project.git
   cd SAE-Project
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. **Iniciar en modo desarrollo**
   ```bash
   npm run dev
   ```
   
   Esto inicia backend y frontend simultáneamente.

4. **Iniciar solo Electron**
   ```bash
   npm run electron
   ```

---

## 4. 🛠️ Comandos Disponibles

### Ejecución
| Comando | Descripción |
|---------|-------------|
| `npm run electron` | Inicia app de escritorio (producción) |
| `npm run dev` | Modo desarrollo (backend + frontend con hot reload) |
| `npm start` | Inicia solo el backend en modo producción |

### Desarrollo
| Comando | Descripción |
|---------|-------------|
| `npm run dev:backend` | Solo backend con auto-reinicio |
| `npm run dev:frontend` | Solo frontend en puerto 5173 |
| `npm run build:frontend` | Build de producción del frontend |

### Base de Datos
| Comando | Descripción |
|---------|-------------|
| `npm run prisma:studio` | Abre Prisma Studio (GUI para BD) |
| `npm run db:reset` | Reinicia base de datos (⚠️ borra datos) |
| `npm run seed` | Llena BD con datos de prueba |

### Testing
| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecuta todas las pruebas |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:integration` | Solo tests de integración |

### Utilidades
| Comando | Descripción |
|---------|-------------|
| `npm run admin` | Crea nuevo usuario administrador |
| `npm run utils` | Menú interactivo de utilidades |
| `npm run update` | Actualiza sistema (backup automático) |
| `npm run rollback` | Restaura versión anterior |
| `npm run validate:all` | Valida código (linting + emojis) |

### Build y Distribución
| Comando | Descripción |
|---------|-------------|
| `npm run dist:win` | Crea instalador Windows |
| `npm run dist:linux` | Crea AppImage para Linux |
| `npm run dist:mac` | Crea .dmg para macOS |

---

## 5. 📂 Estructura del Proyecto

```
SAE-Project/
├── backend/                    # API Server
│   ├── config/                 # Configuración del sistema
│   ├── middlewares/            # Autenticación, validación, etc
│   ├── prisma/                 # Esquema de BD y migraciones
│   │   └── dev.db              # SQLite database
│   ├── routes/                 # Endpoints de la API
│   ├── services/               # Lógica de negocio
│   └── server.js               # Entry point
│
├── frontend/                   # React Application
│   ├── public/                 # Assets estáticos
│   ├── src/
│   │   ├── api/                # Cliente API (axios)
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas (Login, Dashboard)
│   │   ├── utils/              # Utilidades
│   │   └── App.jsx             # Componente raíz
│   └── dist/                   # Build de producción
│
├── electron/                   # Electron main process
│   └── main.cjs                # Configuración ventana
│
├── scripts/                    # CLI tools
│   ├── start-electron.js       # Launcher de Electron
│   ├── update-system.js        # Sistema de actualización
│   ├── rollback-version.js     # Rollback de versiones
│   └── crear-admin.js          # Crear usuarios admin
│
├── docs/                       # Documentación
│   ├── MANUAL_USUARIO.md       # Guía para usuarios
│   ├── MANUAL_TECNICO.md       # Este documento
│   ├── ESTADO_DEL_PROYECTO.md  # Roadmap y status
│   └── CHANGELOG.md            # Historial de cambios
│
├── uploads/                    # Archivos de usuarios (NO en git)
│   ├── alumnos/                # Fotos de alumnos
│   ├── personal/               # Fotos de personal
│   ├── carnets/                # Carnets generados
│   └── qrs/                    # Códigos QR generados
│
├── backups/                    # Respaldos automáticos (NO en git)
├── logs/                       # Logs del sistema (NO en git)
├── package.json                # Dependencias y scripts
└── README.md                   # Documentación principal
```

---

## 6. 🔒 Seguridad y Backups

### Características de Seguridad
- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ JWT para autenticación (tokens con expiración)
- ✅ Rate limiting en endpoints críticos
- ✅ Validación de inputs con express-validator
- ✅ Headers de seguridad con Helmet
- ✅ Sanitización de datos contra XSS

### Sistema de Backups

#### Backups Automáticos
El comando `npm run update` crea automáticamente un backup antes de actualizar.

#### Backups Manuales
Los archivos importantes están en:
- `prisma/dev.db` - Base de datos principal
- `uploads/` - Fotos y documentos

**Recomendación:** Copiar estas carpetas regularmente a un disco externo o nube.

#### Restauración
```bash
# Via script automatizado
npm run rollback

# Manual
# 1. Restaurar dev.db desde backup
# 2. Restaurar carpeta uploads/
# 3. Reiniciar aplicación
```

---

## 7. 🔄 Sistema de Actualización

### Actualización Automática (v1.0+)
La aplicación verifica actualizaciones al iniciar. Si encuentra una nueva versión:
1. Muestra notificación al usuario
2. Descarga en segundo plano
3. Solicita reinicio para instalar
4. Mantiene datos intactos

### Actualización Manual
```bash
# Desde el código fuente
git pull origin main
npm install
cd frontend && npm install && cd ..
npm run electron
```

### Rollback (Deshacer Actualización)
```bash
npm run rollback
# Sigue el menú interactivo
```

---

## 8. 🐛 Solución de Problemas

### Error: "Database is locked"
**Causa:** SQLite está en uso por otro proceso  
**Solución:** Esperar unos segundos o reiniciar la aplicación

### Error: "EADDRINUSE" (Puerto ocupado)
**Causa:** Puerto 5000 o 5173 ya está en uso  
**Solución:** El script `start-dynamic.js` intenta liberar puertos automáticamente. Si persiste, cerrar procesos Node en el Administrador de Tareas.

### Interfaz en blanco al iniciar
**Causa:** Frontend no se built correctamente  
**Solución:** 
```bash
npm run build:frontend
npm run electron
```

### Error al escanear QR
**Causa:** Cámara no detectada o sin permisos  
**Solución:** 
1. Verificar que la cámara funcione en otra app
2. Windows: Configuración → Privacidad → Cámara → Permitir acceso

### Base de datos corrupta
**Causa:** Cierre abrupto de la aplicación  
**Solución:**
```bash
# Restaurar desde backup
npm run rollback

# O reiniciar base de datos (⚠️ pierde datos)
npm run db:reset
```

### No aparecen las fotos
**Causa:** Permisos de carpeta o archivo no encontrado  
**Solución:** Verificar que `uploads/` tenga permisos de lectura/escritura

---

## 9. 📊 Monitoreo y Logs

### Ubicación de Logs
Los logs se guardan en `logs/`:
- `combined.log` - Todos los eventos
- `error.log` - Solo errores
- `http.log` - Peticiones HTTP

### Logs de terminal
En modo desarrollo (`npm run dev`) todos los logs aparecen en consola con colores.

### Análisis de logs
```bash
# Ver últimos 50 errores
cat logs/error.log | tail -n 50

# Buscar palabra específica
grep "usuario" logs/combined.log
```

---

## 10. 🚀 Despliegue en Producción

### Build del Instalador Windows
```bash
npm run dist:win
```

Esto genera en `release/`:
- `SAE-Setup-1.0.0.exe` - Instalador

### Publicar Release en GitHub
1. Crear nuevo release en GitHub
2. Tag: `v1.0.0`
3. Subir el archivo `.exe`
4. Publicar

Los usuarios con v1.0+ recibirán notificación automática.

---

## 11. 📞 Soporte

### Reportar Bugs
1. Recopilar logs de `logs/error.log`
2. Abrir issue en GitHub: https://github.com/Hikki777/SAE-Project/issues
3. Incluir:
   - Versión del sistema
   - Pasos para reproducir
   - Logs relevantes

### Contacto
- **Proyecto:** SAE - Sistema de Administración Educativa
- **Autor:** Kevin Pérez
- **País:** Guatemala 🇬🇹
- **Licencia:** GPL v3.0

---

**Última actualización:** 24 de Enero, 2026  
**Versión del documento:** 1.0.0
