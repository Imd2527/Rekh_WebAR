const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const aAssets = `    <a-assets>
      <a-asset-item id="artifactModel" src="assets/3d/model.glb"></a-asset-item>
    </a-assets>

    <!-- =================================================`;
html = html.replace('    <!-- =================================================\n         CAMERA', aAssets);

const modelTag = `    <a-entity
      id="vishnuTarget"
      mindar-image-target="targetIndex: 0"
    >
      <!-- ===============================================
           3D MODEL (Placeholder)
      ================================================ -->
      <a-gltf-model
        id="artifact3D"
        src="#artifactModel"
        scale="1 1 1"
        position="0 0 0"
        rotation="0 0 0"
        visible="false"
      ></a-gltf-model>
`;
html = html.replace(/    <a-entity\s+id="vishnuTarget"\s+mindar-image-target="targetIndex: 0"\s*>/, modelTag);

fs.writeFileSync('index.html', html);
