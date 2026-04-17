# SOLUCIÓN: Base de Datos se borra con cada actualización

## Problema Identificado ❌

El sistema estaba usando **`npx prisma db push`** en lugar de migraciones versionadas. Este comando tiene limitaciones críticas:

- **⚠️ No es idempotente**: Puede ejecutarse múltiples veces y causar problemas
- **⚠️ Destructivo con cambios de esquema**: En ciertas situaciones puede borrar datos
- **⚠️ No es adecuado para actualizaciones**: No respeta el historial de cambios

### Ubicaciones Problemáticas
1. `scripts/setup-project.js` - Usaba `db push` en setup inicial
2. `package.json` postinstall - Ejecutaba setup que llamaba `db push`

## Solución Implementada ✅

### 1. **Script Nuevo: `scripts/safe-migrate.js`**
   - Verifica estado de migraciones antes de aplicar cambios
   - Usa `prisma migrate deploy` (seguro y non-destructivo)
   - Fallback inteligente si no hay migraciones
   - Genera Prisma Client automáticamente

### 2. **Actualizado: `scripts/setup-project.js`**
   - Ahora intenta `prisma migrate deploy` primero
   - Si falla (primer setup), usa `db push` como fallback
   - **Nunca** ejecuta `migrate reset`

### 3. **Actualizado: `package.json`**
   ```json
   "postinstall": "node scripts/safe-migrate.js"
   "migrate:safe": "node scripts/safe-migrate.js"
   ```
   - Postinstall ahora llama al script seguro de migraciones

### 4. **Actualizado: `scripts/update-system.js`**
   - Ahora llama a `safe-migrate.js` en lugar de `MigrationManager.runMigrations()`
   - Asegura que las migraciones se apliquen con seguridad

## Cómo Usar

### Desarrollo
```bash
# Las migraciones se aplican automáticamente en:
npm install
npm run dev

# Manual:
npm run migrate:safe
```

### Actualización
```bash
# Descargar e instalar:
git pull
npm install  # <- Ejecuta safe-migrate automáticamente

# O actualización de sistema:
npm run update  # <- Usa safe-migrate ahora
```

### Electron (Instalado)
- Las migraciones se aplican automáticamente en el siguiente inicio
- No hay acción necesaria del usuario

## Garantías de Seguridad 🔒

✅ **Los datos NUNCA se borran automáticamente**
- Las migraciones respetan todos los datos existentes
- `db push` solo se usa como fallback en la primera instalación

✅ **Migraciones atómicas**
- Cada cambio es registrado en el historial
- Rollback es posible si es necesario

✅ **Idempotente**
- Ejecutar `safe-migrate.js` múltiples veces es seguro
- No causa problemas si otra actualización está en curso

## Si Hay Problemas

### Si sigue perdiendo datos:
1. Verifica que estés en la rama correcta: `git status`
2. Revisa si hay migraciones pendientes: `npm run prisma:status` *(si existe)*
3. Ejecuta manualmente: `npm run migrate:safe`

### Rollback de datos (si ocurrió lo peor):
```bash
# Ver backups disponibles
ls backups/

# Restaurar último backup
node scripts/restore-backup.js [backup-path]
```

## Cambios en Comportamiento

| Antes | Después |
|-------|---------|
| `npm install` corría `db push` | Ahora corre `migrate deploy` |
| `npm update` podía borrar datos | Ahora es seguro |
| Actualizar Electron borraba BD | Ahora preserva datos |
| Migraciones no se rastreaban | Ahora hay historial completo |

---

**Versión**: SAE 1.1.3 HOTFIX
**Fecha**: 2026-04-09  
**Crítica**: NO - Cambios de implementación interna
