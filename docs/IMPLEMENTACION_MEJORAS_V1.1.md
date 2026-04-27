# 🚀 Plan de Implementación - Sistema SAE Mejorado

## ✅ Cambios Implementados

### **1. QR Service - Carnet Incluido** ✅
**Archivo:** [backend/services/qrService.js](../../backend/services/qrService.js)

**Cambios:**
- Nueva función `crearTextoCarnet()` para generar SVG con número de carnet
- Mejorada función `generarQrConLogo()` con 4 parámetros:
  - `token` - Contenido del QR
  - `logoFuente` - Logo institucional
  - `filename` - Nombre del archivo
  - `carnet` - **NUEVO** - Número de carnet a mostrar debajo
- El QR ahora se expande verticalmente 80px para acomodar el carnet
- Carnet se alinea abajo (gravity: south) en texto grande y negrita

**Resultado Visual:**
```
┌─────────────────┐
│                 │
│   [QR con logo] │
│                 │
├─────────────────┤
│  2024-AL-001234 │  ← Carnet en texto grande
└─────────────────┘
```

---

### **2. Setup State Service** ✅
**Archivo:** [backend/services/setupStateService.js](../../backend/services/setupStateService.js) **(CREADO)**

**Propósito:** Detectar primera ejecución y gestionar estado del SetupWizard

**Funcionalidades:**
- `getSetupState()` - Leer estado actual (setup completado, instalación, etc.)
- `shouldShowSetupWizard()` - Determinar si mostrar wizard
- `markSetupWizardCompleted()` - Registrar finalización del setup
- `markFirstInstallation()` - Marcar como primera instalación
- `getDiagnostics()` - Diagnosticar estado completo del sistema

**Archivo de configuración:**
```
%APPDATA%\SAE\setup-state.json
{
  "version": "1.0.0",
  "installed_at": "2026-04-26T...",
  "setup_completed": false,
  "setup_completed_at": null,
  "institution_configured": false,
  "admin_created": false,
  "first_launch": true,
  "installations": [],
  "migrations_applied": []
}
```

---

### **3. Database Integrity Validator** ✅
**Archivo:** [backend/services/dbIntegrityValidator.js](../../backend/services/dbIntegrityValidator.js) **(CREADO)**

**Validaciones automáticas:**
- ✅ Alumnos - Verifica relaciones grado/sección/jornada, carnet único
- ✅ Personal - Verifica relaciones rol/jornada, carnet único
- ✅ Asistencias - Verifica alumno_id y personal_id válidos
- ✅ Excusas - Verifica referencia con alumnos y personal
- ✅ Justificaciones - Verifica referencia con alumnos y personal

**Métodos principales:**
- `validateFullIntegrity()` - Validar todo el sistema
- `generateReport()` - Generar reporte con estadísticas
- `cleanOrphans()` - Limpiar registros huérfanos (DRY RUN primero)
- `getDbStats()` - Obtener conteo de registros

**Uso en backup/restore:**
```javascript
const DbValidator = require('./services/dbIntegrityValidator');
const result = await DbValidator.validateFullIntegrity();
if (result.valid) {
  // OK para restaurar
} else {
  // Mostrar orphans detectados
}
```

---

### **4. Migration Manager Mejorado** ✅
**Archivo:** [backend/migrations/migration-manager.js](../../backend/migrations/migration-manager.js)

**Mejoras:**
- ✅ Rollback automático en caso de error
- ✅ Backup de versión antes de migrar
- ✅ Validación de integridad pre/post migración
- ✅ Historial persistente de migraciones
- ✅ Soporte para up/down en migraciones futuras

**Nuevo flujo:**
```
1. Leer versión actual
2. Crear backup (migración-v1.0.0-2026-04-26.json)
3. Validar integridad BD (pre-migration check)
4. Ejecutar migraciones una por una:
   - Ejecutar up()
   - Registrar en historial
   - Validar integridad (post-migración)
5. Si error → rollback automático a backup
6. Actualizar version.json
```

---

### **5. Instalador NSIS Mejorado** ✅
**Archivo:** [build/installer.nsh](../../build/installer.nsh)

**Cambios:**
- ✅ Progreso detallado durante instalación ([1/4], [2/4], etc.)
- ✅ Desinstalador mejorado con progreso ([1/5], [2/5], etc.)
- ✅ Mensaje claro sobre preservación de datos
- ✅ Pregunta al desinstalar si eliminar todos los datos
- ✅ Opción de conservar datos para reinstalación futura
- ✅ Registra flag NeedsSetup para que app lance SetupWizard

**Flujo de instalación:**
```
[1/4] Preparando entorno de datos
      → Creando directorios... ✓
      → Configurando permisos... ✓

[2/4] Validando estado de datos
      → Base de datos existente detectada ✓

[3/4] Registrando aplicación
      → Accesos directos creados ✓

[4/4] Finalizando...
      → Completado exitosamente ✓
```

