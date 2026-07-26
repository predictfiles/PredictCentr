<#
Regenerates app/icon.png, app/apple-icon.png, and app/favicon.ico from
public/logo-icon-source.png -- the real icon mark (bars + dot, no text)
cropped out of the actual logo file by scripts/process-logo-file.ps1.
Pure resize onto a transparent square canvas, no redrawing -- this is
the real asset, not a recreation.
#>

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $root "app"
$sourcePath = Join-Path $root "public\logo-icon-source.png"

function New-SquareIcon {
    param([string]$SourcePath, [int]$Size, [double]$PaddingFraction = 0.1)

    $src = [System.Drawing.Image]::FromFile($SourcePath)
    $canvas = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $avail = $Size * (1.0 - $PaddingFraction * 2)
    $scale = [Math]::Min($avail / $src.Width, $avail / $src.Height)
    $drawW = $src.Width * $scale
    $drawH = $src.Height * $scale
    $offX = ($Size - $drawW) / 2.0
    $offY = ($Size - $drawH) / 2.0

    $g.DrawImage($src, [float]$offX, [float]$offY, [float]$drawW, [float]$drawH)
    $g.Dispose()
    $src.Dispose()
    return $canvas
}

function Get-PngBytes {
    # A bare `return $bytes` on a byte[] unravels it into a boxed
    # Object[] in PowerShell -- Write-Output -NoEnumerate is required.
    param([System.Drawing.Bitmap]$Bitmap)
    $ms = New-Object System.IO.MemoryStream
    $Bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    [byte[]]$bytes = $ms.ToArray()
    $ms.Dispose()
    Write-Output -NoEnumerate $bytes
}

function Save-Ico {
    param([string]$SourcePath, [int[]]$Sizes, [string]$Path)
    $images = @()
    foreach ($s in $Sizes) {
        $bmp = New-SquareIcon -SourcePath $SourcePath -Size $s
        $images += , (Get-PngBytes -Bitmap $bmp)
        $bmp.Dispose()
    }

    $fs = New-Object System.IO.FileStream($Path, [System.IO.FileMode]::Create)
    $bw = New-Object System.IO.BinaryWriter($fs)

    $bw.Write([UInt16]0)
    $bw.Write([UInt16]1)
    $bw.Write([UInt16]$Sizes.Count)

    $headerSize = 6 + (16 * $Sizes.Count)
    $offset = $headerSize
    for ($i = 0; $i -lt $Sizes.Count; $i++) {
        $s = $Sizes[$i]
        $byteLen = $images[$i].Length
        $dim = if ($s -ge 256) { 0 } else { $s }
        $bw.Write([byte]$dim)
        $bw.Write([byte]$dim)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([UInt16]1)
        $bw.Write([UInt16]32)
        $bw.Write([UInt32]$byteLen)
        $bw.Write([UInt32]$offset)
        $offset += $byteLen
    }
    foreach ($imgBytes in $images) {
        $bw.Write([byte[]]$imgBytes)
    }

    $bw.Flush()
    $bw.Dispose()
    $fs.Dispose()
}

if (-not (Test-Path $sourcePath)) {
    throw "Missing $sourcePath -- run scripts/process-logo-file.ps1 first to produce it from the real logo file."
}

$icon512 = New-SquareIcon -SourcePath $sourcePath -Size 512
$icon512.Save((Join-Path $appDir "icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon512.Dispose()
Write-Host "Wrote app/icon.png (512x512)"

$apple180 = New-SquareIcon -SourcePath $sourcePath -Size 180
$apple180.Save((Join-Path $appDir "apple-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$apple180.Dispose()
Write-Host "Wrote app/apple-icon.png (180x180)"

Save-Ico -SourcePath $sourcePath -Sizes @(16, 32, 48) -Path (Join-Path $appDir "favicon.ico")
Write-Host "Wrote app/favicon.ico (16/32/48)"
