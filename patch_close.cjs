const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

const regex = /function closeHotspot\(\) \{[\s\S]*?\}\n\n\n\/\* =====================================================\n   ENABLE MOBILE AR/m;

const replacement = `function closeHotspot() {
  const hotspotInfo = document.getElementById("hotspotInfo");
  if (hotspotInfo) {
    hotspotInfo.classList.remove("visible");
    hotspotInfo.style.display = "none";
  }
}

/* =====================================================
   ENABLE MOBILE AR`;

content = content.replace(regex, replacement);
fs.writeFileSync('script.js', content);
