# 🧪 GUÍA DE TESTING - Panel de Justificaciones v3.0

**Documento**: Instrucciones para testing manual  
**Fecha**: 25 de enero de 2026  
**Versión**: 1.0

---

## 📋 Requisitos Previos

### Entorno
- ✅ Backend corriendo en `http://localhost:5000`
- ✅ Frontend corriendo en `http://localhost:5173`
- ✅ Base de datos con datos de prueba
- ✅ Usuario autenticado (JWT válido)

### Datos de Prueba Necesarios
```sql
-- Alumnos activos
SELECT id, nombres, apellidos, carnet FROM alumnos LIMIT 3;

-- Personal activo
SELECT id, nombres, apellidos, carnet FROM personal LIMIT 3;

-- Justificaciones existentes
SELECT * FROM excusas LIMIT 5;
```

---

## 🎯 Test Case 1: Registrar Justificación Exitosa

### Objetivo
Crear una justificación válida desde el modal

### Pasos
```
1. Navega a: http://localhost:5173/reportes/justificaciones
2. Click botón: "+ Registrar Justificación" (azul, arriba derecha)
3. Se abre modal con formulario

4. Completa FORMULARIO:
   - Tipo de Persona: "Alumno" (default ✓)
   - Selecciona Persona: Elige el primer alumno listado
   - Fecha de Ausencia: Hoy (25/01/2026)
   - Motivo: "Cita médica"
   - Descripción: "Consulta con pediatra"
   - Archivo: NO adjuntes nada (opcional)

5. Click: "[✓ Registrar Justificación]"

6. VERIFICAR:
   ✅ Toast mensaje: "✓ Justificación registrada correctamente"
   ✅ Modal se cierra
   ✅ Panel recarga
   ✅ Nueva fila aparece en tabla con estado "Pendiente"
   ✅ Estadísticas se actualizan
```

### Resultado Esperado
```
Status: ✅ PASS
Toast: "✓ Justificación registrada correctamente"
Tabla: Muestra nueva excusa con estado PENDIENTE
Stats: "Pendientes" aumenta en 1
```

---

## 🎯 Test Case 2: Validación de Duplicados

### Objetivo
Verificar que NO permite crear dos justificaciones para la misma persona el mismo día

### Pasos
```
1. Del Test Case 1, ya existe justificación
2. Click: "+ Registrar Justificación" nuevamente
3. Completa EXACTO igual al test anterior:
   - Mismo alumno
   - Misma fecha (25/01/2026)
   - Motivo: "Otro motivo"

4. Click: "[✓ Registrar Justificación]"

5. VERIFICAR:
   ✅ Toast ERROR: "Esta alumno/a ya tiene una justificación 
                     pendiente para esta fecha"
   ✅ Status HTTP: 409 Conflict
   ✅ Modal permanece ABIERTO (no se cierra)
   ✅ Tabla NO se actualiza
```

### Resultado Esperado
```
Status: ✅ PASS (se bloquea correctamente)
Error Code: 409 Conflict
Toast: Error message about existing justification
Modal: Permanece abierto para correcciones
```

### Validación de Estado en DevTools
```javascript
// Network tab → Última petición POST
Status: 409 Conflict
Response: {
  error: "Esta alumno/a ya tiene una justificación 
           pendiente para esta fecha"
}
```

---

## 🎯 Test Case 3: Cargar Archivo Adjunto

### Objetivo
Crear justificación CON archivo adjunto

### Pasos
```
1. Click: "+ Registrar Justificación"
2. Completa formulario:
   - Tipo: "Personal" (cambiar a Personal)
   - Persona: Selecciona un personal diferente
   - Fecha: Ayer (24/01/2026) - para evitar conflicto
   - Motivo: "Enfermedad"
   - Descripción: "Certificado médico adjunto"

3. Sección "Archivo Adjunto":
   - Click: Área de drop zone
   - Selecciona: Una imagen PNG o PDF (< 5MB)
   - Verifica: Nombre del archivo aparece

4. Click: "[✓ Registrar Justificación]"

5. VERIFICAR:
   ✅ Toast: "Justificación registrada correctamente"
   ✅ Modal se cierra
   ✅ Nueva fila en tabla
   ✅ Archivo guardado en backend
```

### Verificación en Backend
```bash
# Verificar archivo guardado
ls -la /uploads/justificaciones/
# Debe haber: evidencia-{timestamp}.{ext}
```

### Resultado Esperado
```
Status: ✅ PASS
Archivo: Guardado en /uploads/justificaciones/
Modal: Se cierra correctamente
Tabla: Muestra nueva excusa
```

---

## 🎯 Test Case 4: Validación de Archivos Inválidos

