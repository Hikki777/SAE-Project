; ==============================================================
; SAE - Sistema de Administracion Educativa
; NSIS customization script para electron-builder
; Version: 1.1.0
; ==============================================================

; ──────────────────────────────────────────────────────────────
; HEADER: Configuracion global del instalador
; Se ejecuta antes de cualquier pagina o seccion
; ──────────────────────────────────────────────────────────────
!macro customHeader
  ShowInstDetails show
  ShowUninstDetails show
  BrandingText "SAE - Sistema de Administracion Educativa"
!macroend

; ──────────────────────────────────────────────────────────────
; INIT: Verificacion de permisos antes de mostrar el instalador
; ──────────────────────────────────────────────────────────────
!macro customInit
  ; Ya no se recomienda solicitar permisos de admin debido al modo oneClick y perUser
!macroend

; ──────────────────────────────────────────────────────────────
; INSTALL: Se ejecuta DESPUES de que Nsis7z extrae los archivos
; Aqui creamos los directorios de datos en AppData
; ──────────────────────────────────────────────────────────────
!macro customInstall
  SetDetailsPrint both

  DetailPrint ""
  DetailPrint "  Configurando entorno de datos..."
  DetailPrint ""

  ; Crear estructura de directorios en AppData
  DetailPrint "  $APPDATA\SAE"
  CreateDirectory "$APPDATA\SAE"
  CreateDirectory "$APPDATA\SAE\prisma"

  DetailPrint "  $APPDATA\SAE\uploads\"
  CreateDirectory "$APPDATA\SAE\uploads"
  CreateDirectory "$APPDATA\SAE\uploads\alumnos"
  CreateDirectory "$APPDATA\SAE\uploads\docentes"
  CreateDirectory "$APPDATA\SAE\uploads\directores"
  CreateDirectory "$APPDATA\SAE\uploads\personal"
  CreateDirectory "$APPDATA\SAE\uploads\justificaciones"
  CreateDirectory "$APPDATA\SAE\uploads\qr"
  CreateDirectory "$APPDATA\SAE\uploads\logos"
  CreateDirectory "$APPDATA\SAE\uploads\usuarios"

  DetailPrint "  $APPDATA\SAE\logs\"
  CreateDirectory "$APPDATA\SAE\backups"
  CreateDirectory "$APPDATA\SAE\logs"
  CreateDirectory "$APPDATA\SAE\temp"

  DetailPrint ""
  DetailPrint "  Directorios de datos configurados."
  DetailPrint ""
!macroend

; ──────────────────────────────────────────────────────────────
; INSTALL SUCCESS: Mensaje final al completar exitosamente
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
; INSTALL FAILED: Mensaje en caso de error
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
; UNINSTALL: Eliminar la aplicacion
; ──────────────────────────────────────────────────────────────
!macro customUninstall
  SetDetailsPrint both
  DetailPrint "Desinstalando SAE..."

  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 \
    "Desea eliminar tambien los datos guardados?$\n$\nEsto incluye la base de datos, fotos de alumnos y personal, reportes y backups almacenados en:$\n$\n$APPDATA\SAE$\n$\nSeleccione NO para conservar los datos (recomendado)." \
    /SD IDNO IDNO customUninstall_skip

  DetailPrint "Eliminando datos de la aplicacion..."
  RMDir /r "$APPDATA\SAE"
  DetailPrint "Datos de la aplicacion eliminados."

  customUninstall_skip:
  DetailPrint "Desinstalacion completada."
!macroend

!macro customUninstallSuccess
  DetailPrint ""
  DetailPrint "SAE ha sido desinstalado correctamente."
  DetailPrint ""
!macroend
