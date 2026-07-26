<#
Regenerates app/icon.png, app/apple-icon.png, and app/favicon.ico from the
PredictCentr mark (three ascending bars, purple -> pink -> orange gradient,
plus an amber dot) on a near-black rounded-square tile.

This is the raster counterpart of components/LogoMark.tsx -- same geometry
(0-100 design space, bars rotated 20deg around their own bottom-center),
just rendered with System.Drawing instead of SVG since there's no Node/
image-conversion tooling available in this environment. Re-run this any
time the mark's geometry or colors change so the two stay in sync.
#>

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $root "app"

function New-RoundedRectPath {
    param([double]$X, [double]$Y, [double]$Width, [double]$Height, [double]$Radius)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $Radius * 2
    $path.AddArc($X, $Y, $d, $d, 180, 90)
    $path.AddArc($X + $Width - $d, $Y, $d, $d, 270, 90)
    $path.AddArc($X + $Width - $d, $Y + $Height - $d, $d, $d, 0, 90)
    $path.AddArc($X, $Y + $Height - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-BarPath {
    # Bar in local space: bottom-center pivot at (0,0), extends upward (-Height).
    # Rotated 20deg (clockwise, so the top leans right) around that pivot,
    # then placed at (Cx, Cy) in design space, then scaled to pixels.
    param([double]$Cx, [double]$Cy, [double]$Width, [double]$Height, [double]$Scale)
    $r = $Width / 2.0
    $path = New-RoundedRectPath -X (-$r) -Y (-$Height) -Width $Width -Height $Height -Radius $r
    $matrix = New-Object System.Drawing.Drawing2D.Matrix
    $matrix.RotateAt(20, (New-Object System.Drawing.PointF(0, 0)), [System.Drawing.Drawing2D.MatrixOrder]::Append)
    $matrix.Translate($Cx, $Cy, [System.Drawing.Drawing2D.MatrixOrder]::Append)
    $matrix.Scale($Scale, $Scale, [System.Drawing.Drawing2D.MatrixOrder]::Append)
    $path.Transform($matrix)
    return $path
}

function New-LogoBitmap {
    param([int]$Size, [bool]$WithTile = $true)

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $scale = $Size / 100.0

    if ($WithTile) {
        $pad = 4.0 * $scale
        $tile = New-RoundedRectPath -X $pad -Y $pad -Width ($Size - 2 * $pad) -Height ($Size - 2 * $pad) -Radius (22.0 * $scale)
        $tileBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#0D0D12"))
        $g.FillPath($tileBrush, $tile)
        $tileBrush.Dispose()
        $tile.Dispose()
    }

    # Gradient defined in absolute design-space coords (15,85)->(85,15), scaled to pixels --
    # matches LogoMark.tsx's userSpaceOnUse linearGradient exactly.
    $gradStart = New-Object System.Drawing.PointF((15.0 * $scale), (85.0 * $scale))
    $gradEnd = New-Object System.Drawing.PointF((85.0 * $scale), (15.0 * $scale))
    $barBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($gradStart, $gradEnd, [System.Drawing.Color]::White, [System.Drawing.Color]::White)
    $colorBlend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
    $colorBlend.Colors = @(
        [System.Drawing.ColorTranslator]::FromHtml("#7B5CFF"),
        [System.Drawing.ColorTranslator]::FromHtml("#FF4DB8"),
        [System.Drawing.ColorTranslator]::FromHtml("#FF8A3D")
    )
    $colorBlend.Positions = @(0.0, 0.5, 1.0)
    $barBrush.InterpolationColors = $colorBlend

    $bar1 = New-BarPath -Cx 24 -Cy 78 -Width 11 -Height 28 -Scale $scale
    $bar2 = New-BarPath -Cx 42 -Cy 78 -Width 11 -Height 44 -Scale $scale
    $bar3 = New-BarPath -Cx 60 -Cy 78 -Width 11 -Height 60 -Scale $scale
    foreach ($bar in @($bar1, $bar2, $bar3)) {
        $g.FillPath($barBrush, $bar)
        $bar.Dispose()
    }
    $barBrush.Dispose()

    $dotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#FFC857"))
    $dotR = 8.0 * $scale
    $dotCx = 80.0 * $scale
    $dotCy = 78.0 * $scale
    $g.FillEllipse($dotBrush, $dotCx - $dotR, $dotCy - $dotR, $dotR * 2, $dotR * 2)
    $dotBrush.Dispose()

    $g.Dispose()
    return $bmp
}

function Save-Png {
    param([System.Drawing.Bitmap]$Bitmap, [string]$Path)
    $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Get-PngBytes {
    # PowerShell unravels a returned byte[] into a boxed System.Object[]
    # unless enumeration is explicitly suppressed -- Write-Output -NoEnumerate
    # is required here, a bare `return $bytes` silently corrupts the array.
    param([System.Drawing.Bitmap]$Bitmap)
    $ms = New-Object System.IO.MemoryStream
    $Bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    [byte[]]$bytes = $ms.ToArray()
    $ms.Dispose()
    Write-Output -NoEnumerate $bytes
}

function Save-Ico {
    param([int[]]$Sizes, [string]$Path)
    $images = @()
    foreach ($s in $Sizes) {
        $bmp = New-LogoBitmap -Size $s -WithTile $true
        $images += , (Get-PngBytes -Bitmap $bmp)
        $bmp.Dispose()
    }

    $fs = New-Object System.IO.FileStream($Path, [System.IO.FileMode]::Create)
    $bw = New-Object System.IO.BinaryWriter($fs)

    $bw.Write([UInt16]0)          # reserved
    $bw.Write([UInt16]1)          # type: icon
    $bw.Write([UInt16]$Sizes.Count)

    $headerSize = 6 + (16 * $Sizes.Count)
    $offset = $headerSize
    for ($i = 0; $i -lt $Sizes.Count; $i++) {
        $s = $Sizes[$i]
        $byteLen = $images[$i].Length
        $dim = if ($s -ge 256) { 0 } else { $s }
        $bw.Write([byte]$dim)      # width
        $bw.Write([byte]$dim)      # height
        $bw.Write([byte]0)         # color count
        $bw.Write([byte]0)         # reserved
        $bw.Write([UInt16]1)       # planes
        $bw.Write([UInt16]32)      # bit count
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

$icon512 = New-LogoBitmap -Size 512 -WithTile $true
Save-Png -Bitmap $icon512 -Path (Join-Path $appDir "icon.png")
$icon512.Dispose()
Write-Host "Wrote app/icon.png (512x512)"

$apple180 = New-LogoBitmap -Size 180 -WithTile $true
Save-Png -Bitmap $apple180 -Path (Join-Path $appDir "apple-icon.png")
$apple180.Dispose()
Write-Host "Wrote app/apple-icon.png (180x180)"

Save-Ico -Sizes @(16, 32, 48) -Path (Join-Path $appDir "favicon.ico")
Write-Host "Wrote app/favicon.ico (16/32/48)"
