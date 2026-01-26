# 🔧 REPARACIÓN DEL PANEL DE JUSTIFICACIONES

## Problema Identificado
El panel "Justificaciones" no estaba mostrando los datos reales del sistema (mostraba 0 ausentes cuando había 3 justificaciones registradas).

## Causas Raíz

### 1. **Frontend - Bucle Infinito en useEffect**
El componente tenía una dependencia cíclica que causaba re-renders infinitos:
```javascript
useEffect(() => {
  if (!filtros.fechaInicio && !filtros.fechaFin) {
    handleRangoRapido('hoy'); // Esto modifica filtros
  } else {
    cargarDatos();
  }
}, [filtros]); // Dependía de filtros que acababa de modificar
```

### 2. **Frontend - Problema de Cálculo de Estadísticas**
Las estadísticas se calculaban solo sobre los datos filtrados, pero debería contar TODAS las excusas en el rango de fechas sin importar el estado.

### 3. **Frontend - Problema de Zona Horaria**
El cálculo de fechas usaba `getUTCFullYear()` y `getUTCMonth()` cuando debería usar los métodos locales, causando desajustes en la comparación de fechas.

### 4. **Backend - Campo Incorrecto en OrderBy**
El endpoint usaba `orderBy: { fecha: 'desc' }` cuando debería usar `ordenBy: { fecha_ausencia: 'desc' }`.

### 5. **Backend - Interpretación de Fechas**
La interpretación de fechas YYYY-MM-DD no consideraba correctamente la zona horaria local.

## Soluciones Aplicadas

### ✅ Frontend - Arreglado useEffect
Separé la inicialización del manejo de cambios en filtros:
```javascript
// Cargar datos iniciales
useEffect(() => {
  if (!inicializado) {
    // Establecer fecha de hoy
    setFiltros(prev => ({
      ...prev,
      rangoRapido: 'hoy',
      fechaInicio: formatDate(hoy),
      fechaFin: formatDate(hoy)
    }));
    setInicializado(true);
  }
}, []);

// Cargar datos cuando cambien los filtros
useEffect(() => {
  if (inicializado) {
    cargarDatos();
  }
}, [filtros.estado, filtros.busqueda, filtros.rol, filtros.fechaInicio, filtros.fechaFin]);
```

### ✅ Frontend - Reparado Cálculo de Estadísticas
Las estadísticas ahora se calculan sobre TODOS los datos cargados sin filtro de estado:
```javascript
const cargarDatos = async () => {
  // NO incluir estado en la búsqueda para estadísticas
  const response = await client.get(`/excusas?${params.toString()}`);
  const excusasData = response.data.excusas || [];
  
  // Calcular estadísticas globales
  calcularEstadisticas(excusasData);
  
  // Si hay filtro de estado, filtrar localmente para la tabla
  let excusasParaMostrar = excusasData;
  if (filtros.estado) {
    excusasParaMostrar = excusasData.filter(e => e.estado === filtros.estado);
  }
  setExcusas(excusasParaMostrar);
};
```

### ✅ Frontend - Normalización de Fechas Correcta
Ahora usa fechas locales en lugar de UTC:
```javascript
const normalizarFecha = (fechaStr) => {
  const fecha = new Date(fechaStr);
  // Usar hora local, no UTC
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0, 0);
};
```

### ✅ Backend - Arreglado orderBy
Cambió de `fecha` a `fecha_ausencia`:
```javascript
orderBy: { fecha_ausencia: 'desc' }
```

### ✅ Backend - Interpretación de Fechas Local
Ahora interpreta YYYY-MM-DD como hora local:
```javascript
if (fechaInicio) {
  const [year, month, day] = fechaInicio.split('-');
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  where.fecha_ausencia.gte = start;
}
```

### ✅ Frontend - Campo de Evidencia Arreglado
Cambió de `archivo_path` a `documento_url` en el modal de detalles.

## Resultados de Prueba

### Base de Datos (6 registros de prueba)
✅ **Ausentes Hoy:** 6 (de 6 registrados el 25/1/2026)
✅ **Semana:** 6
✅ **Mes:** 6
✅ **Pendientes:** 2 (filtro por estado funcionando)
✅ **Rechazadas:** 1

### Funcionalidades Reparadas
✅ Cálculo correcto de estadísticas por rango de fechas
✅ Separación correcta de filtros (tabla vs. estadísticas)
✅ Interpretación correcta de zonas horarias
✅ Sin bucles infinitos en el renderizado
✅ Tabla mostrando datos correctamente con filtros aplicados
✅ Modal de detalles funcionando correctamente

## Archivos Modificados

1. **frontend/src/components/JustificacionesPanel.jsx**
   - Reparada lógica de useEffect y dependencias
   - Mejorada función calcularEstadisticas
   - Agregado logging para debuggeo
   - Arreglado campo documento_url

2. **backend/routes/excusas.js**
   - Arreglado orderBy (fecha → fecha_ausencia)
   - Mejorada interpretación de fechas locales
   - Mejor manejo de rangos de fechas

## Scripts de Prueba Creados

1. **scripts/test-direct-query.js** - Verifica datos directamente en BD
2. **scripts/test-endpoint.js** - Simula la lógica del endpoint
3. **scripts/verificar-justificaciones.js** - Verificación completa del sistema
4. **scripts/crear-excusas-prueba.js** - Crea datos de prueba variados

## Cómo Usar

1. Abrir panel en: `http://localhost:5173/reportes/justificaciones`
2. Los números en las tarjetas deben coincidir con los datos registrados
3. Cambiar rangos (Hoy, Semana, Mes) actualiza correctamente las estadísticas
4. Los filtros avanzados funcionan sin afectar las estadísticas globales

## Validación

✅ Estadísticas correctas por rango de fechas
✅ Tabla mostrando registros con filtros aplicados
✅ Sin bucles infinitos de renderizado
✅ Manejo correcto de zonas horarias
✅ Datos coinciden entre BD y panel
