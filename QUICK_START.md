# ⚡ QUICK START - SAE v1.1.2

---

## 🆕 SETUP DESDE CERO (Nuevo PC / Clonar Repo)

> Si ya tienes el repo clonado y solo quieres iniciar, ve a la sección **1️⃣**.

### Prerrequisitos obligatorios

Instala estos programas **antes** de clonar el repositorio:

| Herramienta | Versión mínima | Enlace |
|-------------|---------------|--------|
| **Node.js** | 18.x o superior | https://nodejs.org/en/download |
| **Git** | Cualquier versión reciente | https://git-scm.com/downloads |

> ⚠️ Durante la instalación de Node.js, asegúrate de que la opción **"Add to PATH"** está marcada. Reinicia la terminal después de instalar.

### Verificar prerrequisitos

```bash
node --version   # Debe mostrar v18.x.x o superior
npm --version    # Debe mostrar 9.x o superior
git --version    # Cualquier versión
```

---

### Pasos para clonar y configurar

```bash
# 1. Clonar el repositorio
git clone https://github.com/Hikki777/SAE-Project.git
cd SAE-Project

# 2. Instalar dependencias del proyecto raíz (Electron + Backend)
npm install

# 3. Instalar dependencias del frontend
cd frontend
npm install
cd ..

# 4. Generar el cliente de Prisma (base de datos)
npm run prisma:generate

# 5. Iniciar la aplicación
npm run electron
```

> 💡 La primera vez que se inicia, aparecerá el **Asistente de Configuración** para ingresar datos de la institución.

---

### ❌ Errores comunes al clonar

#### "Cannot find module 'prisma'"
```bash
npm run prisma:generate
# Si sigue fallando:
npx prisma generate
```

#### "Error: Cannot find module '../frontend/dist'"
El frontend no está construido. En modo desarrollo esto es normal, usa `npm run electron` que compila automáticamente.

#### "node_modules not found" o errores de import
```bash
# Desde la raíz del proyecto:
npm install
cd frontend && npm install && cd ..
```

#### "Port 5000 already in use"
```bash
# Windows PowerShell:
netstat -ano | findstr :5000
# Anotar el PID que aparece y matar ese proceso:
taskkill /F /PID <PID_AQUI>
# Luego reintenta:
npm run electron
```

#### "Prisma Client is not generated"
```bash
npx prisma generate
```

---

## 1️⃣ Iniciar (repo ya configurado)

```bash
npm run electron
```

**Listo. Se abrirá la aplicación Electron con todo funcionando.**

---

## 2️⃣ Verificar que funciona

### Opción A: Visual (Recomendado)
```
✓ Ventana de Electron se abre
✓ Se muestra la interfaz de la aplicación
✓ No hay errores rojos en DevTools (F12)
```

### Opción B: Terminal
```bash
# En otra terminal:
curl http://localhost:5000/api/health

# Esperado:
# {"status":"ok","timestamp":"...","uptime":...}
```

---

## 3️⃣ Troubleshooting Rápido

### "Dice que backend no responde"
```bash
# Matar todos los node processes
taskkill /F /IM node.exe

# Reintentar
npm run electron
```

### "Electron se abre vacío"
```bash
# Presionar F12 para abrir DevTools
# Ver pestaña Console, buscar errores rojos
taskkill /F /IM node.exe
npm run electron
```

### "Errores de CORS"
```
En Console: "Access to XMLHttpRequest blocked by CORS..."
Solución: El backend no se inició correctamente
→ Revisar logs del backend en la terminal
```

---

## 4️⃣ Estructura de Procesos

```
npm run electron
├─ Backend (puerto dinámico en producción, 5000 en dev)
│  └─ Base de datos: %APPDATA%\SAE\sae.db (producción)
│  └─                ./prisma/dev.db     (desarrollo)
│  ├─ API: http://localhost:[PUERTO]/api
│  └─ Logs: AppData/SAE/logs/backend.log
│
├─ Frontend Vite (puerto 5173)
│  └─ Interfaz React
│  └─ URL: http://localhost:5173
│
└─ Electron
   └─ Carga: http://localhost:5173
   └─ Conecta a: http://localhost:5000/api
   └─ DevTools: Presionar F12
```

---

## 5️⃣ Comandos Útiles

```bash
# Iniciar Electron (con todo)
npm run electron

# Iniciar solo backend
npm run dev:backend

# Iniciar solo frontend
cd frontend && npm run dev

# Empaquetar (Windows Installer)
npm run dist:win

# Prisma Studio (explorar base de datos)
npm run prisma:studio

# Reset base de datos de desarrollo
npm run db:reset

# Generar cliente Prisma (después de cambios en schema)
npm run prisma:generate
```

---

## 6️⃣ URLs Importantes

| Componente | URL / Ruta | Propósito |
| :--- | :--- | :--- |
| Backend | http://localhost:[PORT] | API REST (Dinámico) |
| API Health | http://localhost:[PORT]/api/health | Verificar backend |
| Documentación| /api-docs | Swagger UI (Dev) |
| Uploads | /api/uploads | Archivos estáticos |
| Electron | `file://` | Aplicación de escritorio |

---

## 7️⃣ Logs Importantes

### Backend OK ✓
```
✓ Base de datos conectada correctamente
✓ Socket.IO server running on port 5000
✓ GET /api/health - 200
```

### Frontend OK ✓
```
VITE v6.x.x  ready in xxxx ms
➜  Local:   http://localhost:5173/
```

### Electron OK ✓
```
[Electron] Backend listo!
[Electron] Frontend listo!
[Electron] Ventana creada exitosamente
```

---

## 8️⃣ Debugging en DevTools

**Abrir**: Presionar `F12` en ventana de Electron

**Ver**:
- **Console**: Errores y logs
- **Network**: Requests a API
- **Application**: localStorage, IndexedDB

**Errores comunes**:
- `"Cannot GET /api/..."` → Backend no está corriendo
- `"CORS error"` → Backend rechazó la request
- `"404 Not Found"` → Ruta no existe

---

## ✅ Checklist Mínimo

- [ ] `node --version` muestra v18+
- [ ] `npm install` en raíz completó sin errores
- [ ] `cd frontend && npm install` completó sin errores
- [ ] `npm run prisma:generate` completó sin errores
- [ ] `npm run electron` se ejecuta
- [ ] Ventana de Electron se abre en 5-10 segundos
- [ ] `curl http://localhost:5000/api/health` retorna JSON

Si todos están ✓: **Listo para usar**

---

**Última actualización**: 13 de Abril de 2026  
**Versión**: 1.1.2
