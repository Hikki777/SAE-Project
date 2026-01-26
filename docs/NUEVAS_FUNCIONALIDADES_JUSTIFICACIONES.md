# 🚀 Nuevas Funcionalidades - Panel de Justificaciones

**Fecha**: 25 de enero de 2026  
**Versión**: 3.0 (Acciones y Gestión Completa)  
**Estado**: ✅ Listo para Producción

---

## 📋 Resumen de Cambios

Se implementaron tres funcionalidades críticas al panel de justificaciones:

1. **Creación de justificaciones** desde la interfaz con validación de duplicados
2. **Aprobación y rechazo** directo desde modales
3. **Regla de una sola justificación** por persona para evitar conflictos

---

## 🆕 1. Registrar Nueva Justificación

### Ubicación
- **Botón**: Header del panel `+ Registrar Justificación` (azul)
- **Acceso**: Todos los usuarios con acceso al panel

### Modal Crear Justificación
```
┌─────────────────────────────────────────────┐
│ ➕ Registrar Justificación            ✕      │
├─────────────────────────────────────────────┤
│ Tipo de Persona:        [Alumno/Personal ▼] │
│ Selecciona la Persona: [Lista dinámica ▼]   │
│ Fecha de Ausencia:      [__________]         │
│ Motivo de Ausencia:     [Cita médica]        │
│ Descripción (opt):      [Detalles...]        │
│                                              │
│ Archivo Adjunto:                             │
│ ┌──────────────────────────────────────┐    │
│ │ 📁 Click para seleccionar (PDF/Img)  │    │
│ └──────────────────────────────────────┘    │
│                                              │
│         [Cancelar]  [✓ Registrar]            │
└─────────────────────────────────────────────┘
```

### Campos del Formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Tipo de Persona | Select | ✅ | Alumno o Personal |
| Selecciona la Persona | Select | ✅ | Lista dinámica con carnet |
| Fecha de Ausencia | Date | ✅ | Formato YYYY-MM-DD |
| Motivo de Ausencia | Text | ✅ | Ej: Cita médica, Enfermedad |
| Descripción | Textarea | ❌ | Detalles adicionales |
| Archivo Adjunto | File | ❌ | PDF o Imagen (máx 5MB) |

### Validaciones Backend

**Regla Principal**: ⚠️ **Una solo justificación PENDIENTE o APROBADA por persona y fecha**

```javascript
// Búsqueda de conflictos
const justificacionExistente = await prisma.excusa.findFirst({
  where: {
    [personaField]: personaId,
    fecha_ausencia: {
      gte: fechaInicio,  // Mismo día
      lte: fechaFin
    },
    estado: {
      in: ['pendiente', 'aprobada']  // No permite duplicar
    }
  }
});

// Si existe: Respuesta 409 Conflict
if (justificacionExistente) {
  return res.status(409).json({ 
    error: "Esta persona ya tiene una justificación pendiente/aprobada para esta fecha"
  });
}
```

### Estados Disponibles
- **Pendiente** (por defecto): Esperando revisión
- **Aprobada**: Justificación válida
- **Rechazada**: Justificación inválida

### Archivos Adjuntos
- **Tipos permitidos**: PDF, PNG, JPG, JPEG, GIF
- **Almacenamiento**: `/uploads/justificaciones/`
- **Tamaño máximo**: 5MB
- **Uso**: Evidencia (recetas médicas, certificados, etc.)

---

## ✅ 2. Aprobar Justificación

### Acceso
- **Desde**: Modal de detalles (botón ojo)
- **Requisito**: Estado PENDIENTE
- **Botón**: Verde con icono ✓

### Flujo de Aprobación
```
1. Click en ojo (Ver detalles)
2. Modal muestra justificación
3. Click en botón [✓ Aprobar]
4. Confirmación automática
5. Estado cambia a APROBADA
6. Panel se recarga
7. Toast: "✓ Justificación aprobada"
```

### Backend Endpoint
```
PUT /api/excusas/:id
Body: { estado: 'aprobada' }
```

---

## ❌ 3. Rechazar Justificación

### Acceso
- **Desde**: Modal de detalles (botón ojo)
- **Requisito**: Estado PENDIENTE
- **Botón**: Rojo con icono ✕

