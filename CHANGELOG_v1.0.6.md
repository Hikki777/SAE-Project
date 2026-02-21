# Changelog v1.0.6

## 🚀 Actualizaciones y Mejoras

### 🐛 Correcciones de Errores (Bug Fixes)
- **Generador de Reportes (PDF/Excel):** Se corrigió un problema donde los logos de la institución y de la aplicación no se adjuntaban en los reportes de Justificaciones. Ahora se descargan en Base64 previos a la inserción, emparejando el comportamiento con los reportes de Asistencia.
- **UI del Modal de Justificaciones:** Se forzó el `z-index` del Modal de Justificaciones Rápidas (`z-[9999]`) para que se dibuje correctamente por encima de la barra de navegación que antes cortaba visualmente el diseño y generaba una línea blanca indeseada.
- **Adjuntar Evidencias (Axios Interception):** Se solucionó un bug global donde Axios forzaba cabeceras `application/json` rompiendo la subida de archivos (Evidencias). Se implementó un interceptor en `client.js` para eliminar el `Content-Type` forzado al enviar formatos `FormData` permitiendo la generación de límites de `multipart/form-data` automáticos desde el navegador.
- **Corrije Enlace de Evidencias de Localhost:** Se reemplazó una URL antigua que dirigía a `http://localhost:5000/uploads/...` por el enrutador dinámico `${BASE_URL}` asegurando que las fotos de justificaciones puedan visualizarse en entornos de red locales y de producción.
- **Filtrado de Kanban y Fechas "Cacheadas":** 
  - Se corrigió el filtrado inicial del Panel de Justificaciones para que por defecto cargue `rangoRapido: 'hoy'` con base en la fecha y zona horaria puramente local de la computadora en lugar de utc.
  - Se arregló un bug de estado temporal en `JustificacionesPanel.jsx` que ignoraba los cambios en el filtro de "Estado" por referenciar variables indefinidas.
  - Se eliminó el uso de una fecha bloqueada en el caché (`sessionStorage`) que provocaba que las nuevas justificaciones procesadas en el Kanban adquirieran una fecha errónea de los días siguientes provocando falsas justificaciones faltantes, limpiando así la lógica para las fechas futuras.

### 💄 UI y Estética
- **Versión del Sistema (Dashboard/Configuración):** Se actualizaron las etiquetas visuales para la versión del sistema de "SAE v1.5.0" a la correcta y oficial "SAE v1.0.6".
