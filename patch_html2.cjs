const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div\s+id="hotspotInfo"\s+class="hotspot-info"\s*>[\s\S]*?<\/div>\s*<\/section>/;

const replacement = `<div id="hotspotInfo" class="hotspot-info custom-card">
    <button class="hotspot-close" onclick="closeHotspot()">×</button>
    <div class="card-header">
      <div class="card-title">THE CROWN & FACE</div>
      <div class="card-subtitle">How the vessel was held</div>
    </div>
    <div class="card-media"></div>
    <div class="card-audio">
      <div class="audio-waveform">
        <div class="bar" style="height: 16px; background: #ebd2b4;"></div>
        <div class="bar" style="height: 24px; background: #ebd2b4;"></div>
        <div class="bar" style="height: 10px; background: #ebd2b4;"></div>
        <div class="bar" style="height: 20px; background: #ebd2b4;"></div>
        <div class="bar" style="height: 8px; background: #ebd2b4;"></div>
        <div class="bar" style="height: 14px; background: #ebd2b4;"></div>
        <div class="bar" style="height: 6px; background: #ebd2b4;"></div>
        
        <div class="bar" style="height: 18px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 30px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 10px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 14px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 28px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 10px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 20px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 14px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 24px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 10px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 26px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 12px; background: rgba(255,255,255,0.2);"></div>
        <div class="bar" style="height: 22px; background: rgba(255,255,255,0.2);"></div>
      </div>
      <div class="audio-times">
        <span>00:02</span>
        <div class="scrubber">
          <div class="scrubber-track"></div>
          <div class="scrubber-fill" style="width: 20%;"></div>
          <div class="scrubber-thumb" style="left: 20%;"></div>
        </div>
        <span>00:24</span>
      </div>
      <div class="audio-controls">
        <button class="btn-play">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5h2v14H8Zm6 0h2v14h-2Z"/></svg>
        </button>
        <button class="btn-rewind">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><text x="12" y="15" font-size="9" fill="currentColor" stroke="none" text-anchor="middle">10</text></svg>
        </button>
        <span class="audio-status">Playing story</span>
      </div>
    </div>
    <div class="card-captions">
      <div class="captions-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="18" y2="12"></line><line x1="6" y1="16" x2="18" y2="16"></line></svg> CAPTIONS
      </div>
      <div class="captions-text">
        The calm face and elaborate crown give Vishnu a composed, authoritative presence. In sacred sculpture, such details...
      </div>
    </div>
  </div>

</section>`;

if (regex.test(html)) {
  html = html.replace(regex, replacement);
  fs.writeFileSync('index.html', html);
  console.log("Patched HTML properly");
} else {
  console.log("Regex not found in index.html");
}