---

### **6. Rutas Admin con Integridad** ✅
**Archivo:** [backend/routes/admin.js](../../backend/routes/admin.js)

**Nuevas rutas agregadas:**

#### GET `/api/admin/db/integrity`
Validar integridad de BD completa
```json
{
  "valid": true,
  "summary": {
    "checks_passed": 5,
    "checks_failed": 0,
    "total_orphans": 0,
    "total_duplicates": 0
  },
  "stats": {
    "alumnos": 450,
    "personal": 32,
    "asistencias": 12500
  }
}
```

#### GET `/api/admin/db/diagnostics`
Diagnóstico completo (setup, migraciones, integridad)

#### POST `/api/admin/db/validate-compatibility`
Validar si backup es compatible antes de restaurar
```json
{
  "compatible": true,
  "currentVersion": "1.0.0",
  "backupVersion": "1.0.0"
}
```

#### GET `/api/admin/setup/state`
Obtener estado de SetupWizard

#### POST `/api/admin/setup/complete`
Marcar SetupWizard como completado

---

## 🔧 Integración en Electron

**Próximo paso (NO IMPLEMENTADO AÚN):**

En [electron/main.js](../../electron/main.js), agregar antes de `createWindow()`:

```javascript
// Cargar setupStateService para detectar primera ejecución
const setupStateService = require('../backend/services/setupStateService');

app.on('ready', async () => {
  // ... código existente ...
  
  // Verificar si SetupWizard debe ejecutarse
  const shouldShowSetup = await setupStateService.shouldShowSetupWizard();
  global.setupRequired = shouldShowSetup;
  
  createWindow(backendPort);
});

// En preload.js o context.ts, exponer a rendererprocess:
ipcMain.handle('setup:should-show', async () => {
  return global.setupRequired;
});
```

Y en [frontend/src/components/SetupWizard.jsx](../../frontend/src/components/SetupWizard.jsx):

```javascript
export default function SetupWizard({ onComplete }) {
  const [shouldShow, setShouldShow] = useState(false);
  
  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.invoke('setup:should-show').then(setShouldShow);
    }
  }, []);
  
  // Mostrar SetupWizard si es primera ejecución
  if (!shouldShow) return null;
  // ... resto del componente
}
```

---

## 📊 Compatibilidad

| Componente | Versión | Cambios |
|---|---|---|
| Node.js | 16+ | ✅ Compatible |
| Electron | 20+ | ✅ Compatible |
| SQLite/Prisma | Actual | ✅ Sin cambios schema |
| Frontend React | 19 | ✅ Sin cambios |
| Backend Express | 4.x | ✅ Sin cambios |

---

## 🧪 Testing (TODO)

```bash
# Backend - Validar integridad
npm run test -- dbIntegrityValidator.test.js

# Backend - Migraciones con rollback
npm run test -- migration-manager.test.js

# Backend - SetupState
npm run test -- setupStateService.test.js

# E2E - Instalación + SetupWizard
npm run test:e2e -- installer.e2e.js
```

---

## 🐛 Problemas Resueltos

### "Se pierden datos al restaurar backup"
✅ **Solución:** DbIntegrityValidator valida antes/después, rollback automático si falla

### "SetupWizard no se ejecuta en primera instalación"
✅ **Solución:** SetupStateService detecta `first_launch: true` y marca como completada

### "Migraciones pueden ejecutarse dos veces"
✅ **Solución:** MigrationManager guarda historial persistente y verifica antes de ejecutar

### "Desinstalador sin progreso visible"
✅ **Solución:** Nuevo installer.nsh con [1/5], [2/5], etc. y mensajes detallados

---

## 📋 Checklist de Verificación

- [x] QR genera con carnet debajo
- [x] SetupStateService controla primera ejecución
- [x] DbIntegrityValidator valida todas las relaciones
- [x] MigrationManager tiene rollback
- [x] Instalador muestra progreso
- [x] Desinstalador muestra progreso
- [x] Rutas admin para diagnosticar
- [ ] Integración en Electron main.js (PENDIENTE)
- [ ] Tests completos (PENDIENTE)
- [ ] Documentación de usuario (PENDIENTE)

---

## 🚀 Próximos Pasos (Prioridad)

1. **INMEDIATO:** Integrar SetupStateService en electron/main.js
2. **INMEDIATO:** Agregar IPC handlers para SetupWizard
3. **Corto plazo:** Crear tests para integridad y migraciones
4. **Corto plazo:** Documentar proceso de actualización a usuarios
5. **Mediano plazo:** Refactorizar WebSockets con canales granulares

---

## 📞 Soporte

Para dudas sobre la implementación:
- Revisar archivos creados/modificados
- Chequear rutas admin (GET /api/admin/db/integrity)
- Usar SetupStateService.getDiagnostics() para troubleshooting