### Objetivo
Verificar que NO acepta archivos no permitidos

### Pasos
```
1. Click: "+ Registrar Justificación"
2. Sección "Archivo Adjunto":
   - Click: Área de drop zone
   - Intenta seleccionar: .exe, .txt, .doc
   
3. VERIFICAR OPCIÓN A:
   ✅ FileInput filter bloquea (no aparece en selector)
   
4. Si logra pasar (ej: cambiar extensión):
   - Click: "[✓ Registrar]"
   - Toast DEBE mostrar error:
     ❌ "Solo imágenes o PDF permitidos"
   - Status 400: Bad Request
```

### Resultado Esperado
```
Status: ✅ PASS (se rechaza)
Frontend: FileInput solo muestra image/* y .pdf
Backend: Error 400 si intenta pasar algo más
```

---

## 🎯 Test Case 5: Aprobar Justificación

### Objetivo
Aprobar una justificación PENDIENTE

### Pasos
```
1. En tabla, localiza fila con estado "Pendiente"
2. Click: Botón ojo (👁️) en columna "Acciones"
3. Se abre MODAL DETALLES
4. Verifica información:
   ✅ Foto de la persona
   ✅ Nombre y carnet
   ✅ Fecha de ausencia
   ✅ Motivo
   ✅ Estado badge: "Pendiente" (naranja)
   ✅ Botones: [✓ Aprobar] [✕ Rechazar] [Cerrar]

5. Click: "[✓ Aprobar]"
6. VERIFICAR:
   ✅ Loading spinner visible brevemente
   ✅ Toast: "✓ Justificación aprobada"
   ✅ Modal se cierra automáticamente
   ✅ Panel recarga
   ✅ En tabla: Estado cambio a "Aprobada" (verde)
   ✅ Stats: Pendientes disminuyó en 1
```

### Verificación en DevTools
```javascript
// Console → Network tab
PUT /api/excusas/[ID]
Body: { estado: "aprobada" }
Status: 200 OK
Response: { success: true, excusa: {...} }
```

### Resultado Esperado
```
Status: ✅ PASS
Toast: "✓ Justificación aprobada"
Estado: PENDIENTE → APROBADA
Color Badge: Naranja → Verde
Modal: Se cierra y recarga panel
```

---

## 🎯 Test Case 6: Rechazar Justificación

### Objetivo
Rechazar una justificación PENDIENTE con motivo

### Pasos
```
1. En tabla, busca otra fila con estado "Pendiente"
2. Click: Botón ojo (👁️)
3. Se abre MODAL DETALLES
4. Click: "[✕ Rechazar]"

5. APARECE: Textarea "Motivo del Rechazo"
   - Campo está VACÍO inicialmente
   - Botón "[Confirmar Rechazo]" está DESHABILITADO

6. Ingresa motivo:
   "Documentación incompleta - Falta foto de cédula"

7. Click: "[Confirmar Rechazo]"

8. VERIFICAR:
   ✅ Loading spinner visible
   ✅ Toast: "✗ Justificación rechazada"
   ✅ Modal permanece ABIERTO
   ✅ Estado cambia a "Rechazada" (rojo)
   ✅ Aparece sección ROJA con motivo ingresado
   ✅ Botones: Solo [Cerrar] disponible
   ✅ Stats: "Rechazadas" aumenta en 1
```

### Verificación en DevTools
```javascript
// Network tab
PUT /api/excusas/[ID]
Body: { 
  estado: "rechazada",
  observaciones: "Documentación incompleta..."
}
Status: 200 OK
```

### Verificación en BD
```sql
SELECT * FROM excusa WHERE id = [ID];
-- Debe tener:
-- estado: 'rechazada'
-- observaciones: 'Documentación incompleta...'
```

### Resultado Esperado
```
Status: ✅ PASS
Toast: "✗ Justificación rechazada"
Estado: PENDIENTE → RECHAZADA
Motivo: Visible en sección ROJA
Botones: Solo cerrar disponible
```

---

## 🎯 Test Case 7: Rechazar sin Motivo (Validación)

### Objetivo
Verificar que NO permite rechazar sin proporcionar motivo

### Pasos
```
1. Click: "+ Registrar" (crear una nueva)
2. Completa rápidamente y registra
3. Click: Ojo para detalles
4. Click: "[✕ Rechazar]"
5. Aparece textarea VACÍA
6. Intenta click: "[Confirmar Rechazo]" SIN escribir nada

7. VERIFICAR:
   ✅ Botón está DESHABILITADO (gris/opaco)
   ✅ No permite hacer click
   ✅ NO se envía petición al backend
```

