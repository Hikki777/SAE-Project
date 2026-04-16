; ==============================================================
; SAE - Sistema de Administracion Educativa
; NSIS customization script para electron-builder
; Version: 1.2.0 - Proteccion de datos en actualizaciones
; ==============================================================

; ──────────────────────────────────────────────────────────────
; HEADER: Configuracion global del instalador
; ──────────────────────────────────────────────────────────────
!macro customHeader
  ShowInstDetails show
  ShowUninstDetails show
  BrandingText "SAE - Sistema de Administracion Educativa"
!macroend

; ──────────────────────────────────────────────────────────────
; INIT: Verificacion de permisos
; ──────────────────────────────────────────────────────────────
!macro customInit
  ; No se solicitan permisos de admin: modo oneClick perUser
!macroend

; ──────────────────────────────────────────────────────────────
; INSTALL: Se ejecuta DESPUES de que Nsis7z extrae los archivos.
;
; *** REGLA CRITICA DE PRESERVACION DE DATOS ***
; Este bloque NUNCA debe borrar $APPDATA\SAE\prisma\dev.db.
; CreateDirectory es idem-potente: no hace nada si la carpeta ya existe.
; Si dev.db ya existe, Electron aplicara las migraciones al arrancar.
; Si dev.db NO existe (primera instalacion), Electron la crea desde virgin.db.
; ──────────────────────────────────────────────────────────────
!macro customInstall
  SetDetailsPrint both

  DetailPrint ""
  DetailPrint "  Verificando entorno de datos SAE..."
  DetailPrint ""

  ; Crear estructura de directorios (solo si no existen — CreateDirectory es no-destructivo)
  DetailPrint "  Directorios en $APPDATA\SAE"
  CreateDirectory "$APPDATA\SAE"
  CreateDirectory "$APPDATA\SAE\prisma"
  CreateDirectory "$APPDATA\SAE\uploads"
  CreateDirectory "$APPDATA\SAE\uploads\alumnos"
  CreateDirectory "$APPDATA\SAE\uploads\docentes"
  CreateDirectory "$APPDATA\SAE\uploads\directores"
  CreateDirectory "$APPDATA\SAE\uploads\personal"
  CreateDirectory "$APPDATA\SAE\uploads\justificaciones"
  CreateDirectory "$APPDATA\SAE\uploads\qr"
  CreateDirectory "$APPDATA\SAE\uploads\logos"
  CreateDirectory "$APPDATA\SAE\uploads\usuarios"
  CreateDirectory "$APPDATA\SAE\backups"
  CreateDirectory "$APPDATA\SAE\logs"
  CreateDirectory "$APPDATA\SAE\temp"

  ; Verificar si ya existe la base de datos e informar al usuario
  ${If} ${FileExists} "$APPDATA\SAE\prisma\dev.db"
    DetailPrint ""
    DetailPrint "  [OK] Base de datos existente detectada."
    DetailPrint "       Los datos del usuario seran preservados."
    DetailPrint "       Las actualizaciones de esquema se aplicaran al primer arranque."
    DetailPrint ""
  ${Else}
    DetailPrint ""
    DetailPrint "  [INFO] Primera instalacion: la BD se inicializara al primer arranque."
    DetailPrint ""
  ${EndIf}

  DetailPrint "  Entorno de datos configurado correctamente."
  DetailPrint ""
!macroend

; ──────────────────────────────────────────────────────────────
; INSTALL SUCCESS
; ──────────────────────────────────────────────────────────────
!macro customInstallSuccess
  SetDetailsPrint both
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   Instalacion completada exitosamente"
  DetailPrint "  ================================================"
  DetailPrint ""
  DetailPrint "   SAE instalado correctamente."
  DetailPrint "   Datos de la aplicacion en: %APPDATA%\SAE\"
  DetailPrint ""
  DetailPrint "   Puede iniciar SAE desde el acceso directo"
  DetailPrint "   del escritorio o desde el menu Inicio."
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint ""
!macroend

; ──────────────────────────────────────────────────────────────
; INSTALL FAILED
; ──────────────────────────────────────────────────────────────
!macro customInstallFailed
  SetDetailsPrint both
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   ERROR: La instalacion no se completo"
  DetailPrint "  ================================================"
  DetailPrint "   Intente ejecutar el instalador como"
  DetailPrint "   Administrador e intentelo de nuevo."
  DetailPrint "  ================================================"
  DetailPrint ""
!macroend

; ──────────────────────────────────────────────────────────────
; UNINSTALL: Solo se ejecuta en desinstalacion MANUAL.
; En actualizaciones automaticas (oneClick), electron-builder
; usa el flag /S que activa /SD IDNO => NO borrar datos.
; ──────────────────────────────────────────────────────────────
!macro customUninstall
  SetDetailsPrint both

  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   Iniciando desinstalacion de SAE"
  DetailPrint "  ================================================"
  DetailPrint ""

  ; Cerrar procesos activos
  DetailPrint "  Cerrando procesos activos de SAE..."
  ExecWait 'taskkill /F /IM SAE.exe /T'
  ExecWait 'taskkill /F /IM node.exe /T'
  Sleep 2000

  ; Preguntar si borrar datos (respuesta silenciosa: NO = conservar datos)
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 \
    "Desea eliminar tambien todos los datos guardados?$\n$\nEsto incluye:$\n- Base de Datos (alumnos, personal, notas)$\n- Fotos y Logos subidos$\n- Backups y Reportes$\n- Logs del sistema$\n$\nNO conserva datos para reinstalacion futura.$\nSI hace limpieza TOTAL." \
    /SD IDNO IDNO customUninstall_skip

  DetailPrint "  Eliminando todos los datos de la aplicacion..."
  RMDir /r /REBOOTOK "$APPDATA\SAE"
  RMDir /r /REBOOTOK "$LOCALAPPDATA\SAE"
  DeleteRegKey HKCU "Software\SAE"
  DeleteRegKey HKCU "Software\sae-administracion-educativa"

  ${If} ${FileExists} "$LOCALAPPDATA\electron-cache"
    RMDir /r "$LOCALAPPDATA\electron-cache"
  ${EndIf}

  RMDir /r "$SMPROGRAMS\SAE"
  DetailPrint "  Datos eliminados completamente."
  Goto customUninstall_finish

  customUninstall_skip:
  DetailPrint ""
  DetailPrint "  Datos conservados en: $APPDATA\SAE"
  DetailPrint ""

  customUninstall_finish:
  DetailPrint "  Removiendo archivos de la aplicacion..."
!macroend

!macro customUninstallSuccess
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint ""
  MessageBox MB_ICONINFORMATION|MB_OK \
    "SAE ha sido desinstalado correctamente de este equipo."
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint ""
!macroend
