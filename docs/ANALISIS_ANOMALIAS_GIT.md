# 📊 Análisis de Anomalías - Repositorio SAE

**Fecha**: 9 de Abril 2026  
**Estado**: ⚠️ Se detectaron varias inconsistencias que requieren atención

---

## 📈 Resumen Ejecutivo

| Categoría | Estado | Acción Requerida |
|-----------|--------|-----------------|
| **Rama Principal** | ✅ OK | Sincronizada con origin/main |
| **Archivos Temporales** | 🔴 CRÍTICO | Eliminar 5 archivos .tmp (96 MB) |
| **Configuración Instalador** | 🔴 CRÍTICO | Resolver inconsistencia en 2 archivos |
| **Control de Versiones** | 🟡 ADVERTENCIA | Cambios sin commitear |
| **Documentación** | 🟡 ADVERTENCIA | Archivo nuevo sin tracking |

---

## 🔴 ANOMALÍAS CRÍTICAS

### **Anomalía #1: Archivos Temporales de Prisma**

#### Ubicación
```
backend/prisma-client/
  ├── query_engine-windows.dll.node.tmp14524  (19.3 MB)
  ├── query_engine-windows.dll.node.tmp15228  (19.3 MB)
  ├── query_engine-windows.dll.node.tmp16984  (19.3 MB)
  ├── query_engine-windows.dll.node.tmp18580  (19.3 MB)
  └── query_engine-windows.dll.node.tmp3996   (19.3 MB)
                        TOTAL: ~96 MB
```

#### Análisis
- 🔴 **Estado Actual**: files no tracked (untracked)
- 🟡 **Riesgo**: Puede ser commiteado accidentalmente
- ✅ **Protección**: No están en .gitignore (esto es BUENO - los ignora)
- ⚠️ **Impacto**: Archivos obsoletos que deben limpiarse

#### Origen
Estos archivos son creados por:
- Compilación de Prisma durante `npm install` o ejecución
- `npm run build:frontend` 
- Integración con la base de datos

#### Solución
```bash
# Eliminar todos los archivos .tmp de Prisma
Remove-Item 'backend/prisma-client/*.tmp*' -Force

# Verificar eliminación
git status  # No debe listar los .tmp files
```

---

### **Anomalía #2: Desincronización de Archivos de Instalador** ⚠️ MUY IMPORTANTE

#### Archivos Involucrados
```
build/installer.nsh              ✅ ACTUALIZADO  (v1.1.0)
build/installer-complete.nsh     ❌ OBSOLETO     (v1.0.5/v1.0.1)
```

#### Detalles de installer.nsh (ACTUAL)
```nsh
; ==============================================================
; SAE - Sistema de Administracion Educativa
; NSIS customization script para electron-builder
; Version: 1.1.0          ← ✅ Versión actual
; ==============================================================

BrandingText "SAE - Sistema de Administracion Educativa"

; Sección customInstall: ✅ Completa y bien estructurada
; Sección customUninstall: ✅ Mejorado con:
;   - Mensajes detallados
;   - Eliminación de 4 ubicaciones vs 1 anterior
;   - Validaciones condicionales
;   - UX mejorado con bordes visuales

; Últimas modificaciones:
;   + Eliminación de $LOCALAPPDATA\SAE
;   + Eliminación de cache Electron
;   + Eliminación de accesos directos
;   + Mejores mensajes del progreso
```

#### Detalles de installer-complete.nsh (OBSOLETO)
```nsh
; ==========================================
; Script NSIS personalizado para SAE
; Sistema de Administración Educativa
; ==========================================

BrandingText "SAE - Sistema de Administración Educativa v1.0.5"  ← ❌ Versión antigua

!macro customInit
  DetailPrint "Versión: 1.0.1"                                  ← ❌ MUY ANTIGUA
!macroend

; Desinstalador: ❌ COMPLETAMENTE DESACTUALIZADO
!macro customUninstall
  SetDetailsPrint listonly
  DetailPrint "Removiendo archivos de SAE..."
!macroend

; ❌ Sin mejoras de desinstalación
; ❌ Sin eliminación de directorios auxiliares
; ❌ Sin validaciones
```

