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

  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   Iniciando desinstalacion de SAE"
  DetailPrint "  ================================================"
  DetailPrint ""

  DetailPrint "  Detectando archivos y directorios a eliminar..."
  DetailPrint ""

  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON1 \
    "Desea eliminar tambien los datos guardados?$\n$\nEsto incluye la base de datos, fotos de alumnos y personal, reportes y backups almacenados en:$\n$\n$APPDATA\SAE$\n$\nSeleccione SI para eliminar completamente todos los datos (recomendado)." \
    /SD IDYES IDNO customUninstall_skip

  DetailPrint ""
  DetailPrint "  Eliminando datos de la aplicacion..."
  DetailPrint "  - Removiendo base de datos y archivos de datos..."
  RMDir /r "$APPDATA\SAE"
  DetailPrint "    ✓ Directorio $APPDATA\SAE eliminado"

  DetailPrint ""
  DetailPrint "  - Limpiando archivos temporales..."
  RMDir /r "$LOCALAPPDATA\SAE"
  DetailPrint "    ✓ Directorio $LOCALAPPDATA\SAE eliminado"

  DetailPrint ""
  DetailPrint "  - Eliminando cache de aplicacion..."
  ${If} ${FileExists} "$LOCALAPPDATA\electron-cache"
    RMDir /r "$LOCALAPPDATA\electron-cache"
    DetailPrint "    ✓ Cache de Electron eliminado"
  ${EndIf}

  DetailPrint ""
  DetailPrint "  - Removiendo accesos directos..."
  RMDir /r "$SMPROGRAMS\SAE"
  DetailPrint "    ✓ Accesos directos removidos"

  DetailPrint ""
  DetailPrint "  Datos de la aplicacion eliminados completamente."
  DetailPrint ""
  Goto customUninstall_finish

  customUninstall_skip:
  DetailPrint ""
  DetailPrint "  Conservando datos de la aplicacion."
  DetailPrint "  Los datos permaneceren en: $APPDATA\SAE"
  DetailPrint ""

  customUninstall_finish:
  DetailPrint "  Removiendo archivos de la aplicacion..."
  DetailPrint "  - Eliminando componentes instalados..."
!macroend

!macro customUninstallSuccess
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   Desinstalacion completada exitosamente"
  DetailPrint "  ================================================"
  DetailPrint ""
  DetailPrint "   SAE ha sido removido correctamente del sistema."
  DetailPrint ""
  ${If} ${FileExists} "$APPDATA\SAE"
    DetailPrint "   NOTA: Algunos datos residuales aun existen en:"
    DetailPrint "   $APPDATA\SAE"
    DetailPrint ""
    DetailPrint "   Puede eliminarlos manualmente si lo desea."
  ${EndIf}
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint ""
!macroend
