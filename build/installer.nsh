; ==============================================================
; SAE - Sistema de Administracion Educativa
; NSIS customization script para electron-builder
; Version: 1.3.0 - Instalador mejorado con Setup Wizard y desinstalador con progreso
; ==============================================================

; ──────────────────────────────────────────────────────────────
; HEADER: Configuracion global del instalador
; ──────────────────────────────────────────────────────────────
!macro customHeader
  ShowInstDetails show
  ShowUninstDetails show
  BrandingText "SAE - Sistema de Administracion Educativa v${VERSION}"
!macroend

; ──────────────────────────────────────────────────────────────
; INIT: Verificacion y preparación
; ──────────────────────────────────────────────────────────────
!macro customInit
  ; Crear flag SETUP_REQUIRED que se pasara a la app
  SetRegView 64
  WriteRegStr HKCU "Software\SAE" "SetupRequired" "1"
!macroend

; ──────────────────────────────────────────────────────────────
; INSTALL: Se ejecuta DESPUES de que Nsis7z extrae los archivos.
; ──────────────────────────────────────────────────────────────
!macro customInstall
  SetDetailsPrint both

  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   SAE - Sistema de Administracion Educativa"
  DetailPrint "  ================================================"
  DetailPrint ""

  ; Crear estructura de directorios (solo si no existen)
  DetailPrint "  [1/4] Preparando entorno de datos..."
  DetailPrint ""
  DetailPrint "      → Creando directorios..."
  
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

  DetailPrint "      → Configurando permisos..."
  Sleep 500
  DetailPrint ""

  ; Verificar si existe BD anterior
  DetailPrint "  [2/4] Validando estado de datos..."
  DetailPrint ""
  
  ${If} ${FileExists} "$APPDATA\SAE\prisma\dev.db"
    DetailPrint "      ✓ Base de datos existente detectada"
    DetailPrint "      → Los datos serán preservados"
    DetailPrint "      → Migraciones se aplicarán al iniciar"
  ${Else}
    DetailPrint "      → Primera instalación detectada"
    DetailPrint "      → Se inicializará BD en primer arranque"
  ${EndIf}
  
  DetailPrint ""
  DetailPrint "  [3/4] Registrando aplicación..."
  Sleep 300
  DetailPrint ""

  ; LIMPIEZA: Eliminar accesos directos de versiones anteriores (evitar residuos al actualizar)
  DetailPrint "      -> Limpiando accesos directos de versiones anteriores..."
  Delete "$DESKTOP\SAE - Sistema de Administracion Educativa.lnk"
  Delete "$SMPROGRAMS\SAE - Sistema de Administracion Educativa\*.*"
  RMDir "$SMPROGRAMS\SAE - Sistema de Administracion Educativa"
  Delete "$SMPROGRAMS\SAE - Sistema de Administracion\*.*"
  RMDir "$SMPROGRAMS\SAE - Sistema de Administracion"
  DetailPrint "      V Accesos directos antiguos limpiados"

  DetailPrint ""
  DetailPrint "      -> Creando nuevos accesos directos..."
  
  ; Forzar creacion del acceso en Escritorio
  CreateShortCut "$DESKTOP\SAE.lnk" "$INSTDIR\SAE - Sistema de Administración Educativa.exe"
  
  ; Forzar creacion del acceso en Menu de Inicio
  CreateDirectory "$SMPROGRAMS\SAE"
  CreateShortCut "$SMPROGRAMS\SAE\SAE.lnk" "$INSTDIR\SAE - Sistema de Administración Educativa.exe"
  CreateShortCut "$SMPROGRAMS\SAE\Desinstalar SAE.lnk" "$INSTDIR\Uninstall SAE - Sistema de Administración Educativa.exe"

  DetailPrint "      V Accesos directos creados correctamente"

  DetailPrint ""

  DetailPrint "  [4/4] Finalizando..."
  Sleep 500
  
  ; Marcar como setup requerido
  WriteRegStr HKCU "Software\SAE" "NeedsSetup" "1"
  
  DetailPrint ""
!macroend

