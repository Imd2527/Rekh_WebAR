const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const debugUI = `
    <!-- DEBUG UI -->
    <div style="position: fixed; top: 10px; left: 10px; z-index: 9999; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 8px; color: white; display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 12px; font-family: monospace;" id="debugLog">Scale: 1</div>
      <div style="display: flex; gap: 10px;">
        <button onclick="changeScale(0.5)" style="padding: 10px; background: #ebd2b4; color: black; border: none; border-radius: 4px; font-weight: bold;">Scale Down (x0.5)</button>
        <button onclick="changeScale(2)" style="padding: 10px; background: #ebd2b4; color: black; border: none; border-radius: 4px; font-weight: bold;">Scale Up (x2)</button>
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="changeRot(90)" style="padding: 10px; background: #ebd2b4; color: black; border: none; border-radius: 4px; font-weight: bold;">Rotate X 90</button>
        <button onclick="changeRotY(90)" style="padding: 10px; background: #ebd2b4; color: black; border: none; border-radius: 4px; font-weight: bold;">Rotate Y 90</button>
      </div>
    </div>
    
    <script>
      let currentScale = 1;
      let rotX = 0;
      let rotY = 0;
      function changeScale(factor) {
        currentScale *= factor;
        const model = document.getElementById('artifact3D');
        if (model) {
          model.setAttribute('scale', \`\${currentScale} \${currentScale} \${currentScale}\`);
          document.getElementById('debugLog').innerText = \`Scale: \${currentScale} | Rot: \${rotX}, \${rotY}\`;
        }
      }
      function changeRot(deg) {
        rotX = (rotX + deg) % 360;
        const model = document.getElementById('artifact3D');
        if (model) {
          model.setAttribute('rotation', \`\${rotX} \${rotY} 0\`);
          document.getElementById('debugLog').innerText = \`Scale: \${currentScale} | Rot: \${rotX}, \${rotY}\`;
        }
      }
      function changeRotY(deg) {
        rotY = (rotY + deg) % 360;
        const model = document.getElementById('artifact3D');
        if (model) {
          model.setAttribute('rotation', \`\${rotX} \${rotY} 0\`);
          document.getElementById('debugLog').innerText = \`Scale: \${currentScale} | Rot: \${rotX}, \${rotY}\`;
        }
      }
    </script>
`;

html = html.replace('  </body>', debugUI + '\n  </body>');
fs.writeFileSync('index.html', html);