#### Problema
- **Dos archivos con propósitos similares pero versiones COMPLETAMENTE diferentes**
- installer.nsh: Versión 1.1.0 con mejoras recientes
- installer-complete.nsh: Versión 1.0.5/1.0.1 sin cambios
- **¿Cuál se está usando?** → RIESGO DE INCONSISTENCIA

#### Impacto Potencial
```
Si electron-builder usa installer-complete.nsh por defecto:
  🔴 Los instaladores generados tendrán desinstalador OBSOLETO
  🔴 No tendrán las mejoras aplicadas hoy
  🔴 Usuarios recibirán versión antigua con menos limpieza de datos
```

#### Historial Git
```
Commits relevantes:
  9aadb7c: "fix: reparar restore backup y salvar ignored installer.nsh"
           → Índica que esto fue un problema conocido
```

#### Solución Recomendada

**Opción A: Mantener solo installer.nsh** (RECOMENDADO)
```bash
# 1. Eliminar archivo obsoleto
Remove-Item build/installer-complete.nsh
git rm build/installer-complete.nsh

# 2. Verificar que electron-builder usa installer.nsh
cat package.json | grep -A 5 '"nsis"'
```

**Opción B: Sincronizar ambos archivos**
```bash
# Si ambos deben existir, copiar contenido actualizado
Copy-Item build/installer.nsh build/installer-complete.nsh

# Luego commitear ambos
git add build/installer.nsh build/installer-complete.nsh
git commit -m "fix: sync installer-complete.nsh with latest installer.nsh v1.1.0"
```

**Opción C: Marcar como deprecated** (NO RECOMENDADO)
```bash
# Solo si hay razón específica para mantenerlo
echo "# DEPRECATED - Use installer.nsh instead" > build/installer-complete.nsh
```

---

## 🟡 ANOMALÍAS SECUNDARIAS

### **Anomalía #3: Cambios sin Commitear**

#### Estado Actual
```
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)

    modified:   build/installer.nsh
```

#### Detalles
- **Archivo**: build/installer.nsh
- **Líneas**: +87 líneas, -20 líneas (67 líneas netas de cambio)
- **Cambios**: Mejoras al desinstalador (según análisis anterior)
- **Estado**: Modified, pero NO commiteado

#### Recomendación
```bash
# Ver diferencias
git diff build/installer.nsh

# Commitear cambios
git add build/installer.nsh
git commit -m "feat(installer): improve uninstaller with detailed messages and cleaner cleanup

- Add detailed progress messages to desinstaller
- Clean up 4 directories instead of 1 (\$APPDATA\SAE, \$LOCALAPPDATA\SAE, cache, shortcuts)
- Add conditional validation for Electron cache
- Improve UX with formatted borders and checkmarks
- Change default button from NO to YES for data deletion"
```

---

### **Anomalía #4: Documentación Nueva sin Tracking**

#### Archivo
```
docs/MEJORAS_DESINSTALADOR.md (182 líneas)
```

#### Estado
- 🟡 **Creado** pero **NO agragado a git**
- 📝 Documenta los cambios realizados
- 💾 Debe ser versionado con los cambios

#### Solución
```bash
git add docs/MEJORAS_DESINSTALADOR.md
git commit --amend  # Agregar a commit anterior si aún no está commiteado
# o hacer commit separado
git commit -m "docs: add uninstaller improvements documentation"
```

---

### **Anomalía #5: Advertencia de Encoding (LF → CRLF)**

#### Mensaje
```
warning: in the working copy of 'build/installer.nsh', 
LF will be replaced by CRLF the next time Git touches it
```

