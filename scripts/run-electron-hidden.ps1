# Script para ejecutar Electron sin mostrar ventana (Windows)
param(
    [string]$electronPath = "electron/main.js"
)

$ErrorActionPreference = 'SilentlyContinue'

# Ejecutar npx electron de forma oculta
$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.FileName = "npx.cmd"
$pinfo.Arguments = "electron `"$electronPath`""
$pinfo.RedirectStandardOutput = $true
$pinfo.RedirectStandardError = $true
$pinfo.UseShellExecute = $false
$pinfo.CreateNoWindow = $true
$pinfo.WindowStyle = 'Hidden'

$p = New-Object System.Diagnostics.Process
$p.StartInfo = $pinfo
$p.Start() | Out-Null
$p.WaitForExit()

exit $p.ExitCode
