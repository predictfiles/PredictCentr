<#
Takes a real PredictCentr logo PNG (flattened onto an opaque black
canvas, icon + wordmark side by side) and:
  1. Recovers a transparent background by un-multiplying each pixel
     against black (alpha = max(r,g,b); color = color * 255/alpha).
     This is the correct inverse of "flatten a transparent PNG onto a
     solid black canvas" and gives clean anti-aliased edges, unlike a
     naive chroma-key.
  2. Saves the full icon+wordmark lockup as public/logo-full.png
     (transparent background) -- used directly in the header/hero.
  3. Detects the gap between the icon and the wordmark text (by column
     alpha-sum) and crops out just the icon mark as its own transparent
     PNG at public/logo-icon-source.png, padded slightly -- the source
     scripts/generate-icons.ps1 resizes into the favicon/app-icon files.

Re-run this any time Owain supplies an updated logo export, then run
generate-icons.ps1 to refresh the favicon/app-icon files from the result.

Usage: powershell -File scripts/process-logo-file.ps1 -SourcePath <path>
#>
param(
    [Parameter(Mandatory = $true)][string]$SourcePath
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $root "public"

$src = [System.Drawing.Bitmap]::new($SourcePath)
$w = $src.Width
$h = $src.Height
Write-Host "Source: $w x $h"

$out = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$srcData = $src.LockBits((New-Object System.Drawing.Rectangle(0, 0, $w, $h)), [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outData = $out.LockBits((New-Object System.Drawing.Rectangle(0, 0, $w, $h)), [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$stride = $srcData.Stride
$bytes = $stride * $h
$srcBuf = New-Object byte[] $bytes
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcBuf, 0, $bytes)
$outBuf = New-Object byte[] $bytes

# Column alpha-sum (post-recovery) for finding the icon/text gap.
$colAlpha = New-Object int[] $w

for ($y = 0; $y -lt $h; $y++) {
    $rowStart = $y * $stride
    for ($x = 0; $x -lt $w; $x++) {
        $i = $rowStart + $x * 4
        $b = $srcBuf[$i]
        $g = $srcBuf[$i + 1]
        $r = $srcBuf[$i + 2]
        # ignore original alpha byte -- source is fully opaque

        $a = [Math]::Max($r, [Math]::Max($g, $b))
        if ($a -lt 8) {
            $a = 0
            $nr = 0; $ng = 0; $nb = 0
        } else {
            $nr = [Math]::Min(255, [int]([double]$r * 255.0 / $a))
            $ng = [Math]::Min(255, [int]([double]$g * 255.0 / $a))
            $nb = [Math]::Min(255, [int]([double]$b * 255.0 / $a))
        }

        $outBuf[$i] = [byte]$nb
        $outBuf[$i + 1] = [byte]$ng
        $outBuf[$i + 2] = [byte]$nr
        $outBuf[$i + 3] = [byte]$a

        $colAlpha[$x] += $a
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($outBuf, 0, $outData.Scan0, $bytes)
$src.UnlockBits($srcData)
$out.UnlockBits($outData)

$fullPath = Join-Path $publicDir "logo-full.png"
$out.Save($fullPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Wrote $fullPath (transparent background)"

# Find the icon/text gap: scan columns left-to-right, find the first
# run of >=4 consecutive near-zero-alpha columns after the icon starts.
$iconEnd = -1
$started = $false
$zeroRun = 0
for ($x = 0; $x -lt $w; $x++) {
    if ($colAlpha[$x] -gt 40) {
        $started = $true
        $zeroRun = 0
    } elseif ($started) {
        $zeroRun++
        if ($zeroRun -ge 4 -and $iconEnd -eq -1) {
            $iconEnd = $x - $zeroRun
        }
    }
}
if ($iconEnd -eq -1) {
    throw "Could not detect a gap between the icon and the wordmark -- inspect column alpha sums manually."
}

$iconStart = 0
for ($x = 0; $x -lt $w; $x++) {
    if ($colAlpha[$x] -gt 40) { $iconStart = $x; break }
}

Write-Host "Detected icon columns: $iconStart to $iconEnd (of $w)"

# Vertical bounds of the icon region specifically.
$topBound = -1
$bottomBound = -1
for ($y = 0; $y -lt $h; $y++) {
    $rowHasIcon = $false
    for ($x = $iconStart; $x -le $iconEnd; $x++) {
        $i = $y * $stride + $x * 4
        if ($outBuf[$i + 3] -gt 20) { $rowHasIcon = $true; break }
    }
    if ($rowHasIcon) {
        if ($topBound -eq -1) { $topBound = $y }
        $bottomBound = $y
    }
}

$pad = 6
$cropX = [Math]::Max(0, $iconStart - $pad)
$cropY = [Math]::Max(0, $topBound - $pad)
$cropW = [Math]::Min($w - $cropX, ($iconEnd - $iconStart + 1) + $pad * 2)
$cropH = [Math]::Min($h - $cropY, ($bottomBound - $topBound + 1) + $pad * 2)

Write-Host "Crop rect: x=$cropX y=$cropY w=$cropW h=$cropH"

$iconBmp = $out.Clone((New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$iconPath = Join-Path $publicDir "logo-icon-source.png"
$iconBmp.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Wrote $iconPath ($cropW x $cropH, transparent, icon only)"

$iconBmp.Dispose()
$out.Dispose()
$src.Dispose()
