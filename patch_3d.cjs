const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<a-gltf-model[\s\S]*?id="artifact3D"[\s\S]*?<\/a-gltf-model>/;

const replacement = `<a-gltf-model
        id="artifact3D"
        src="#artifactModel"
        scale="1.5 1.5 1.5"
        position="0 0 0"
        rotation="0 0 0"
        visible="false"
      ></a-gltf-model>
      
      <!-- Lighting so the model is visible -->
      <a-entity light="type: ambient; color: #ffffff; intensity: 1.5"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 2" position="1 2 1"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 1" position="-1 -1 -1"></a-entity>`;

html = html.replace(regex, replacement);
fs.writeFileSync('index.html', html);