### Flujo de Rechazo (2 pasos)
```
Paso 1: Click en [✕ Rechazar]
┌─────────────────────────────┐
│ Motivo del Rechazo          │
│ [Explica por qué...]        │
│                             │
│  [Cancelar] [Confirmar]     │
└─────────────────────────────┘

Paso 2: Click en [Confirmar Rechazo]
- Validación: Motivo no vacío
- Actualización en BD
- Estado: RECHAZADA
- Campo: observaciones (motivo)
- Recarga automática
- Toast: "✗ Justificación rechazada"
```

### Backend Endpoint
```
PUT /api/excusas/:id
Body: {
  estado: 'rechazada',
  observaciones: 'Motivo del rechazo...'
}
```

### Visualización de Rechazo
En el modal, aparece sección especial en ROJO:
```
┌─────────────────────────────────────────┐
│ ❌ MOTIVO DEL RECHAZO                   │
├─────────────────────────────────────────┤
│ "No cumple con los requisitos solicitados" │
└─────────────────────────────────────────┘
```

---

## 🎯 4. Modal de Detalles Mejorado

### Estructura Nueva
```
Header:
  👁️ Detalles de Justificación  [✕]

Sección 1: Información de Persona
  [Foto 24x24]  Juan Pérez García
                6to Básico A
                Carnet: A-2026001

Sección 2: Información de Ausencia (Grid 2 cols)
  Fecha: 25/01/2026    Estado: [Pendiente]

Sección 3: Motivo
  [Cita médica en caja gris]

Sección 4: Descripción (si existe)
  [Detalles adicionales...]

Sección 5: Evidencia (si existe)
  📄 [Ver Documento] (link)

Sección 6: Motivo Rechazo (si RECHAZADA)
  [Motivo en caja ROJA]

Sección 7: Botones de Acción (si PENDIENTE)
  [✓ Aprobar] [✕ Rechazar] [Cerrar]

Footer (si RECHAZADA/APROBADA):
  [Cerrar]
```

### Botones de Acción
**Solo aparecen si estado es PENDIENTE**

| Botón | Color | Icono | Acción |
|-------|-------|-------|--------|
| Aprobar | Verde | ✓ | Cambia a APROBADA |
| Rechazar | Rojo | ✕ | Abre formulario |
| Cerrar | Gris | — | Cierra modal |

### Estados Visuales
- **Pendiente**: Badge naranja
- **Aprobada**: Badge verde
- **Rechazada**: Badge rojo + sección motivo

---

## 📊 Flujos de Uso

### Caso 1: Registrar Justificación Exitosa
```
1. Click "+ Registrar Justificación"
2. Selecciona: Alumno → "Juan Pérez" → 25/01/2026
3. Motivo: "Cita médica"
4. Adjunta receta médica (PDF)
5. Click [Registrar Justificación]
6. ✓ Toast: "Justificación registrada correctamente"
7. Panel recarga, nueva excusa aparece con estado PENDIENTE
```

### Caso 2: Intentar Duplicado
```
1. Intenta registrar otra para "Juan" el 25/01/2026
2. Backend: Busca justificación existente
3. Encuentra: Estado PENDIENTE o APROBADA
4. Respuesta 409:
   ❌ "Esta alumno/a ya tiene una justificación 
       pendiente para esta fecha"
5. Toast error en frontend
6. Modal permanece abierto para corregir
```

### Caso 3: Aprobar Justificación
```
1. Click ojo en tabla
2. Modal muestra todos los detalles
3. Click [✓ Aprobar]
4. Estado cambia: PENDIENTE → APROBADA
5. Botones desaparecen (solo CERRAR)
6. ✓ Toast: "Justificación aprobada"
7. Panel recarga, fila se actualiza
```

### Caso 4: Rechazar Justificación
```
1. Click ojo en tabla
2. Modal muestra detalles
3. Click [✕ Rechazar]
4. Aparece textarea: "Motivo del Rechazo"
5. Ingresa: "Documentación incompleta"
6. Click [Confirmar Rechazo]
7. Estado cambia: PENDIENTE → RECHAZADA
8. Se guarda observaciones
9. ✗ Toast: "Justificación rechazada"
10. Modal muestra sección ROJA con motivo
```

---

## 🔒 Validaciones y Seguridad

### Validación de Duplicados
```javascript
// Por persona + fecha
- Persona ID debe ser válido
- Fecha debe estar en formato YYYY-MM-DD
- Solo bloquea PENDIENTE/APROBADA
- RECHAZADA permite nuevo registro
```

