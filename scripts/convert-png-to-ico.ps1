# PowerShell script to convert PNG to ICO using .NET
param(
    [string]$PngPath = "frontend\public\logo.png",
    [string]$IcoPath = "frontend\public\logo.ico"
)

Add-Type -AssemblyName System.Drawing

try {
    # Load the PNG image
    $png = [System.Drawing.Image]::FromFile((Resolve-Path $PngPath))
    
    # Create icon sizes (16, 32, 48, 256)
    $sizes = @(16, 32, 48, 256)
    
    # Create a memory stream for the ICO file
    $memoryStream = New-Object System.IO.MemoryStream
    $binaryWriter = New-Object System.IO.BinaryWriter($memoryStream)
    
    # ICO header
    $binaryWriter.Write([UInt16]0)  # Reserved
    $binaryWriter.Write([UInt16]1)  # Type (1 = ICO)
    $binaryWriter.Write([UInt16]$sizes.Count)  # Number of images
    
    # Calculate offset for image data
    $offset = 6 + ($sizes.Count * 16)
    $imageDataList = @()
    
    # Write directory entries and prepare image data
    foreach ($size in $sizes) {
        # Create resized bitmap
        $bitmap = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($png, 0, 0, $size, $size)
        $graphics.Dispose()
        
        # Convert to PNG format
        $pngStream = New-Object System.IO.MemoryStream
        $bitmap.Save($pngStream, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngData = $pngStream.ToArray()
        $pngStream.Dispose()
        $bitmap.Dispose()
        
        # Write directory entry
        $widthByte = if ($size -eq 256) { 0 } else { $size }
        $heightByte = if ($size -eq 256) { 0 } else { $size }
        
        $binaryWriter.Write([byte]$widthByte)  # Width
        $binaryWriter.Write([byte]$heightByte)  # Height
        $binaryWriter.Write([byte]0)  # Color palette
        $binaryWriter.Write([byte]0)  # Reserved
        $binaryWriter.Write([UInt16]1)  # Color planes
        $binaryWriter.Write([UInt16]32)  # Bits per pixel
        $binaryWriter.Write([UInt32]$pngData.Length)  # Size of image data
        $binaryWriter.Write([UInt32]$offset)  # Offset
        
        $imageDataList += $pngData
        $offset += $pngData.Length
    }
    
    # Write image data
    foreach ($imageData in $imageDataList) {
        $binaryWriter.Write($imageData)
    }
    
    # Save to file
    $icoData = $memoryStream.ToArray()
    [System.IO.File]::WriteAllBytes((Join-Path (Get-Location) $IcoPath), $icoData)
    
    # Cleanup
    $binaryWriter.Close()
    $memoryStream.Close()
    $png.Dispose()
    
    Write-Host "Successfully created ICO file: $IcoPath" -ForegroundColor Green
    Write-Host "Icon contains $($sizes.Count) sizes: $($sizes -join ', ')" -ForegroundColor Green
}
catch {
    Write-Host "Error creating ICO file: $_" -ForegroundColor Red
    exit 1
}
