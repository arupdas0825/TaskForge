const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcLogo = path.join(__dirname, '..', 'public', 'logo.png');
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icon suite from logo.png...');

  // Standard icons
  await sharp(srcLogo).resize(192, 192).toFile(path.join(iconsDir, 'icon-192.png'));
  await sharp(srcLogo).resize(512, 512).toFile(path.join(iconsDir, 'icon-512.png'));

  // Maskable icons (padded with 20% safe zone background #0b0b0f)
  const bg192 = await sharp({
    create: { width: 192, height: 192, channels: 4, background: { r: 11, g: 11, b: 15, alpha: 1 } },
  })
    .png()
    .toBuffer();

  const logo192Padded = await sharp(srcLogo).resize(150, 150).toBuffer();

  await sharp(bg192)
    .composite([{ input: logo192Padded, top: 21, left: 21 }])
    .toFile(path.join(iconsDir, 'icon-maskable-192.png'));

  const bg512 = await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 11, g: 11, b: 15, alpha: 1 } },
  })
    .png()
    .toBuffer();

  const logo512Padded = await sharp(srcLogo).resize(400, 400).toBuffer();

  await sharp(bg512)
    .composite([{ input: logo512Padded, top: 56, left: 56 }])
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  console.log('Icons generated successfully in public/icons/');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
