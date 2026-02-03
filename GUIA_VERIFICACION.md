# ✅ GUÍA DE VERIFICACIÓN - Funcionamiento de Electron y API

**Objetivo**: Verificar que todas las correcciones funcionan correctamente

---

## 1️⃣ VERIFICACIÓN RÁPIDA (5 minutos)

### Paso 1: Iniciar el proyecto
```bash
cd "c:\Users\Kevin\Documents\Proyectos\Sistema de Administración Educativa"
npm run electron
```

**Esperado:**
```
============================================================
  [ELECTRON] Iniciando aplicación Electron
============================================================

[1/4] Iniciando backend...
[2/4] Esperando backend...
[ELECTRON] Backend listo!
[3/4] Iniciando frontend...
[ELECTRON] Frontend listo!
[4/4] Iniciando Electron...
```

**Resultado**: Se abre ventana de Electron mostrando la aplicación

---

## 2️⃣ VERIFICACIÓN DE COMPONENTES

### A. Backend ✓

**Puerto**: 5000  
**Verificar**:
```bash
curl http://localhost:5000/api/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T19:32:30.000Z",
  "uptime": 2.456
}
```

**En logs debe ver**:
```
✓ Variables de entorno verificadas
✓ Base de datos conectada correctamente
✓ Socket.IO server running on port 5000
```

---

### B. Frontend ✓

**Puerto**: 5173  
**Verificar**:
```bash
curl http://localhost:5173/
```

**Respuesta**: HTML válido (no 404)

**En logs debe ver**:
```
VITE v7.3.0  ready in xxxx ms
  ➜  Local:   http://localhost:5173/
```

---

### C. Electron ✓

**Verificar**: Se abre ventana con la aplicación

**DevTools** (F12):
- Console: Sin errores de CORS
- Network: Requests a `/api/*` funcionan (status 200)
- Application > localStorage: Contiene `token` y `user`

---

## 3️⃣ VERIFICACIÓN DE API

### Test 1: Health Check
```bash
curl -X GET http://localhost:5000/api/health
```
**Esperado**: 200 ✓

### Test 2: CORS desde Electron
En DevTools de Electron, Console:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```
**Esperado**: Respuesta JSON sin errores CORS ✓

### Test 3: Login (si es necesario)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin"}'
```
**Esperado**: 200 con token ✓

---

## 4️⃣ VERIFICACIÓN DE VARIABLES DE ENTORNO

### Archivo `.env` (raíz)
```bash
grep -E "DATABASE_URL|JWT_SECRET|HMAC_SECRET|PORT" .env
```

**Esperado**:
```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=mi_secreto_jwt_super_seguro_2025
HMAC_SECRET=mi_secreto_hmac_super_seguro_2025
PORT=5000
```

### Archivo `frontend/.env.development`
```bash
cat frontend/.env.development
```

**Esperado**:
```
VITE_API_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

---

## 5️⃣ VERIFICACIÓN DE LOGS

### Backend
```
[OK] Variables de entorno verificadas
[OK] Base de datos conectada correctamente
[SYSTEM] Sistema iniciado correctamente
[API] Health: http://localhost:5000/api/health
[OK] GET /api/health - 200
```

### Frontend Vite
```
VITE v7.3.0  ready in xxxx ms
  ➜  Local:   http://localhost:5173/
```

### Electron
```
[Electron] INICIANDO APLICACIÓN
[Electron] Esperando a que el backend esté listo...
[Electron] Backend está listo!
[Electron] Esperando a que el frontend esté listo...
[Electron] Frontend listo!
[Electron] Ventana creada exitosamente
```

---

## 6️⃣ VERIFICACIÓN DE PUERTOS

```bash
# Verificar que los puertos estén en uso
netstat -ano | findstr ":5000"    # Backend
netstat -ano | findstr ":5173"    # Frontend

# En PowerShell:
Get-NetTCPConnection -LocalPort 5000, 5173 | Select-Object -Property LocalPort, State, OwningProcess
```

**Esperado**: 3 procesos node

---

## 7️⃣ VERIFICACIÓN DE BASE DE DATOS

```bash
# Verificar que dev.db existe
ls -la prisma/dev.db

# Verificar que Prisma está conectado correctamente
# (Buscar en logs: "[OK] Base de datos conectada correctamente")
```

**Esperado**: Archivo `prisma/dev.db` existe con tamaño > 0

---

## 8️⃣ VERIFICACIÓN DE CLIENTE API

En DevTools de Electron > Application > Console:

```javascript
// Verificar que VITE_API_URL está configurado
console.log('API Base:', import.meta.env.VITE_API_URL)

// Debe mostrar: http://localhost:5000/api
```

---

## ⚠️ TROUBLESHOOTING

### Problema: "Backend no respondió"
```bash
# Verificar que backend está corriendo
curl http://localhost:5000/api/health

# Si falla, revisar logs del backend
# Buscar errores en los primeros 50 líneas
npm run dev:backend 2>&1 | head -50
```

### Problema: "Frontend no cargó"
```bash
# Verificar que Vite está corriendo
curl http://localhost:5173/

# Si falla, verificar puerto 5173
netstat -ano | findstr :5173

# Reiniciar frontend
cd frontend && npm run dev
```

### Problema: "Electron no muestra la app"
```bash
# Verificar que los dos puntos anteriores funcionan
# Luego abrir DevTools en Electron (F12)
# Buscar errores en Console tab

# Si hay error CORS, verificar backend/server.js CORS config
grep -A 20 "allowedOrigins" backend/server.js
```

### Problema: "Conexión rechazada"
```bash
# Limpiar puertos
Get-Process -Name "node*" | Stop-Process -Force
Start-Sleep -Seconds 2

# Reiniciar
npm run electron
```

---

## 9️⃣ CHECKLIST FINAL

- [ ] Backend inicia en puerto 5000
- [ ] Frontend Vite inicia en puerto 5173  
- [ ] Electron muestra ventana con la aplicación
- [ ] `GET /api/health` retorna 200
- [ ] No hay errores de CORS en DevTools
- [ ] Variables de entorno están configuradas
- [ ] Base de datos `dev.db` se conecta
- [ ] Socket.IO se inicializa correctamente
- [ ] Login funciona (si existe)
- [ ] API calls desde Electron funcionan

---

## 🎯 PRÓXIMAS ACCIONES

1. Si todo está ✓: **Proyecto listo para desarrollo**
2. Si algo falla: Revisar los archivos de documentación:
   - `ANALISIS_PROBLEMAS_ELECTRON.md`
   - `CORRECCIONES_ELECTRON_API.md`
   - `RESUMEN_EJECUTIVO_CORRECCIONES.md`

---

**Generado**: 29 de Enero de 2026  
**Versión**: 1.0.2

