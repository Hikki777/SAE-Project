!macro customInstall
  ; Standard Electron-builder macro left empty to prevent ENOENT crash
!macroend

!macro customUninstall
  ; Ensure complete cleanup
  RMDir /r "$APPDATA\SAE"
!macroend
