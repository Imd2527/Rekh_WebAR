const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<a-gltf-model[\s\S]*?id="artifact3D"[\s\S]*?<\/a-gltf-model>/;

const replacement = `<a-entity id="artifact3DContainer" visible="false">
        <a-gltf-model
          id="artifact3D"
          src="#artifactModel"
          scale="1 1 1"
          position="0 0 0"
          rotation="0 0 0"
        ></a-gltf-model>
      </a-entity>`;

html = html.replace(regex, replacement);
fs.writeFileSync('index.html', html);
