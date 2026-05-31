const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'assets', 'icons', 'tray.webp');
const outputPath = path.join(__dirname, 'assets', 'icons', 'tray.png');

sharp(inputPath)
  .resize(32, 32)
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log('图标转换成功:', outputPath);
  })
  .catch(err => {
    console.error('图标转换失败:', err);
  });
