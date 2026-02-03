Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c npm run electron:silent", 0, False
Set WshShell = Nothing
