const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertToSVG() {
  const gamesDir = path.join(__dirname, 'public/images/games');
  
  const files = [
    { png: '543d4f8c-cf55-4803-a9b7-ba249b0df55d.png', svg: 'questions-hero.svg' },
    { png: 'chairs-hero-new.png', svg: 'chairs-hero.svg' },
    { png: 'roulette-hero-new.png', svg: 'roulette-hero.svg' },
    { png: 'fruits-war-hero-new.png', svg: 'fruits-war-hero.svg' }
  ];

  for (const file of files) {
    const pngPath = path.join(gamesDir, file.png);
    const svgPath = path.join(gamesDir, file.svg);
    
    try {
      if (fs.existsSync(pngPath)) {
        // Convert PNG to SVG using a simple tracing method
        const buffer = await sharp(pngPath)
          .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer();
        
        // Create a simple SVG with embedded image
        const base64 = buffer.toString('base64');
        const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64}" width="400" height="400"/>
</svg>`;
        
        fs.writeFileSync(svgPath, svg);
        console.log(`✓ Converted ${file.png} to ${file.svg}`);
      }
    } catch (err) {
      console.error(`✗ Error converting ${file.png}:`, err.message);
    }
  }
}

convertToSVG().catch(console.error);
