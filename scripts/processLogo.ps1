Add-Type -AssemblyName System.Drawing

$src = "C:\Users\eppil\.gemini\antigravity\brain\a9d2c0b8-cf34-40c7-9669-a90a7ae2f336\.user_uploaded\media_1794379256750_20d90369.jpg"
$dest = "D:\RealApplication\GatedPlusMobile\assets\images\gatedplus_official_logo.png"

$img = [System.Drawing.Image]::FromFile($src)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, $img.Width, $img.Height)

$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # If near white background (R > 235, G > 235, B > 235)
        if ($p.R -gt 235 -and $p.G -gt 235 -and $p.B -gt 235) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

# Add small padding
$pad = 12
$minX = [Math]::Max(0, $minX - $pad)
$minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($bmp.Width - 1, $maxX + $pad)
$maxY = [Math]::Min($bmp.Height - 1, $maxY + $pad)

$cropWidth = ($maxX - $minX) + 1
$cropHeight = ($maxY - $minY) + 1

$cropped = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gCrop = [System.Drawing.Graphics]::FromImage($cropped)
$rectSrc = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
$rectDest = New-Object System.Drawing.Rectangle(0, 0, $cropWidth, $cropHeight)
$gCrop.DrawImage($bmp, $rectDest, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)

$cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Successfully saved cropped transparent logo to: $dest"