### Validación de Archivos
```javascript
- MIME types: image/*, application/pdf
- Tamaño máximo: 5MB
- Nombre único: evidencia-{timestamp}.{ext}
- Directorio: /uploads/justificaciones/
```

### Validación de Permisos
```javascript
- Todas las rutas requieren verifyJWT
- Futuro: Restricción por rol (director, docente, admin)
```

---

## 📁 Archivos Modificados

### Backend
**`backend/routes/excusas.js`**
- ✅ POST / : Agregar validación de duplicados
- ✅ PUT / : Ya existía aprobación/rechazo
- ✅ DELETE / : Ya existía eliminación

### Frontend
**`frontend/src/components/JustificacionesPanel.jsx`**
- ✅ Importar `Plus`, `Upload` de lucide-react
- ✅ Estados: `mostrarModalCrear`, `formCrear`, `alumnos`, `personal`
- ✅ useEffect: Cargar alumnos/personal cuando se abre modal
- ✅ Función: `handleCrearJustificacion()`
- ✅ Componente: `ModalCrearJustificacion`
- ✅ Mejorado: `ModalDetalles` con botones de acción
- ✅ Header: Botón "+ Registrar Justificación"

---

## 🧪 Testing Manual

### Test 1: Crear justificación
```bash
# Pre: Alumno "Juan Pérez" ID=1 sin justificaciones
1. Click "+ Registrar Justificación"
2. Alumno → Juan Pérez
3. Fecha: Hoy
4. Motivo: "Cita médica"
5. Click [Registrar]
✓ Debe aparecer en tabla con estado PENDIENTE
```

### Test 2: Duplicado
```bash
# Pre: Ya existe justificación para Juan el 25/01
1. Click "+ Registrar Justificación"
2. Mismos datos
3. Click [Registrar]
✗ Error 409: "Ya tiene una justificación..."
```

### Test 3: Aprobar
```bash
# Pre: Justificación PENDIENTE visible
1. Click ojo (Ver detalles)
2. Click [✓ Aprobar]
✓ Estado cambia a APROBADA
✓ Botones desaparecen
```

### Test 4: Rechazar
```bash
# Pre: Otra justificación PENDIENTE
1. Click ojo
2. Click [✕ Rechazar]
3. Escribe: "Documentación faltante"
4. Click [Confirmar]
✓ Estado: RECHAZADA
✓ Motivo visible en rojo
✓ Puede registrar nueva para la misma fecha
```

---

## 🔄 Integración con Asistencia

**Similar a**: Regla de asistencia (1 entrada + 1 salida máximo)

**Justificaciones**: Una por persona y fecha (hasta aprobación)

**Diferencia**: 
- Asistencia: Un registro/día
- Justificación: Una pendiente o aprobada/día (rechazadas no bloquean)

---

## 🎨 Estilos y Colores

### Botones
- **Crear**: Azul (`bg-blue-600`)
- **Aprobar**: Verde (`bg-green-600`)
- **Rechazar**: Rojo (`bg-red-600`)
- **Cerrar/Cancelar**: Gris (`bg-gray-400`)

### Estados Badge
- **Pendiente**: Naranja (`bg-orange-100`)
- **Aprobada**: Verde (`bg-green-100`)
- **Rechazada**: Rojo (`bg-red-100`)

### Campos Requeridos
- Label con asterisco `*`
- Border rojo en error
- Validación en submit

---

## 📈 Funcionalidades Futuras

1. **Notificaciones automáticas** a padres/tutores cuando se rechaza
2. **Reporte de rechazos** por motivo más común
3. **Flujo de apelación** si se rechaza una justificación
4. **Integración con email** para notificar cambios
5. **Historial completo** de cambios por justificación
6. **Búsqueda avanzada** por tipo de motivo

---

## ✨ Resumen de Beneficios

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Registrar** | ❌ No | ✅ Sí |
| **Aprobar** | ✅ Parcial | ✅ Completo |
| **Rechazar** | ✅ Parcial | ✅ Con motivo |
| **Validar duplicados** | ❌ No | ✅ Sí |
| **Archivos** | ✅ Soporta | ✅ Visualiza |
| **UX Modal** | 📊 Datos | 📋 Datos + Acciones |

---

**Versión**: 3.0  
**Build**: ✅ Sin errores (3077 módulos)  
**Commits**: `9cde9ce`  
**Status**: 🚀 Listo para Producción
