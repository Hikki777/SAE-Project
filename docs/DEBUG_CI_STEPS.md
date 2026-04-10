# 🔧 Debugging CI/CD - Próximos Pasos

**Fecha**: 9 de Abril 2026  
**Status**: Workflow mejorado - Esperando ejecución en GitHub

---

## 📋 Acciones Realizadas

✅ **Mejoras al workflow CI/CD:**
1. Limpieza automática de npm cache
2. Verificación de integridad de package-lock.json
3. Debug detallado del ambiente (Node, npm, disk space)
4. Verificación de dependencias críticas
5. Logs guardados en build.log
6. Upload automático de logs si falla
7. Mensajes de error más informativos

---

## 🚀 Próximos Pasos

### 1. **Revisa GitHub Actions** (5 minutos)
Ve a: [GitHub Actions Dashboard](https://github.com/Hikki777/SAE-Project/actions)

1. Click en "CI/CD Pipeline"
2. Busca el último run (correspondiente a commit `6a02f3e`)
3. Abre el job "Build de Frontend"

**Busca estos detalles en el output:**

```
✅ Si ves "Build completado":
  - Construimos exitosamente con el nuevo workflow
  - El problema está resuelto

❌ Si el build sigue fallando:
  - Busca en los logs a qué step falló exactamente
  - Revisa las secciones de debug output
  - Posibles ubicaciones de error:
    * "Instalar dependencias raíz" (npm ci)
    * "Instalar dependencias frontend" (cd frontend && npm ci)
    * "Build frontend" (npm run build)
```

### 2. **Interpreta los Logs** (10 minutos)

#### Si falla en "Instalar dependencias raíz":
**Síntomas:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Causa probable**: package-lock.json está desactualizado o corrompido

**Solución:**
```bash
# En local:
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
git push
```

#### Si falla en "Instalar dependencias frontend":
**Síntomas:**
```
npm ERR! peer UNMET DEPENDENCY
npm ERR! missing: react@...
```

**Causa probable**: Incompatibilidad de versiones en frontend

**Solución:**
```bash
# En local:
cd frontend
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate frontend package-lock.json"
git push
```

#### Si falla en "Build frontend":
**El workflow ahora guardará archivos para debug:**
- Ve a "Artifacts" en el run de GitHub Actions
- Descarga `build-logs`
- Revisa el archivo `build.log` para ver el error exacto

**Causas posibles:**
```
Error: Cannot find module 'vite'
  → Falta instalar dependencias frontend

Error: ENOENT: no such file or directory
  → Falta un archivo de configuración

Error: Module not found: 'react'
  → Dependencia no instalada correctamente

UnhandledPromiseRejectionWarning
  → Error en tiempo de compilación (revisar src/)
```

---

## 📊 Matriz de Decisión

| Escenario | Acción | Prioridad |
|-----------|--------|-----------|
| ✅ Build exitoso | ¡Celebrar y continuar! | N/A |
| ❌ Falla en npm ci (raíz) | Regenerar package-lock.json | ALTA |
| ❌ Falla en npm ci (frontend) | Regenerar frontend/package-lock.json | ALTA |
| ❌ Falla en build | Revisar build.log en artifacts | CRÍTICA |
| ⚠️ Warnings prevención de chunks | OK por ahora, optimizar después | BAJA |

---

## 🔍 Verificación Local Adicional

Si quieres probar en local antes de commitear:

```bash
# Simular instalación limpia (como en CI)
npm ci

# Instalar frontend
cd frontend
npm ci

# Build
npm run build

# Si esto funciona localmente pero falla en CI:
# → Probable: caché de GitHub Actions corrupto
# → Solución: Clear GitHub Actions cache en settings
```

---

## 📞 Opciones Nucleares (Si nada funciona)

### Opción 1: Clear GitHub Actions Cache
```
En GitHub:
Settings → Actions → Caches → Clear all caches
Luego: Hacer un nuevo push para disparar workflow
```

### Opción 2: Purgar y Reinstalar Dependencias
```bash
# En local:
rm package-lock.json frontend/package-lock.json
npm cache clean --force
npm install
cd frontend && npm install
npm run build  # Verificar que funciona

# Luego:
git add .
git commit -m "chore: regenerate all package-lock files"
git push
```

### Opción 3: Cambiar Node Version
Si nada funciona y sospechas incompatibilidad:
```yaml
# En .github/workflows/ci.yml:
with:
  node-version: "18.x"  # Probar versión anterior
```

---

## 📝 Información Útil

### Build Logs Location en GitHub Actions
1. Actions → CI/CD Pipeline → latest run
2. Click en "Build de Frontend" job
3. Expande cada section para ver logs
4. Download artifacts si build falla

### Package Vulnerabilities
El workflow muestra advertencias de versiones de npm. Si ves muchas:
```bash
npm audit fix
cd frontend && npm audit fix
git add . && git commit -m "chore: fix npm audit issues"
```

### Common Node/npm Issues
```
Error: Cannot find module 'X'
  → npm ci no instaló correctamente
  → Solución: Regenerar package-lock.json

Error: No such file or directory
  → Falta archivo .env o configuración
  → Verificar que todos los archivos estén en git

WARN npm should be 7.0.0
  → npm versión antigua
  → Solución: Actualizar en sistema local
```

---

## ✅ Checklist Post-Debug

Cuando el build sea exitoso:
- [ ] GitHub Actions muestra ✅ en el workflow
- [ ] No hay errores en los logs
- [ ] frontend/dist se crea correctamente
- [ ] Artifact report muestra métricas del build
- [ ] Puedes descartar los build-logs artifacts

---

## 📞 Resumen Rápido

1. **Espera a que GitHub Actions ejecute el nuevo workflow**
2. **Revisa los logs detallados en GitHub**
3. **Si falla, busca el error específico usando esta guía**
4. **Usa una de las soluciones recomendadas**
5. **Verifica localmente antes de hacer push**
6. **Push y espera a que CI/CD ejecute nuevamente**

**Tiempo estimado para resolver**: 15-30 minutos una vez identifies el problema

---

## 🎯 Objetivo Final

```
main branch ✅
  ↓
Push a GitHub
  ↓
GitHub Actions ejecuta CI/CD
  ↓
Build frontend exitoso ✅
  ↓ 
Workflow completo ✅
```

Las mejoras al workflow te darán la visibilidad necesaria para saber **exactamente qué está fallando** y cómo solucionarlo.

**Estado**: ✅ Workflow mejorado y en GitHub  
**Próximo**: Esperar ejecución y revisar logs