### Resultado Esperado
```
Status: ✅ PASS (se bloquea validación)
Botón: Deshabilitado si textarea está vacía
Petición: NO se envía si vacío
```

---

## 🎯 Test Case 8: Ver Evidencia Adjunta

### Objetivo
Abrir archivo adjunto desde modal de detalles

### Pasos
```
1. Localiza excusa que tenga archivo adjunto
2. Click: Ojo (Ver detalles)
3. En modal, busca sección "Evidencia Adjunta"
4. Si tiene archivo: Aparece link
   "📄 [Ver Documento]"
5. Click: En el link

6. VERIFICAR:
   ✅ Se abre en nueva pestaña
   ✅ URL: http://localhost:5000/uploads/justificaciones/evidencia-{ts}.{ext}
   ✅ Archivo se visualiza (PDF o imagen)
   ✅ Si es PDF: Adobe Reader o navegador lo abre
   ✅ Si es imagen: Se visualiza normalmente
```

### Resultado Esperado
```
Status: ✅ PASS
Link: Funciona y abre archivo
Archivo: Se visualiza correctamente
```

---

## 🎯 Test Case 9: Dark Mode

### Objetivo
Verificar que todos los componentes nuevos soportan dark mode

### Pasos
```
1. En navegador (bottom left icon): Activa Dark Mode
2. Click: "+ Registrar Justificación"
3. VERIFICAR MODAL:
   ✅ Fondo oscuro (dark:bg-gray-800)
   ✅ Texto blanco/gris claro
   ✅ Inputs con fondo oscuro
   ✅ Labels legibles
   ✅ Botones contrastados

4. Completa y registra una justificación
5. Click: Ojo para ver detalles
6. VERIFICAR MODAL DETALLES:
   ✅ Fondo oscuro
   ✅ Tarjetas con fondo semi-oscuro
   ✅ Texto blanco
   ✅ Botones con colores saturados
   ✅ Gradient background visible
   ✅ Todo legible
```

### Resultado Esperado
```
Status: ✅ PASS
Dark Mode: Activo en todos los nuevos componentes
Contraste: Todo legible
Estilos: Coherentes con el resto del sistema
```

---

## 🎯 Test Case 10: Validación de Campos Requeridos

### Objetivo
Verificar que HTML5 validation bloquea campos vacíos

### Pasos
```
1. Click: "+ Registrar Justificación"
2. Deja TODOS los campos vacíos
3. Click: "[✓ Registrar Justificación]"

4. VERIFICAR:
   ✅ Browser HTML5 validation aparece
   ✅ Foco en primer campo requerido
   ✅ Mensaje: "Please fill out this field" (o traducido)
   ✅ NO se envía petición al backend
   ✅ Modal permanece abierto

5. Llena PARCIALMENTE (solo nombre):
   - Tipo: "Alumno"
   - Persona: (completo)
   - Fecha: (VACÍO)
   - Motivo: "Test"

6. Click: "[✓ Registrar]"

7. VERIFICAR:
   ✅ Foco en "Fecha de Ausencia"
   ✅ Validation message aparece
   ✅ NO se envía petición
```

### Resultado Esperado
```
Status: ✅ PASS
Validación: HTML5 funciona
Campos requeridos: Tienen "required" attribute
Mensajes: Aparecen en UI
```

---

## 🎯 Test Case 11: Filtros + Crear + Acciones

### Objetivo
Flujo completo: Filtrar → Crear → Aprobar/Rechazar

### Pasos
```
PASO 1: FILTRAR
  1. En panel, selecciona filtro "Últimos 7 días"
  2. Filtro Estado: "Pendientes"
  3. Click: "Buscar"
  4. Tabla muestra solo PENDIENTES de últimos 7 días

PASO 2: CREAR
  5. Click: "+ Registrar Justificación"
  6. Crea nueva justificación para hoy
  7. Modal se cierra y panel recarga
  8. Nueva excusa aparece en tabla (está en rango filtrado)

PASO 3: ACCIONES
  9. Click: Ojo en la nueva excusa
  10. Modal muestra detalles
  11. Click: "✓ Aprobar"
  12. Estado cambia a APROBADA
  13. Panel recarga
  14. Excusa DESAPARECE de tabla (ya no es PENDIENTE)

PASO 4: VERIFICAR STATS
  15. Tarjeta "Pendientes" debe haber disminuido en 1
  16. No hay más excusas PENDIENTES de hoy (si era la única)
```

### Resultado Esperado
```
Status: ✅ PASS
Filtros: Funcionan correctamente
Crear: Se registra y aparece en tabla filtrada
Acciones: Cambian estado y panel se actualiza
Stats: Se recalculan correctamente
```

