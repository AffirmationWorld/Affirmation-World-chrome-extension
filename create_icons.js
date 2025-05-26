const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

// Ensure the images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Define icon sizes
const sizes = [16, 48, 128];

// Function to create an icon
async function createIcon(size) {
  // Create a canvas with the specified size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Set background color (optional)
  ctx.fillStyle = '#ffffff00'; // Transparent background
  ctx.fillRect(0, 0, size, size);
  
  // Draw a simple "A" icon (for Affirmation World)
  ctx.fillStyle = '#4a90e2'; // Blue color
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Add text
  const fontSize = Math.max(size/2, 8);
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', size/2, size/2);
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, `icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
}

// Create all icons
async function createAllIcons() {
  for (const size of sizes) {
    await createIcon(size);
  }
  console.log('All icons created successfully!');
}

createAllIcons().catch(console.error); 