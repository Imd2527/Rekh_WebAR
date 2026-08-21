const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

const oldShowHotspots = `function showHotspots() {
  console.log("Showing first hotspot only...");
  
  // As requested, just show ONE clickable circle
  const hotspot = document.getElementById('hotspot1');`;

const newShowHotspots = `function showHotspots() {
  console.log("Showing 3D model and first hotspot...");
  
  // Show the 3D model
  const artifact3D = document.getElementById('artifact3D');
  if (artifact3D) {
    artifact3D.setAttribute('visible', 'true');
  }

  // As requested, just show ONE clickable circle
  const hotspot = document.getElementById('hotspot1');`;

content = content.replace(oldShowHotspots, newShowHotspots);
fs.writeFileSync('script.js', content);
