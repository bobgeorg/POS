# Sourmena POS - Icon and Branding Setup

## What's Updated

✅ **Title**: Changed from "React App" to "Sourmena POS"
✅ **Manifest**: Updated app name and branding
✅ **Theme Color**: Changed to purple gradient (#667eea)
✅ **SVG Logo**: Created logo.svg with restaurant theme

## Files Modified

- `index.html` - Updated title and meta tags
- `manifest.json` - Updated app name and colors
- `logo.svg` - New logo file (restaurant cloche design)

## Generate Icon Files

You have 3 options to create the final icon files:

### Option 1: Online Converter (Easiest)

1. Visit https://realfavicongenerator.net/
2. Upload `logo.svg`
3. Customize if needed
4. Download package and extract to `public` folder
5. Replace existing favicon.ico, logo192.png, logo512.png

### Option 2: Browser Canvas (No Installation)

1. Open `generate-icon.html` in any web browser
2. Right-click on each canvas
3. Select "Save image as..."
4. Save as:
   - logo192.png (192x192 canvas)
   - logo512.png (512x512 canvas)
   - favicon.ico (32x32 canvas, may need conversion)

### Option 3: Image Editor

Use Photoshop, GIMP, Illustrator, or Inkscape:

1. Open `logo.svg`
2. Export/Save As PNG:
   - 192x192px → logo192.png
   - 512x512px → logo512.png
   - 32x32px → favicon.ico (as ICO format)

### Option 4: Command Line (If you have ImageMagick)

Run in PowerShell:
```powershell
.\generate-logos.ps1
```

Or manually:
```bash
magick convert -background none logo.svg -resize 192x192 logo192.png
magick convert -background none logo.svg -resize 512x512 logo512.png
magick convert -background none logo.svg -resize 32x32 favicon.ico
```

## Current Icon Design

The logo features:
- **Background**: Purple gradient (matching app theme)
- **Icon**: Restaurant cloche (dome food cover)
- **Letter**: "S" for Sourmena (subtle overlay)
- **Style**: Modern, clean, professional

## Customize the Logo

To change the logo design, edit `logo.svg`:

1. Open in any text editor or vector graphics program
2. Modify colors, shapes, or add your own design
3. Save and regenerate PNG/ICO files

### Quick color changes in SVG:

- `#667eea` → Change first gradient color
- `#764ba2` → Change second gradient color
- `fill="white"` → Change icon color

## After Generating Icons

1. Replace files in `public` folder
2. Rebuild the app: `npm run build`
3. Clear browser cache to see changes
4. Or do hard refresh: Ctrl+Shift+R (Ctrl+F5)

## Testing

After setup, verify:
- [ ] Browser tab shows "Sourmena POS"
- [ ] Favicon appears in browser tab
- [ ] App icon shows when added to home screen (mobile)
- [ ] Logo appears in app if used in components

## Need Custom Design?

If you want a completely custom logo:

1. Create your logo in any design tool
2. Export as SVG (for scalability)
3. Replace `logo.svg`
4. Generate PNG/ICO files using one of the options above
5. Update colors in `manifest.json` to match your brand

## Files Included

- `logo.svg` - Main logo file (vector)
- `generate-icon.html` - Browser-based icon generator
- `generate-logos.ps1` - PowerShell script for automation
- `setup-icons.js` - Node.js helper script
- `ICONS_README.md` - This file

---

**Current Status**: Title and branding updated ✓  
**Next Step**: Generate PNG and ICO files using any option above
