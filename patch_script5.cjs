const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

const oldShowHotspots = `function showHotspots() {
  console.log("Showing all hotspots...");
  
  const hotspots = document.querySelectorAll('.hotspot');
  
  hotspots.forEach(hotspot => {
    hotspot.setAttribute('visible', 'true');
    hotspot.setAttribute('opacity', '1');
    
    // Check if we have already attached listeners
    if (!hotspot.dataset.listenersAttached) {
      hotspot.dataset.listenersAttached = "true";
      
      hotspot.addEventListener("click", (event) => {
        event.stopPropagation();
        console.log("HOTSPOT CLICKED");
        openHotspotUI();
      });
      
      hotspot.addEventListener("touchstart", (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("HOTSPOT TOUCHED");
        openHotspotUI();
      }, { passive: false });
    }
  });

  hotspotCreated = true;
  console.log("ALL HOTSPOTS ARE NOW VISIBLE.");
}`;

const newShowHotspots = `function showHotspots() {
  console.log("Showing first hotspot only...");
  
  // As requested, just show ONE clickable circle
  const hotspot = document.getElementById('hotspot1');
  
  if (hotspot) {
    hotspot.setAttribute('visible', 'true');
    hotspot.setAttribute('opacity', '1');
    
    if (!hotspot.dataset.listenersAttached) {
      hotspot.dataset.listenersAttached = "true";
      
      hotspot.addEventListener("click", (event) => {
        event.stopPropagation();
        console.log("HOTSPOT CLICKED");
        openHotspotUI();
      });
      
      hotspot.addEventListener("touchstart", (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("HOTSPOT TOUCHED");
        openHotspotUI();
      }, { passive: false });
    }
  }

  hotspotCreated = true;
  console.log("ONE HOTSPOT IS NOW VISIBLE.");
}`;

content = content.replace(oldShowHotspots, newShowHotspots);
fs.writeFileSync('script.js', content);
