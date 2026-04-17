# Migraciones Automáticas en Producción

## ¿Cómo Funciona?

En Electron (producción instalada), **las migraciones se ejecutan automáticamente sin intervención del usuario** cada vez que inicia la aplicación.

### Flujo en Producción (Electron)

```
Usuario inicia SAE
    ↓
electron/main.js inicia el backend
    ↓
backend/server.js ejecuta initializeDatabase() ← AUTOMÁTICO
    ↓
Se verifica estado de migraciones
    ↓
Se aplican migraciones pendientes (si las hay)
    ↓
La aplicación continúa normalmente
```

### Flujo en Desarrollo

```
npm run dev
    ↓
dev:backend inicia server.js
    ↓
initializeDatabase() se ejecuta (silenciosamente)
    ↓
Si hay migraciones: se aplican
Si no hay: continúa normalmente
```

### Flujo en Auto-Update

```
Usuario tiene SAE 1.1.3-HOTFIX instalado
    ↓
electron-updater descarga v1.1.3-HOTFIX
    ↓
Recopia archivos incluidas nuevas migraciones
    ↓
Usuario reinicia SAE
    ↓
Backend inicia → initializeDatabase() se ejecuta
    ↓
Nuevas migraciones se aplican automáticamente ← TRANSPARENTE
    ↓
La aplicación funciona con schema actualizado
```

## Componentes

### 1. `backend/db/bootstrap.js`
- Modulo que maneja inicialización de BD
- Ejecuta `prisma migrate deploy` (seguro)
- Fallback a `prisma db push` si es necesario
- Logging apropiado según contexto (dev vs prod)

### 2. `backend/server.js`
- Importa y ejecuta `initializeDatabase()` en el startup
- Se llama ANTES de conectar a Prisma
- Completamente transparente para el usuario

## Garantías

✅ **Automático** - El usuario NO hace nada
✅ **Seguro** - No borra datos existentes  
✅ **Idempotente** - Múltiples ejecuciones son seguras
✅ **No bloqueante** - Si falla, la app continúa (con warning)
✅ **Silencioso en prod** - Solo muestra log en caso de error

## Logging

### Desarrollo
```
[DB-INIT] Ejecutando migraciones automáticas...
[DB-INIT✓] Base de datos sincronizada correctamente
```

### Electron (Producción)
```
[DB-INIT] Verificando migraciones...
[DB-INIT✓] Base de datos sincronizada correctamente
```

### Si Hay Error
```
[DB-INIT⚠] Advertencia: No se pudieron aplicar todas las migraciones
[DB-INIT⚠] La aplicación intentará continuar
```

## Testing

Para verificar que funciona:

### En Desarrollo
```bash
npm run dev
# Revisa el log - debería mostrar [DB-INIT✓]
```

### En Electron
```bash
npm run electron
# Las migraciones se aplican silenciosamente en startup
```

### Verificar Manualmente
```bash
# Ver estado actual
npx prisma migrate status

# Si hay pendientes, se aplicarán automáticamente en próximo startup
```

## Nueva Estructura de Directorios

```
backend/
├── db/
│   └── bootstrap.js        ← Nueva inicialización automática
├── prisma-client/
├── migrations/
└── server.js               ← Modificado para llamar bootstrap
```

---

**Versión**: SAE 1.1.3-HOTFIX+  
**Cambio**: Migraciones ahora 100% automáticas en producción
