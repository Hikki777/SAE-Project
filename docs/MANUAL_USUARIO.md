# 📖 Manual de Usuario - Sistema de Registro Institucional

**Versión:** 1.0.6  
**Fecha:** 20 de Febrero, 2026

Bienvenido al Manual de Usuario. Este documento te guiará para sacar el máximo provecho al sistema de control de asistencia.

---

## 1. 🚀 Primeros Pasos

### Acceso al Sistema
Tienes dos formas de usar el sistema:
1.  **Aplicación de Escritorio (Recomendado):** Ejecuta el icono "Sistema de Registro Institucional" en tu escritorio.
2.  **Navegador Web:** Abre Chrome o Edge e ingresa a `http://localhost:5173`.

### Asistente de Configuración (Setup Wizard)
La primera vez que abras el sistema, verás una pantalla de bienvenida. Sigue los pasos para:
1.  Elegir si este equipo es el **Servidor** (Principal) o un **Cliente**.
2.  Ingresar el nombre y logo de tu institución.
3.  Crear la cuenta del Administrador principal.

---

## 2. 📱 Módulos del Sistema

### 🏠 Dashboard (Inicio)
Tu centro de control. Aquí verás:
-   Resumen de asistencias del día (Presentes, Tarde, Ausentes).
-   Gráficas de puntualidad en tiempo real.
-   Accesos rápidos a las funciones más usadas.

### 👩‍🎓 Alumnos
Gestiona el expediente de tus estudiantes:
-   **Crear:** Registra nuevos alumnos con sus datos, foto y grado.
-   **Carnet:** El sistema genera automáticamente un **Carnet con código QR** listo para imprimir.
-   **Historial:** Consulta todas las asistencias de un alumno específico.

### 👔 Personal
Similar al módulo de alumnos, pero para docentes y administrativos. Permite controlar sus jornadas laborales y asistencia.

### 📅 Asistencias (Scanner)
El corazón del sistema.
-   **Modo Escáner:** Usa la cámara web o un lector USB para leer los códigos QR. El sistema registrará la entrada/salida y dirá el nombre en voz alta.
-   **Modo Manual:** Si un alumno olvidó su carnet, búscalo por nombre y registra su asistencia manualmente.

### 📝 Justificaciones (Excusas) **¡NUEVO!**
Gestiona las ausencias justificadas:
-   Registra excusas por enfermedad, citas médicas o asuntos familiares.
-   Adjunta comprobantes (opcional).
-   Las ausencias justificadas no afectarán negativamente el récord del alumno.

### 📊 Reportes
Genera información valiosa para la toma de decisiones:
-   **Por Fecha:** Lista de asistencia de un día específico.
-   **Por Rango:** Asistencias de una semana o mes.
-   **Formatos:** Descarga en Excel (.xlsx) o PDF.

### ⚙️ Configuración
Solo para administradores:
-   **Institución:** Cambia el nombre, logo, horarios y márgenes de tolerancia.
-   **Usuarios:** Crea cuentas para otros operadores (secretarias, auxiliares).
-   **Sistema:** Realiza copias de seguridad (Backups) y restaura datos.

---

## 3. 🛡️ Mantenimiento y Seguridad

### Copias de Seguridad (Backups)
El sistema realiza backups automáticos antes de cada actualización. También puedes crear backups manuales desde:
`Configuración > Sistema > Crear Respaldo`.  
Guarda el archivo `.bak` descargado en un lugar seguro (USB o Nube).

### Actualizaciones
Para mantener el sistema al día con las últimas mejoras, el encargado técnico puede ejecutar el script de actualización. El sistema se encargará de proteger tus datos.

---

## 4. ❓ Preguntas Frecuentes

**¿Qué pasa si se va la luz o internet?**
El sistema guarda los datos en el equipo localmente. Si usas una laptop, seguirá funcionando con batería. La conexión a Internet NO es necesaria para operar, solo red local (WiFi) si tienes otras computadoras conectadas.

**¿Cómo recupero mi contraseña?**
Solo el Administrador Principal puede restablecer contraseñas. Contacta con dirección.

**¿Puedo usar el sistema en mi celular?**
Sí. Si estás conectado a la misma red WiFi que el servidor, abre el navegador de tu celular e ingresa la dirección IP del servidor (ej. `http://192.168.1.10:5173`).

---

**Soporte Técnico**  
Si encuentras algún error, escribe un correo a <kevinprz777@gmail.com>
