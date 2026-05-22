# Changelog — SAE Sistema de Administración Educativa

Todos los cambios notables de este proyecto están documentados en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
versionado según [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.9] — 2026-05-22

### Corregido
- **Soporte Offline (PWA) para Mobile Scanner** (`mobile-scanner.html`, `sw.js`, `manifest.json`): El lector web ahora es una Progressive Web App completa. 
  - Funciona 100% sin conexión a internet o cuando se cae la red local (guardando en IndexedDB).
  - Sincroniza automáticamente los registros acumulados al recuperar la conexión.
  - Añadido soporte para instalarse como una app nativa en la pantalla de inicio del celular.
- **URL Dinámica para Vinculación Celular** (`frontend/src/components/ConfiguracionPanel.jsx`): En el panel de "Equipos", la opción "Vincular Celular" ahora permite introducir una URL externa (Cloudflare/Tailscale). El QR se actualiza en tiempo real, permitiendo acceso remoto. Además, el puerto local HTTPS ahora se calcula dinámicamente (`Puerto Actual + 1`) evitando fallos al cambiar de puerto.
- **Regeneración automática de QRs al cambiar logo** (`backend/routes/institucion.js`, `backend/services/qrService.js`): Al actualizar el logo institucional mediante `PUT /api/institucion`, el sistema ahora lanza automáticamente en background la regeneración masiva de todos los códigos QR.
- **Navegación centrada en Mobile Scanner** (`mobile-scanner.html`): Se corrigió el alineado y tamaño de los ítems de navegación de la barra inferior para que queden correctamente centrados en pantallas móviles.

### Refactorizado
- **Script `backend/scripts/regenerate-qrs.js`**: Simplificado para delegar en `qrService.regenerarTodosLosQrs()`, eliminando código duplicado. Ambas rutas de regeneración (manual vía script y automática vía API) usan ahora exactamente la misma lógica.
- **`qrService.regenerarTodosLosQrs(logoFuenteParam?)`**: Nueva función exportada que encapsula la regeneración masiva. Acepta un parámetro opcional de logo para reutilizar la fuente recién actualizada sin una segunda consulta a la BD.

---

## [1.1.8] — 2026-05-19

### Añadido
- **Descarga de Certificado SSL** (`GET /api/certs/download`): Nuevo endpoint para descargar el certificado SSL auto-firmado del servidor directamente en celulares, facilitando la validación del protocolo HTTPS necesario para activar la cámara sin servidores externos.
- **Reportes PDF y Excel en Móvil**: En la pestaña de Reportes de `mobile-scanner.html`, se reemplazó la descarga simple en formato CSV por dos nuevas opciones:
  - **PDF**: Abre una ventana de impresión limpia con layout profesional adaptado para imprimir o guardar.
  - **Excel**: Generación local multi-hoja (Registros y Resumen) utilizando la librería SheetJS (XLSX).

### Modificado
- **Sincronización en Tiempo Real Celular → PC** (`backend/routes/asistencias.js`): Se trasladó la responsabilidad de notificar los cambios de asistencia al servidor. Al registrarse una asistencia mediante la API, el backend emite automáticamente el evento `broadcastDataChange` a la red por WebSockets, garantizando que el panel en PC se actualice instantáneamente aunque el socket del celular se desconecte temporalmente.
- **Lógica de Audio en Móvil**:
  - Acordes acústicos mejorados en `mobile-scanner.html` (éxito en do-mi-sol, error descendente, y doble ping para duplicados/advertencias) idénticos a los del frontend en PC.
  - El desbloqueo del AudioContext ahora se realiza ante cualquier toque o clic en la pantalla, asegurando la reproducción de sonidos tanto en modo de escaneo con cámara como en registro de búsqueda manual.
- **Instrucciones HTTPS**: Panel de advertencia en `mobile-scanner.html` rediseñado con instrucciones paso a paso para Android, iOS y Chrome Flags para agilizar el despliegue del lector QR local.

---

## [1.1.7] — 2026-05-06

### Añadido
- **App Móvil de Lector QR** (`mobile-scanner.html`): Nueva interfaz standalone accesible desde la red local para lectura de carnets mediante la cámara del celular.
  - Conexión vía websockets (`/client`) para notificar a toda la red en tiempo real.
  - Parseo del formato JSON del QR nativo.
- **Sincronización de versión frontend**: El `frontend/package.json` ahora siempre se actualiza en conjunto con el `package.json` raíz para garantizar que `__APP_VERSION__` refleje la versión correcta en toda la UI.

### Modificado
- **Puertos y Red Local (Electron)**: El sistema ahora utiliza una estrategia de "puerto preferido" (5123) con fallback a puerto dinámico. El backend escucha en `0.0.0.0` para permitir pruebas multi-equipo en la red local.
- **Progreso del Instalador** (`package.json`, `installer.nsh`): Se modificó la configuración `oneClick` a `false` de electron-builder para garantizar que NSIS muestre la barra de progreso y los logs durante la pesada extracción del ASAR, mejorando significativamente la UX durante la instalación.
- **Limpieza de Instalador** (`installer.nsh`): El instalador ahora limpia proactivamente los accesos directos remanentes de versiones antiguas en el escritorio y menú de inicio antes de generar los nuevos.
- **CORS para Desarrollo**: Se agregaron reglas Regex para aceptar conexiones desde IPs de la red local (`192.168.x.x` y `10.x.x.x`) para facilitar el debugging de WebSocket.
- **Parches de consistencia de base de datos** (`backend/scripts/repair_db_consistency.js`): Script de reparación reforzado para detectar y corregir inconsistencias. Se ha marcado como **deprecated** (v1.1.7 es la última versión que soportará parcheo automático de bases de datos pre-1.1.7).
- **Bootstrap de base de datos** (`backend/db/bootstrap.js`): Se añadió un aviso de deprecación al sistema de reparaciones legacy.

### Corregido
- **Versión desincronizada en frontend**: `frontend/package.json` estaba en `1.1.5` mientras el sistema ya iba en `1.1.6`, lo que causaba que `__APP_VERSION__` mostrara una versión incorrecta en la UI (Dashboard, Acerca de, sidebar).


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

[1.1.8]: https://github.com/Hikki777/SAE-Project/compare/v1.1.7...v1.1.8
[1.1.7]: https://github.com/Hikki777/SAE-Project/compare/v1.1.6...v1.1.7
[1.1.6]: https://github.com/Hikki777/SAE-Project/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/Hikki777/SAE-Project/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/Hikki777/SAE-Project/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/Hikki777/SAE-Project/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/Hikki777/SAE-Project/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Hikki777/SAE-Project/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Hikki777/SAE-Project/releases/tag/v1.1.0
