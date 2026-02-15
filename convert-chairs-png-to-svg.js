const fs = require('fs');

const pngPath = 'c:\\Users\\elmar\\Downloads\\CE143CA7-41F7-4FE1-8C96-7779854C0B9D.png';
const outputPath = 'c:\\Users\\elmar\\OneDrive\\Desktop\\Roz\\public\\images\\games\\chairs-hero.svg';

try {
  const pngData = fs.readFileSync(pngPath);
  const base64Data = pngData.toString('base64');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" width="1024" height="1024">
  <image xlink:href="data:image/png;base64,${base64Data}" width="1024" height="1024" preserveAspectRatio="xMidYMid slice"/>
</svg>`;

  fs.writeFileSync(outputPath, svg);

  const stats = fs.statSync(outputPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`SVG created successfully at: ${outputPath}`);
  console.log(`File size: ${fileSizeInMB} MB`);
} catch (error) {
  console.error('Error:', error.message);
}
