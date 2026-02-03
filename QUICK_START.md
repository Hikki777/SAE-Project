# ⚡ QUICK START - Electron y API

## 1️⃣ Iniciar en 30 segundos

```bash
cd "c:\Users\Kevin\Documents\Proyectos\Sistema de Administración Educativa"
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

# Esperar 2 segundos
# Reintentar
npm run electron
```

### "Electron se abre vacío"
```bash
# Presionar F12 para abrir DevTools
# Ver pestañas: Console, Network
# Buscar errores rojos

# Solución más probable: Limpiar puertos
taskkill /F /IM node.exe
npm run electron
```

### "Errores de CORS"
```
En Console verás: "Access to XMLHttpRequest blocked by CORS..."

Solución: El backend no se iniciò correctamente
→ Revisar logs del backend (arriba en terminal)
→ Verificar que los 3 procesos (Backend, Vite, Electron) se iniciaron
```

---

## 4️⃣ Estructura de Procesos

```
npm run electron
├─ Backend (puerto 5000)
│  └─ Base de datos: ./prisma/dev.db
│  └─ API: http://localhost:5000/api
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

## 5️⃣ Archivos Clave

| Archivo | Propósito | Cambio |
|---------|-----------|--------|
| `.env` | Variables base de datos | ✏️ dev.db |
| `frontend/.env.development` | Variables frontend | ✨ NUEVO |
| `frontend/src/api/client.js` | Cliente HTTP | ✏️ Centralizado |
| `backend/server.js` | CORS | ✏️ Mejorado |
| `scripts/start-electron-simple.js` | Script startup | ✨ NUEVO |

---

## 6️⃣ Comandos Útiles

```bash
# Iniciar Electron (con todo)
npm run electron

# Iniciar solo backend
npm run dev:backend

# Iniciar solo frontend
cd frontend && npm run dev

# Empaquetar (Windows)
npm run dist:win

# Empaquetar (debug)
npm run dist:debug

# Prisma Studio (ver base de datos)
npm run prisma:studio

# Reset base de datos
npm run db:reset
```

---

## 7️⃣ URLs Importantes

| Servicio | URL | Propósito |
|----------|-----|----------|
| Backend | http://localhost:5000 | API REST |
| API Health | http://localhost:5000/api/health | Verificar backend |
| Frontend | http://localhost:5173 | Interfaz Vite |
| Electron | file:// | Aplicación de escritorio |
| Uploads | http://localhost:5000/uploads | Archivos estáticos |

---

## 8️⃣ Logs Importantes

### Backend OK ✓
```
✓ Base de datos conectada correctamente
✓ Socket.IO server running on port 5000
✓ GET /api/health - 200
```

### Frontend OK ✓
```
VITE v7.3.0  ready in xxxx ms
➜  Local:   http://localhost:5173/
```

### Electron OK ✓
```
[Electron] Backend listo!
[Electron] Frontend listo!
[Electron] Ventana creada exitosamente
```

---

## 9️⃣ Debugging en DevTools

**Abrir**: Presionar `F12` en ventana de Electron

**Ver**:
- **Console**: Errores y logs
- **Network**: Requests a API
- **Application**: localStorage, IndexedDB
- **Sources**: Código del frontend

**Common errors**:
- `"Cannot GET /api/..."` → Backend no está corriendo
- `"CORS error"` → Backend rechazó la request
- `"404 Not Found"` → Ruta no existe
- `"Unexpected token <"` → HTML en lugar de JSON

---

## 🔟 Si algo sigue fallando

1. **Verificar que nada esté corriendo en puertos 5000 y 5173**
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```

2. **Limpiar caché**
   ```bash
   rm -r frontend/node_modules/.vite
   rm -r frontend/dist
   ```

3. **Reinstalar dependencias**
   ```bash
   npm install
   cd frontend && npm install
   ```

4. **Revisar documentación completa**
   - ANALISIS_COMPLETO_COMPLETADO.md
   - GUIA_VERIFICACION.md
   - CORRECCIONES_ELECTRON_API.md

---

## ✅ Checklist Mínimo

- [ ] `npm run electron` se ejecuta sin errores
- [ ] Ventana de Electron se abre en 5-10 segundos
- [ ] Se ve la interfaz de la aplicación
- [ ] Presionar F12 no muestra errores rojos
- [ ] `curl http://localhost:5000/api/health` retorna JSON

Si todos están ✓: **Listo para usar**

---

**Última actualización**: 29 de Enero de 2026  
**Versión**: 1.0.2

