const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /scale="1\.5 1\.5 1\.5"/;
html = html.replace(regex, 'scale="0.05 0.05 0.05"');
fs.writeFileSync('index.html', html);