---

## 🎯 Test Case 12: Responsividad

### Objetivo
Verificar que componentes funcionan en diferentes tamaños

### Pasos
```
1. Abre DevTools (F12)
2. Activa Device Mode

MOBILE (375px):
  - Click: "+ Registrar"
  - VERIFICAR:
    ✅ Modal ocupa 90% del ancho
    ✅ Formulario legible
    ✅ Botones clickeables (> 44px altura)
    ✅ Scroll funciona si es necesario
    ✅ No hay overflow

TABLET (768px):
  - Click: "+ Registrar"
  - VERIFICAR:
    ✅ Modal centrado
    ✅ Grid de inputs es 2 cols (responsive)
    ✅ Todo visible sin scroll

DESKTOP (1920px):
  - Click: "+ Registrar"
  - VERIFICAR:
    ✅ Modal max-width respetado (2xl)
    ✅ Tabla completa visible
    ✅ Sin problemas de layout
```

### Resultado Esperado
```
Status: ✅ PASS
Mobile: Funciona correctamente
Tablet: Layout adaptado
Desktop: Óptimo
```

---

## 📊 Resumen de Test Cases

| ID | Test | Objetivo | Estado |
|----|------|----------|--------|
| 1 | Crear exitosa | Registrar justificación | ✅ |
| 2 | Duplicados | Validar no duplicar | ✅ |
| 3 | Con archivo | Cargar PDF/Imagen | ✅ |
| 4 | Archivo inválido | Rechazar tipo incorrecto | ✅ |
| 5 | Aprobar | Cambiar a APROBADA | ✅ |
| 6 | Rechazar | Cambiar a RECHAZADA + motivo | ✅ |
| 7 | Rechazo sin motivo | Bloquear si vacío | ✅ |
| 8 | Ver evidencia | Abrir archivo adjunto | ✅ |
| 9 | Dark mode | Estilos oscuros | ✅ |
| 10 | Validación campos | HTML5 validation | ✅ |
| 11 | Flujo completo | Filtrar+Crear+Actuar | ✅ |
| 12 | Responsividad | Mobile/Tablet/Desktop | ✅ |

---

## 🔍 Verificaciones Adicionales

### Console (F12 → Console)
```javascript
// No debe haber errores
✅ Sin errores rojos
✅ Sin warnings críticos

// Verificar requests
✅ POST /api/excusas → 200/201
✅ PUT /api/excusas/:id → 200
✅ GET /alumnos → 200
✅ GET /personal → 200
```

### Network Tab (F12 → Network)
```
POST /api/excusas
  - Status: 200 (éxito) o 409 (duplicado)
  - Body: FormData con campos
  - Response: { success: true, excusa: {...} }

PUT /api/excusas/:id
  - Status: 200
  - Body: { estado: 'aprobada'|'rechazada', observaciones?: '...' }
  - Response: { success: true, excusa: {...} }
```

### Performance
```
✅ Sin memory leaks
✅ Sin infinite loops
✅ Componentes se desmountan correctamente
✅ Listeners se limpian (cleanup en useEffect)
```

---

## 📝 Reportar Issues

### Si encuentra bug:
```
1. Documenta:
   - Paso exacto que causa el bug
   - Resultado esperado
   - Resultado obtenido
   - Screenshots/videos

2. Revisa:
   - Console (F12) por errores
   - Network tab por respuestas 4xx/5xx
   - Estado de la BD

3. Reporta:
   - Crear issue en GitHub
   - Título descriptivo
   - Pasos para reproducir
   - Evidencia (screenshot, video)
```

---

## ✅ Checklist Final

Antes de marcar como "COMPLETO":

```
TESTING COMPLETADO:
☐ Test 1: Crear exitosa
☐ Test 2: Validar duplicados
☐ Test 3: Cargar archivo
☐ Test 4: Archivo inválido
☐ Test 5: Aprobar
☐ Test 6: Rechazar
☐ Test 7: Validar rechazo
☐ Test 8: Ver evidencia
☐ Test 9: Dark mode
☐ Test 10: Validación campos
☐ Test 11: Flujo completo
☐ Test 12: Responsividad

VERIFICACIONES:
☐ Console sin errores
☐ Network requests correctas
☐ Performance OK
☐ Datos en BD correctos
☐ Dark mode funciona

DOCUMENTACIÓN:
☐ Completada
☐ Actualizada
☐ Compartida
```

---

**Documento**: GUÍA DE TESTING v3.0  
**Casos**: 12 + verificaciones adicionales  
**Tiempo estimado**: 45-60 minutos  
**Status**: 🟢 Listo para testing  
**Versión**: 1.0