; ──────────────────────────────────────────────────────────────
; INSTALL SUCCESS
; ──────────────────────────────────────────────────────────────
!macro customInstallSuccess
  SetDetailsPrint both
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   ✓ Instalacion Exitosa"
  DetailPrint "  ================================================"
  DetailPrint ""
  DetailPrint "   SAE está listo para usar."
  DetailPrint ""
  DetailPrint "   En el primer arranque:"
  DetailPrint "   • Se mostrará el asistente de configuración"
  DetailPrint "   • Configura la institución y admin"
  DetailPrint "   • Importa datos de backups si los tienes"
  DetailPrint ""
  DetailPrint "   Datos almacenados en:"
  DetailPrint "   %APPDATA%\SAE\"
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
  DetailPrint "   ✗ Error en la instalación"
  DetailPrint "  ================================================"
  DetailPrint ""
  DetailPrint "   Posibles causas:"
  DetailPrint "   • Permisos insuficientes en %APPDATA%"
  DetailPrint "   • Espacio en disco insuficiente"
  DetailPrint "   • Antivirus bloqueando la instalación"
  DetailPrint ""
  DetailPrint "   Soluciones:"
  DetailPrint "   1. Ejecuta como Administrador"
  DetailPrint "   2. Desactiva temporalmente el antivirus"
  DetailPrint "   3. Libera espacio en disco"
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint ""
!macroend

; ══════════════════════════════════════════════════════════════
; UNINSTALL - Desinstalador mejorado con progreso visual
; ══════════════════════════════════════════════════════════════

!macro customUninstall
  SetDetailsPrint both

  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   SAE - Desinstalación"
  DetailPrint "  ================================================"
  DetailPrint ""
  DetailPrint "  [1/5] Verificando procesos..."
  
  ; Cerrar procesos activos
  ExecWait 'taskkill /F /IM SAE.exe /T 2>nul' $0
  ExecWait 'taskkill /F /IM node.exe /T 2>nul' $0
  
  Sleep 1000
  DetailPrint "      ✓ Procesos cerrados"
  DetailPrint ""

  ; Preguntar sobre datos
  DetailPrint "  [2/5] Configuración de datos..."
  DetailPrint ""
  
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 \
    "¿Desea eliminar TODOS los datos almacenados?$\n$\nEsto incluye:$\n- Base de Datos (alumnos, personal, etc)$\n- Fotos y logos subidos$\n- Backups y reportes$\n- Logs del sistema$\n$\nSelecciona NO para mantener los datos.$\nNecesitarás restaurarlos en una próxima instalación." \
    /SD IDNO IDNO keep_data

  ; Usuario seleccionó SÍ: eliminar TODO
  DetailPrint ""
  DetailPrint "  [3/5] Eliminando application files..."
  Sleep 500
  
  DetailPrint "  [4/5] Limpiando datos de la aplicación..."
  
  RMDir /r /REBOOTOK "$APPDATA\SAE"
  RMDir /r /REBOOTOK "$LOCALAPPDATA\SAE"
  
  DetailPrint "      ✓ Datos eliminados"
  Sleep 300
  
  DetailPrint ""
  DetailPrint "  [5/5] Eliminando entradas de registro..."
  DeleteRegKey HKCU "Software\SAE"
  DeleteRegKey HKCU "Software\sae-administracion-educativa"
  
  ${If} ${FileExists} "$LOCALAPPDATA\electron-cache"
    RMDir /r "$LOCALAPPDATA\electron-cache"
  ${EndIf}
  
  DetailPrint "      ✓ Registros limpios"
  Goto uninstall_finish

  keep_data:
  DetailPrint ""
  DetailPrint "  [3/5] Eliminando application files..."
  DetailPrint "      ✓ Archivos de programa eliminados"
  DetailPrint ""
  DetailPrint "  [4/5] Preservando datos..."
  DetailPrint "      ✓ Datos conservados en: $APPDATA\SAE"
  DetailPrint ""
  DetailPrint "  [5/5] Eliminando accesos directos..."
  RMDir /r "$SMPROGRAMS\SAE"
  
  uninstall_finish:
  DetailPrint "      ✓ Accesos directos eliminados"
  DetailPrint ""
!macroend

; ──────────────────────────────────────────────────────────────
; UNINSTALL SUCCESS
; ──────────────────────────────────────────────────────────────
!macro customUninstallSuccess
  SetDetailsPrint both
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint "   ✓ Desinstalación Completada"
  DetailPrint "  ================================================"
  DetailPrint ""
  
  ${If} ${FileExists} "$APPDATA\SAE"
    DetailPrint "  Los datos se encuentran en:"
    DetailPrint "  $APPDATA\SAE\"
    DetailPrint ""
    DetailPrint "  Puedes:"
    DetailPrint "  • Hacer backup de esta carpeta"
    DetailPrint "  • Eliminarla manualmente después"
    DetailPrint "  • Installar SAE nuevamente y restaurar datos"
  ${Else}
    DetailPrint "  Todos los datos han sido eliminados."
  ${EndIf}
  
  DetailPrint ""
  DetailPrint "  Gracias por usar SAE. ¡Hasta pronto!"
  DetailPrint ""
  DetailPrint "  ================================================"
  DetailPrint ""
!macroend
