const fs = require('fs');
const path = require('path');

// Read PNG file and convert to base64
const pngPath = 'c:\\Users\\elmar\\Downloads\\963C35BE-101F-4680-9C9A-7B20C408987D.png';
const outputPath = 'c:\\Users\\elmar\\OneDrive\\Desktop\\Roz\\public\\images\\games\\fruits-war-hero.svg';

// Read the PNG file
const pngData = fs.readFileSync(pngPath);
const base64Data = pngData.toString('base64');

// Create SVG with embedded PNG
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" width="1024" height="1024" preserveAspectRatio="xMidYMid meet">
  <image xlink:href="data:image/png;base64,${base64Data}" width="1024" height="1024" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

// Write SVG file
fs.writeFileSync(outputPath, svg);
console.log('SVG created successfully at:', outputPath);
console.log('File size:', (svg.length / 1024 / 1024).toFixed(2), 'MB');