#### Explicación
- Git detectó inconsistencia en caracteres de salto de línea
- Windows usa CRLF (Carriage Return + Line Feed)
- Sistema usa LF (solo Line Feed)
- Will be converted automatically

#### Impacto
- 🟢 Bajo: Git lo maneja automáticamente
- 🟡 Puede afectar diffs futuros

#### Solución (Opcional)
```bash
# Configurar .gitattributes
echo "*.nsh text eol=crlf" >> .gitattributes
git add .gitattributes
git commit -m "chore: configure gitattributes for NSIS files"
```

---

## 📋 Plan de Acción

### **Paso 1: Limpiar Archivos Temporales** (5 minutos)
```bash
# Eliminar archivos .tmp
Remove-Item 'backend/prisma-client/*.tmp*' -Force -ErrorAction SilentlyContinue

# Verificar
git status  # No debe mostrar query_engine files
```

### **Paso 2: Resolver Inconsistencia de Instalador** (10 minutos)
```bash
# Opción A (Recomendada): Eliminar archivo obsoleto
git rm --cached build/installer-complete.nsh
Remove-Item build/installer-complete.nsh
git add .gitignore  # si es necesario actualizar
git commit -m "fix: remove obsolete installer-complete.nsh - use installer.nsh v1.1.0 instead"

# Opción B: Sincronizar
Copy-Item build/installer.nsh build/installer-complete.nsh
git add build/installer.nsh build/installer-complete.nsh
git commit -m "fix: sync installer-complete.nsh with latest v1.1.0"
```

### **Paso 3: Commitear Cambios Pendientes** (5 minutos)
```bash
git add build/installer.nsh
git add docs/MEJORAS_DESINSTALADOR.md
git commit -m "feat(installer): improve uninstaller with detailed messages and cleaner cleanup

- Add detailed progress messages to uninstaller
- Expand cleanup to 4 locations: AppData, LocalAppData, Electron cache, shortcuts
- Add conditional validation for Electron cache
- Improve UX with formatted borders and progress indicators
- Change default button from NO to YES for data deletion

Documentation: Added docs/MEJORAS_DESINSTALADOR.md with full details"
```

### **Paso 4: Verificar Integridad** (5 minutos)
```bash
# Que todo está commiteado
git status
# Respuesta esperada: "working tree clean"

# Ver último commit
git log --oneline -5

# Verificar que origen está actualizado
git push origin main
```

---

## 📊 Estadísticas

### Cambios Globales
- **Archivos Modified**: 1 (installer.nsh)
- **Archivos Untracked**: 3
  - 2 archivos .tmp (deben eliminarse)
  - 1 archivo de documentación (deben agregarse)
- **Líneas de código cambiadas**: +87/-20 en installer.nsh
- **Tamaño de basura**: ~96 MB (.tmp files)

### Historial Reciente
- **Último commit**: 9d73b1f (9 de Abril 2026)
- **Rama**: main
- **Estado**: Sincronizado con origin/main ✅
- **Cambios sin commitear**: 1 archivo

---

## ✅ Conclusiones

### Estado General
El repositorio está **principalmente sano**, pero con **3 áreas que necesitan atención**:

1. 🔴 **CRÍTICO**: Archivos temporales de Prisma (eliminar)
2. 🔴 **CRÍTICO**: Inconsistencia en archivos de instalador (resolver)
3. 🟡 **ADVERTENCIA**: Cambios sin commitear (hacer commits)

### Recomendación Final
**Ejecutar el Plan de Acción en orden** para llevar el repo a estado limpio y consistente.

**Tiempo estimado**: ~20-30 minutos

---

## 📎 Referencias

- Último commit: `9d73b1f`
- Rama actual: `main`
- Repositorio: Sincronizado ✅
- Fecha análisis: 2026-04-09 18:30 UTC-6

**Documento generado automáticamente por análisis de Git**
