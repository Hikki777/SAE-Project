const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

async function generateIcon() {
  const pngPath = path.join(__dirname, '../frontend/public/logo.png');
  const icoPath = path.join(__dirname, '../frontend/public/logo.ico');

  console.log('Generating ICO from:', pngPath);

  try {
    // Jimp.read should be available on the Jimp class/object
    const image = await Jimp.read(pngPath);
    
    // Resize to standard icon size (256x256 is good for high res, checks all boxes)
    // Try new API format if basic fails (ZodError suggests it wants strict types)
    try {
        image.resize({ w: 256, h: 256 });
    } catch (e) {
        // Fallback to old API or just ignore if it fails and try to write anyway
        try {
            image.resize(256, 256);
        } catch (e2) {
             console.log('Resize failed, using original size:', e2.message);
        }
    }
    
    // Get buffer as PNG
    const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
    // Convert to ICO format manually (simple header wrap)
    const icoBuffer = pngToIco(pngBuffer);
    
    fs.writeFileSync(icoPath, icoBuffer);
    console.log('Icon generated successfully at:', icoPath);

  } catch (error) {
    console.error('Error generating icon using Jimp:', error);
    
    // ULTIMATE FALLBACK: Blindly wrap the PNG as a 256x256 ICO.
    // This removes the dependency on Jimp working perfectly if the PNG is already good enough.
    try {
        console.log('Attempting raw PNG wrap fallback...');
        const rawPng = fs.readFileSync(pngPath);
        const icoBuffer = pngToIco(rawPng);
        fs.writeFileSync(icoPath, icoBuffer);
        console.log('Icon generated successfully (raw fallback) at:', icoPath);
    } catch (err2) {
        console.error('Raw fallback failed:', err2);
    }
  }
}

function pngToIco(pngBuffer) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(1, 4); // Count = 1 image

  const width = 256; 
  const height = 256;
  const bpp = 32; 

  header.writeUInt8(0, 6); // 0 means 256 width
  header.writeUInt8(0, 7); // 0 means 256 height
  header.writeUInt8(0, 8); // Color palette
  header.writeUInt8(0, 9); // Reserved
  header.writeUInt16LE(1, 10); // Color planes
  header.writeUInt16LE(bpp, 12); // Bits per pixel
  header.writeUInt32LE(pngBuffer.length, 14); // Size of image data
  header.writeUInt32LE(22, 18); // Offset of image data
  
  return Buffer.concat([header, pngBuffer]);
}

generateIcon();
