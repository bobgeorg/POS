# Sourmena POS Logo Generator
# This script creates logo files from SVG

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Sourmena POS Logo Generator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$publicPath = $scriptPath

# Check if ImageMagick or similar tool is available
$hasConvert = Get-Command "magick" -ErrorAction SilentlyContinue
$hasInkscape = Get-Command "inkscape" -ErrorAction SilentlyContinue

if ($hasConvert) {
    Write-Host "[OK] ImageMagick found" -ForegroundColor Green
    
    # Generate PNG files from SVG
    Write-Host "Generating logo192.png..." -ForegroundColor Yellow
    & magick convert -background none "$publicPath\logo.svg" -resize 192x192 "$publicPath\logo192.png"
    
    Write-Host "Generating logo512.png..." -ForegroundColor Yellow
    & magick convert -background none "$publicPath\logo.svg" -resize 512x512 "$publicPath\logo512.png"
    
    Write-Host "Generating favicon.ico..." -ForegroundColor Yellow
    & magick convert -background none "$publicPath\logo.svg" -resize 32x32 "$publicPath\favicon.ico"
    
    Write-Host ""
    Write-Host "[SUCCESS] All logo files generated!" -ForegroundColor Green
    
} elseif ($hasInkscape) {
    Write-Host "[OK] Inkscape found" -ForegroundColor Green
    
    Write-Host "Generating logo192.png..." -ForegroundColor Yellow
    & inkscape "$publicPath\logo.svg" --export-filename="$publicPath\logo192.png" --export-width=192
    
    Write-Host "Generating logo512.png..." -ForegroundColor Yellow
    & inkscape "$publicPath\logo.svg" --export-filename="$publicPath\logo512.png" --export-width=512
    
    Write-Host "Generating favicon.ico (as PNG first)..." -ForegroundColor Yellow
    & inkscape "$publicPath\logo.svg" --export-filename="$publicPath\favicon-temp.png" --export-width=32
    
    Write-Host ""
    Write-Host "[SUCCESS] PNG files generated!" -ForegroundColor Green
    Write-Host "[INFO] For favicon.ico, use an online converter or ImageMagick" -ForegroundColor Yellow
    
} else {
    Write-Host "[WARNING] No SVG converter found (ImageMagick or Inkscape)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Install ImageMagick: https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host "2. Install Inkscape: https://inkscape.org/release/" -ForegroundColor White
    Write-Host "3. Use online converter: https://convertio.co/svg-png/" -ForegroundColor White
    Write-Host ""
    Write-Host "Manual steps:" -ForegroundColor Cyan
    Write-Host "1. Open logo.svg in a web browser or image editor" -ForegroundColor White
    Write-Host "2. Export/Save as PNG at sizes: 192x192, 512x512, 32x32" -ForegroundColor White
    Write-Host "3. Rename files to: logo192.png, logo512.png, favicon.ico" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternative: Open generate-icon.html in browser and save canvas images" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Files location: $publicPath" -ForegroundColor Cyan
Write-Host ""
pause
