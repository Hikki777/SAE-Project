Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Obtener la ruta del directorio actual
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Cambiar al directorio del proyecto
objShell.CurrentDirectory = strScriptPath

' Ejecutar node sin mostrar ventana
' 0 = Ocultar ventana completamente
' False = No esperar a que termine
objShell.Run "node scripts\start-electron-dev.js", 0, False

Set objShell = Nothing
Set objFSO = Nothing
