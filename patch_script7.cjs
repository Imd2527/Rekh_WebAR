const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

content = content.replace(/const artifact3D = document.getElementById\('artifact3D'\);[\s\S]*?if \(artifact3D\) \{[\s\S]*?artifact3D.setAttribute\('visible', 'true'\);[\s\S]*?\}/, 
`const artifactContainer = document.getElementById('artifact3DContainer');
  if (artifactContainer) {
    artifactContainer.setAttribute('visible', 'true');
  }`);

fs.writeFileSync('script.js', content);
