# 🚀 SAE v1.1.9 - Mobile Scanner PWA & Mejoras Core

> **⚠️ AVISO IMPORTANTE SOBRE MIGRACIÓN DE DATOS:** La versión 1.1.7 fue la última con soporte automático para reparar bases de datos de versiones obsoletas. A partir de la versión 1.1.8 en adelante, el sistema utiliza un nuevo esquema estable (Safe-Migrate) que protege los datos contra corrupción, pero ya no intentará rescatar esquemas incompatibles muy antiguos. Tus datos desde la 1.1.8 en adelante están garantizados para mantenerse íntegros en futuras actualizaciones.

---

## ✨ Novedades Principales

### 📱 Soporte Offline Completo para Mobile Scanner (PWA)
El lector web del celular ahora es una verdadera **Progressive Web App (PWA)** que no depende de conexión constante:
- **Funciona 100% sin internet** o cuando se cae la red local del colegio.
- Guarda los escaneos en una cola interna segura (IndexedDB) de forma transparente.
- Sincroniza automáticamente todos los registros acumulados hacia la PC en el instante que recupera la conexión.
- Nueva interfaz visual dinámica que te indica si el dispositivo está `EN LÍNEA` o `SIN CONEXIÓN`, mostrando exactamente cuántos registros locales están pendientes de envío.
- Soporte nativo para instalarse como una App en la pantalla de inicio de tu celular (Android/iOS).

### 📄 Reportes Nativos en Móvil (PDF & Excel)
Se reescribió por completo el motor de exportación en la versión móvil para que genere los **mismos archivos profesionales** que la versión de escritorio:
- Ahora el celular genera documentos PDF (con `jsPDF`) y hojas de Excel (con `ExcelJS`) idénticos a los de la PC.
- Mantiene los colores institucionales, el ancho de columnas, membretes y marca de celdas rojas para las tardanzas.
- El archivo se descarga directamente al dispositivo sin necesidad de usar vistas de impresión genéricas.

### 🌐 Conexión Dinámica y Vinculación Remota
- **Soporte para Túneles Remotos:** En el panel de "Equipos", la opción "Vincular Celular" ahora permite introducir una URL externa (ideal para Cloudflare Tunnels o Tailscale).
- El código QR se actualiza en tiempo real, permitiendo a los docentes escanear y conectarse al sistema SAE desde cualquier parte del mundo.
- El puerto local HTTPS ahora se auto-calcula dinámicamente (`Puerto Actual + 1`), evitando crasheos de conexión al cambiar de puertos en la configuración.

### 🔄 Regeneración Automática de Códigos QR
- Al actualizar el logotipo institucional en Configuración, el sistema ahora lanza automáticamente un proceso en segundo plano (background) para **regenerar masivamente todos los códigos QR** de los alumnos y el personal para que incluyan el nuevo logo en el centro.
- El proceso es ultra-rápido y no bloquea la aplicación.

### 🎨 Mejoras Visuales
- Corrección del tamaño y alineamiento de la barra de navegación inferior en el Mobile Scanner para que quede perfectamente centrada y responsiva en cualquier tamaño de pantalla.

---

## 📦 Instalación

Descarga el instalador que prefieras:
- **`SAE-1.1.9-Setup.exe`** — Instalador recomendado. Instalará el sistema en tu PC y creará los accesos directos.
- **`SAE - Sistema de Administración Educativa 1.1.9.exe`** — Versión Portable. Solo haz doble clic y ejecútalo sin instalar.

**¿Actualizando desde la versión 1.1.8?**  
Simplemente instala encima. Tu base de datos y toda tu información se mantendrán completamente intactas.
