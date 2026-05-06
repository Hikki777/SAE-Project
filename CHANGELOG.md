# Changelog — SAE Sistema de Administración Educativa

Todos los cambios notables de este proyecto están documentados en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
versionado según [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.1.6] — 2026-05-04

### Añadido
- **Modal de Migración de Ciclo Escolar** (`ModalMigracionCiclo.jsx`): nuevo componente visual que se dispara automáticamente al incrementar el año del ciclo escolar en Configuración → Institución.
  - Muestra estadísticas en tiempo real: alumnos activos, pendientes de migrar y ya migrados.
  - Lista expandible de promociones por transición (ej. `Primero Básico → Segundo Básico`).
  - Lista expandible de graduandos con carrera y grado.
  - Sección de alumnos con grado sin regla de promoción definida (requieren revisión manual).
  - Tres opciones: **Cancelar**, **Solo cambiar año**, **Migrar y cambiar año**.
  - Indicador de progreso con spinner durante la ejecución.
- **Endpoint `GET /api/migracion/estado`** (`backend/routes/promocion.js`): verifica el estado de migración de un ciclo dado y retorna preview completo compatible con el modal.
- **Servicio `estadoMigracion(anioEscolar)`** (`backend/services/promocionService.js`): calcula alumnos pendientes, ya migrados, resumen de transiciones y clasifica en promociones/graduaciones/sinRegla.
- **PWA Manifest** (`frontend/public/manifest.json`): soporte para "Agregar a pantalla de inicio" en Android y escritorio.

### Modificado
- **`ConfiguracionPanel.jsx`** — `handleSubmit` del formulario institucional:
  - Intercepta cambios de ciclo escolar hacia adelante.
  - Consulta `/api/migracion/estado` antes de guardar.
  - El modal aparece **siempre** que el año sube, mostrando estado verde (todo migrado) o ámbar (hay pendientes).
  - Guardado diferido: espera la decisión del modal antes de ejecutar el `PUT /api/institucion`.
- **`ControlAcademicoSettings`** (subcomponente interno de `ConfiguracionPanel`):
  - **Fix semántico**: el campo "Año Escolar Destino" → **"Ciclo a cerrar"** con valor por defecto = año actual (era `año + 1`).
  - **Unificado** al endpoint `/estado` eliminando dependencia del antiguo `/preview` (dos formatos incompatibles).
  - **Resumen post-migración**: tras ejecutar, muestra tarjetas animadas con totales de Promovidos / Graduados / Errores.
  - Indicador de estado (verde/ámbar) visible inmediatamente tras "Verificar Estado".
- **`frontend/index.html`**: meta tags PWA (`mobile-web-app-capable`, `apple-touch-icon`, `theme-color`, manifest link).
- **Logos e íconos del sistema** (`frontend/public/logo*.png`, `logo.ico`): actualizados a nueva identidad visual con variantes 32/64/128/256/512px e ICO multi-resolución.

### Corregido
- **Error de sintaxis** en `promocionService.js`: coma faltante al cierre de `getNivelDeGrado()` que impedía al servidor reconocer el nuevo método `estadoMigracion`.
- **Bug lógico**: el año enviado al endpoint de migración manual usaba `año actual + 1` como "destino", cuando debería registrar el historial del ciclo que **termina** (año actual).
- **Error 500 en Login (Bases de Datos Antiguas)**: Se parcheó la migración inicial en `backend/db/bootstrap.js` para asegurar que las columnas `username` e `inicializado` sean insertadas en la BD de los usuarios antiguos antes de la migración de Prisma, evitando crasheos de login.
- **Flujo Inesperado del SetupWizard**: Los usuarios de versiones anteriores eran forzados a inicializar la aplicación. Se añadió una verificación silenciosa que autoinicializa la plataforma si la BD legada ya tenía datos de admin.
- **Scrollbars Anormales en Login**: Se eliminó un desbordamiento gráfico producido por las animaciones en el fondo (`animate-blob`) en `App.jsx`.
- **Restauración del Administrador**: Corrección de una desincronización de variables (`identifier` vs `email`) en el endpoint de recuperación con llave maestra.
- **Instalador y Accesos Directos**: Se mantuvo la instalación rápida ("oneClick") pero ahora genera correctamente la carpeta en el menú de inicio (sin el acceso directo suelto extra) y utiliza los iconos del sistema actualizados (`logo.ico`). El SetupWizard ahora solo aparecerá tras finalizar la instalación *solo* si es una instalación nueva.

---

## [1.1.5] — 2026-04-28

### Añadido
- Migración de generación de QR de `canvas` nativo a pipeline SVG → PNG con `sharp` para compatibilidad total en Windows.
- Posicionamiento pixel-perfect de QR y texto en carnets impresos.

### Modificado
- Optimización del procesamiento de logo institucional para archivos de gran tamaño.
- Estrategias de gestión de procesos y cache-busting para despliegues consistentes.

### Corregido
- Estabilidad del backend en entornos Electron al generar carnets con QR.

---

## [1.1.4] — 2026-04-27

### Añadido
- Migración completa a UI oscura estilo SaaS con Glassmorphism y efectos Neon Glow.
- Dashboard con gráficas Recharts optimizadas para renderizado instantáneo.
- Panel "Acerca de" rediseñado con layout centrado y sincronización de hora corregida.

---

## [1.1.3] — 2026-04-21

### Añadido
- Allocación dinámica de puertos para eliminar colisiones de red en Electron.
- Integración del binario Node.js bundleado para entornos de producción.

### Corregido
- Flujo de autenticación: referencias de identificador corregidas en el login.
- Panel de configuración: campo `username` incluido, campo obsoleto `sexo` eliminado.

---

## [1.1.2] — 2026-04-17

### Corregido
- Corrección de errores de base de datos detectados en pruebas de integración.
- Estabilización del sistema de backup/restore con validación de integridad.

---

## [1.1.1] — 2026-04-15

### Modificado
- Refactorización de conectividad API dinámica para entornos multi-puerto.
- Estandarización de URLs base del cliente API.

---

## [1.1.0] — 2026-04-14

### Añadido
- Sistema de gestión de usuarios con roles (admin/operador).
- Dashboard de métricas y salud del sistema.
- Panel de control de equipos registrados.
- Generación de QR para carnets estudiantiles.
- Sistema de justificaciones con flujo Kanban.
- Backup y restauración cifrada de base de datos.

---

[1.1.6]: https://github.com/Hikki777/SAE-Project/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/Hikki777/SAE-Project/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/Hikki777/SAE-Project/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/Hikki777/SAE-Project/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/Hikki777/SAE-Project/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Hikki777/SAE-Project/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Hikki777/SAE-Project/releases/tag/v1.1.0
