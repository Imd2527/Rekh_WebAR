/* =====================================================
   SCREEN NAVIGATION
===================================================== */

function showScreen(screenId) {

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(screenId);

  if (screen) {
    screen.classList.add("active");
  }
}


/* =====================================================
   LOADING
===================================================== */

setTimeout(() => {
  showScreen("welcome");
}, 2500);


/* =====================================================
   STORYBOARD
===================================================== */

const storyFrames = [
  "assets/images/Rekh_How_It_Works_Frame_1_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_2_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_3_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_4_HD.png"
];

let currentStory = 0;


function showStory(index) {

  currentStory = index;

  const image =
    document.getElementById("storyFrame");

  if (image) {
    image.src = storyFrames[index];
  }

  document.querySelectorAll(".dot").forEach(
    (dot, i) => {

      dot.classList.toggle(
        "active",
        i === index
      );

    }
  );
}


/* =====================================================
   ACCESSIBILITY
===================================================== */

function openAccessibility() {

  const overlay =
    document.getElementById("accessibilityOverlay");

  const continueButton =
    document.getElementById("setupContinue");

  if (overlay) {
    overlay.classList.add("open");
  }

  if (continueButton) {
    continueButton.classList.remove("show");
  }
}


function closeAccessibility() {

  const overlay =
    document.getElementById("accessibilityOverlay");

  const continueButton =
    document.getElementById("setupContinue");

  if (overlay) {
    overlay.classList.remove("open");
  }

  if (continueButton) {
    continueButton.classList.add("show");
  }
}


/* =====================================================
   ACCESSIBILITY TOGGLES
===================================================== */

function toggleSetting(button) {

  button.classList.toggle("active");

}


/* =====================================================
   CONTINUE → AR
===================================================== */

function continueSetup() {

  console.log("CONTINUE → AR");

  showScreen("arScreen");

  /*
     Give the browser a moment to make
     the AR screen visible.
  */

  setTimeout(() => {

    startAR();

  }, 100);

}


/* =====================================================
   AR VARIABLES
===================================================== */

let arStarted = false;
let hotspotCreated = false;


/* =====================================================
   START AR
===================================================== */

function startAR() {

  const scene =
    document.getElementById("mindarScene");

  if (!scene) {

    console.error(
      "ERROR: mindarScene not found."
    );

    return;

  }


  /*
     We DO NOT force-start MindAR here if it is
     already configured with autoStart:true.

     This prevents the camera from being started
     twice.
  */

  const setupAR = () => {

    console.log("A-Frame scene loaded.");

    const mindarSystem =
      scene.systems["mindar-image-system"];

    if (!mindarSystem) {

      console.error(
        "ERROR: MindAR image system not found."
      );

      return;

    }

    console.log("MindAR system found.");

    /*
       If the HTML has autoStart disabled,
       start MindAR manually.
    */

    const mindarAttribute =
      scene.getAttribute("mindar-image");

    if (
      mindarAttribute &&
      mindarAttribute.autoStart === false
    ) {

      try {

        mindarSystem.start();

        console.log(
          "MindAR manually started."
        );

      } catch (error) {

        console.error(
          "Could not start MindAR:",
          error
        );

      }

    }

    arStarted = true;

  };


  if (scene.hasLoaded) {

    setupAR();

  } else {

    scene.addEventListener(
      "loaded",
      setupAR,
      { once: true }
    );

  }


  /* =================================================
     AR READY
  ================================================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "CAMERA READY"
      );

      showScanning();

    },
    { once: true }
  );


  /* =================================================
     AR ERROR
  ================================================= */

  scene.addEventListener(
    "arError",
    (event) => {

      console.error(
        "MINDAR ERROR:",
        event
      );

    },
    { once: true }
  );


  /* =================================================
     VISHNU TARGET
  ================================================= */

  const target =
    document.getElementById("vishnuTarget");

  if (!target) {

    console.error(
      "ERROR: vishnuTarget not found."
    );

    return;

  }


  /*
     Prevent duplicate listeners if startAR()
     somehow gets called again.
  */

  if (
    !target.dataset.rekhListenersAdded
  ) {

    target.dataset.rekhListenersAdded =
      "true";


    /* =============================================
       VISHNU FOUND
    ============================================= */

    target.addEventListener(
      "targetFound",
      () => {

        console.log(
          "VISHNU FOUND"
        );

        showArtifactFound();

        /*
           Hotspots should NOT appear immediately.

           They appear only after the user taps
           "Explore the artifact".
        */

        hideHotspots();

      }
    );


    /* =============================================
       VISHNU LOST
    ============================================= */

    target.addEventListener(
      "targetLost",
      () => {

        console.log(
          "VISHNU LOST"
        );

        hideHotspots();

        showScanning();

      }
    );

  }

}


/* =====================================================
   SCANNING UI
===================================================== */

function showScanning() {

  const message =
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

  const status =
    document.getElementById("scanStatus");

  const found =
    document.getElementById("artifactFound");


  if (message) {
    message.style.display = "block";
  }

  if (frame) {
    frame.style.display = "block";
  }

  if (status) {
    status.style.display = "block";
  }

  if (found) {
    found.classList.remove("visible");
  }

  hideHotspots();

}


/* =====================================================
   ARTIFACT FOUND
===================================================== */

function showArtifactFound() {

  const message =
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

  const status =
    document.getElementById("scanStatus");

  const found =
    document.getElementById("artifactFound");


  if (message) {
    message.style.display = "none";
  }

  if (frame) {
    frame.style.display = "none";
  }

  if (status) {
    status.style.display = "none";
  }

  if (found) {
    found.classList.add("visible");
  }

  /*
     Make sure hotspots are hidden until
     Explore is pressed.
  */

  hideHotspots();

}


/* =====================================================
   EXPLORE THE ARTIFACT
===================================================== */

/*
   Your Explore button should call:

       exploreArtifact()

   This is the important new step.
*/

function exploreArtifact() {

  console.log(
    "EXPLORE ARTIFACT CLICKED"
  );


  /*
     Hide the Artifact Found card.
  */

  const found =
    document.getElementById("artifactFound");

  if (found) {

    found.classList.remove(
      "visible"
    );

  }


  /*
     Show ONE hotspot.
  */

  showHotspots();

}


/* =====================================================
   CREATE ONE HOTSPOT
===================================================== */

function showHotspots() {
  console.log("Showing 3D model and first hotspot...");
  
  // Show the 3D model
  const artifactContainer = document.getElementById('artifact3DContainer');
  if (artifactContainer) {
    artifactContainer.setAttribute('visible', 'true');
  }

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
}

/* =====================================================
   HIDE HOTSPOTS
===================================================== */
function hideHotspots() {
  const hotspots = document.querySelectorAll('.hotspot');
  hotspots.forEach(hotspot => {
    hotspot.setAttribute('visible', 'false');
  });
}

/* =====================================================
   OPEN HANDLE UI
===================================================== */

function openHotspotUI() {
  console.log("Opening HOTSPOT UI");

  const hotspotInfo = document.getElementById("hotspotInfo");
  if (hotspotInfo) {
    hotspotInfo.classList.add("visible");
    hotspotInfo.style.display = "block";
  }
}

/* =====================================================
   FALLBACK HANDLE UI
===================================================== */
function createHandleFallback() {

  /*
     Don't create it twice.
  */

  let card =
    document.getElementById(
      "handleFallback"
    );


  if (card) {

    card.style.display =
      "block";

    return;

  }


  card =
    document.createElement("div");


  card.id =
    "handleFallback";


  card.innerHTML = `

    <div class="handle-category">
      Craft
    </div>

    <div class="handle-title">
      THE HANDLE
    </div>

    <div class="handle-subtitle">
      How the vessel was held
    </div>

    <div class="handle-placeholder">
    </div>

    <div class="handle-waveform">
      ▂ ▅ ▃ ▆ ▂ ▄ ▇ ▃ ▅ ▂ ▆ ▄ ▇ ▃ ▅
    </div>

    <div class="handle-controls">

      <span>
        00:02
      </span>

      <span>
        ▶
      </span>

      <span>
        00:24
      </span>

    </div>

    <div class="handle-caption-title">
      CAPTIONS
    </div>

    <div class="handle-caption-text">

      More than a functional element,
      the handle reveals how this object
      was designed to be held and used
      in daily ritual.

    </div>

  `;


  document.body.appendChild(
    card
  );


  /*
     Basic fallback styling.
     Your existing CSS can override this.
  */

  card.style.position =
    "fixed";

  card.style.zIndex =
    "99999";

  card.style.left =
    "8%";

  card.style.bottom =
    "8%";

  card.style.width =
    "84%";

  card.style.maxWidth =
    "360px";

  card.style.maxHeight =
    "70vh";

  card.style.overflowY =
    "auto";

  card.style.boxSizing =
    "border-box";

  card.style.padding =
    "22px";

  card.style.borderRadius =
    "24px";

  card.style.background =
    "#4b321c";

  card.style.color =
    "#f5e9d8";

  card.style.fontFamily =
    "Arial, sans-serif";


  /*
     Category
  */

  const category =
    card.querySelector(
      ".handle-category"
    );

  category.style.display =
    "inline-block";

  category.style.padding =
    "6px 14px";

  category.style.borderRadius =
    "20px";

  category.style.background =
    "rgba(255,255,255,.15)";

  category.style.fontSize =
    "13px";


  /*
     Title
  */

  const title =
    card.querySelector(
      ".handle-title"
    );

  title.style.fontSize =
    "25px";

  title.style.fontWeight =
    "600";

  title.style.marginTop =
    "12px";


  /*
     Subtitle
  */

  const subtitle =
    card.querySelector(
      ".handle-subtitle"
    );

  subtitle.style.marginTop =
    "5px";

  subtitle.style.opacity =
    "0.75";


  /*
     Placeholder
  */

  const placeholder =
    card.querySelector(
      ".handle-placeholder"
    );

  placeholder.style.height =
    "120px";

  placeholder.style.marginTop =
    "18px";

  placeholder.style.borderRadius =
    "16px";

  placeholder.style.background =
    "#39230e";


  /*
     Waveform
  */

  const waveform =
    card.querySelector(
      ".handle-waveform"
    );

  waveform.style.marginTop =
    "14px";

  waveform.style.letterSpacing =
    "4px";

  waveform.style.fontSize =
    "18px";


  /*
     Controls
  */

  const controls =
    card.querySelector(
      ".handle-controls"
    );

  controls.style.display =
    "flex";

  controls.style.justifyContent =
    "space-between";

  controls.style.alignItems =
    "center";

  controls.style.marginTop =
    "12px";


  /*
     Caption box
  */

  const captionTitle =
    card.querySelector(
      ".handle-caption-title"
    );

  captionTitle.style.marginTop =
    "20px";

  captionTitle.style.fontSize =
    "12px";

  captionTitle.style.letterSpacing =
    "2px";


  const captionText =
    card.querySelector(
      ".handle-caption-text"
    );

  captionText.style.marginTop =
    "10px";

  captionText.style.lineHeight =
    "1.5";


  /*
     Show it.
  */

  card.style.display =
    "block";

}


/* =====================================================
   CLOSE HANDLE UI
===================================================== */

function closeHotspot() {
  const hotspotInfo = document.getElementById("hotspotInfo");
  if (hotspotInfo) {
    hotspotInfo.classList.remove("visible");
    hotspotInfo.style.display = "none";
  }
}

/* =====================================================
   ENABLE MOBILE AR CLICKING
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const scene =
      document.getElementById(
        "mindarScene"
      );

    if (!scene) {
      return;
    }


    /*
       Find the A-Frame camera.
    */

    const camera =
      scene.querySelector(
        "a-camera"
      );


    if (camera) {

      /*
         Add a cursor if one doesn't
         already exist.
      */

      let cursor =
        camera.querySelector(
          "a-cursor"
        );


      if (!cursor) {

        cursor =
          document.createElement(
            "a-cursor"
          );

        cursor.setAttribute(
          "rayOrigin",
          "mouse"
        );

        cursor.setAttribute(
          "fuse",
          "false"
        );

        camera.appendChild(
          cursor
        );

      }


      /*
         Make the cursor raycaster
         detect the hotspot.
      */

      cursor.setAttribute(
        "raycaster",
        "objects: .hotspot-button"
      );

    }


    console.log(
      "Rekh AR interaction system ready."
    );

  }
);


/* =====================================================
   GLOBAL DEBUG HELPERS
===================================================== */

/*
   These can be typed in the browser
   console while testing.
*/

window.showHotspot =
  showHotspots;

window.hideHotspot =
  hideHotspots;

window.openHotspotUI =
  openHotspotUI;

window.closeHotspotUI =
  closeHotspot;

window.exploreArtifact =
  exploreArtifact;

/* =====================================================
   EXIT AR
===================================================== */
function exitAR() {
  console.log("EXIT AR CLICKED");
  
  const scene = document.getElementById("mindarScene");
  if (scene && scene.systems["mindar-image-system"]) {
    scene.systems["mindar-image-system"].stop();
  }
  
  arStarted = false;
  showScreen("setup");
}
window.exitAR = exitAR;

document.addEventListener('DOMContentLoaded', () => {
  const artifact3D = document.getElementById('artifact3D');
  if (artifact3D) {
    artifact3D.addEventListener('model-loaded', () => {
      console.log('3D MODEL LOADED SUCCESSFULLY!');
    });
    artifact3D.addEventListener('model-error', (err) => {
      console.error('ERROR LOADING 3D MODEL:', err);
    });
  }
});
/* =====================================================
   STORY AUDIO
===================================================== */

const storyAudio =
  document.getElementById("storyAudio");

const playPauseButton =
  document.getElementById("playPauseButton");

const audioProgress =
  document.getElementById("audioProgress");

const audioCurrentTime =
  document.getElementById("audioCurrentTime");

const audioDuration =
  document.getElementById("audioDuration");


/* -----------------------------------------------------
   FORMAT TIME
----------------------------------------------------- */

function formatAudioTime(seconds) {

  if (!isFinite(seconds)) {
    return "00:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    Math.floor(seconds % 60);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );
}


/* -----------------------------------------------------
   PLAY / PAUSE
----------------------------------------------------- */

function toggleStoryAudio() {

  if (!storyAudio) {
    return;
  }

  if (storyAudio.paused) {

    storyAudio.play()
      .then(() => {

        if (playPauseButton) {
          playPauseButton.textContent = "Ⅱ";
        }

      })
      .catch(error => {

        console.error(
          "Audio could not play:",
          error
        );

      });

  } else {

    storyAudio.pause();

    if (playPauseButton) {
      playPauseButton.textContent = "▶";
    }

  }
}


/* -----------------------------------------------------
   REWIND 10 SECONDS
----------------------------------------------------- */

function rewindStoryAudio() {

  if (!storyAudio) {
    return;
  }

  storyAudio.currentTime =
    Math.max(
      0,
      storyAudio.currentTime - 10
    );
}


/* -----------------------------------------------------
   AUDIO LOADED
----------------------------------------------------- */

if (storyAudio) {

  storyAudio.addEventListener(
    "loadedmetadata",
    () => {

      if (audioDuration) {

        audioDuration.textContent =
          formatAudioTime(
            storyAudio.duration
          );

      }

      if (audioProgress) {
        audioProgress.value = 0;
      }

    }
  );


  /* ---------------------------------------------------
     UPDATE PROGRESS
  --------------------------------------------------- */

  storyAudio.addEventListener(
    "timeupdate",
    () => {

      if (!storyAudio.duration) {
        return;
      }

      const percentage =
        (storyAudio.currentTime /
          storyAudio.duration) * 100;

      if (audioProgress) {
        audioProgress.value =
          percentage;
      }

      if (audioCurrentTime) {

        audioCurrentTime.textContent =
          formatAudioTime(
            storyAudio.currentTime
          );

      }

    }
  );


  /* ---------------------------------------------------
     AUDIO ENDED
  --------------------------------------------------- */

  storyAudio.addEventListener(
    "ended",
    () => {

      if (playPauseButton) {
        playPauseButton.textContent = "▶";
      }

      if (audioProgress) {
        audioProgress.value = 0;
      }

    }
  );

}


/* -----------------------------------------------------
   SCRUB AUDIO
----------------------------------------------------- */

if (audioProgress) {

  audioProgress.addEventListener(
    "input",
    () => {

      if (!storyAudio ||
          !storyAudio.duration) {
        return;
      }

      storyAudio.currentTime =
        (audioProgress.value / 100) *
        storyAudio.duration;

    }
  );

}


/* =====================================================
   START AUDIO WHEN HOTSPOT OPENS
===================================================== */

const originalOpenHotspot =
  window.openHotspot;

window.openHotspot = function(id) {

  if (typeof originalOpenHotspot === "function") {

    originalOpenHotspot(id);

  }

  /*
     Reset audio whenever a new hotspot opens.
  */

  if (storyAudio) {

    storyAudio.pause();

    storyAudio.currentTime = 0;

  }

  if (playPauseButton) {
    playPauseButton.textContent = "▶";
  }

  if (audioProgress) {
    audioProgress.value = 0;
  }

  if (audioCurrentTime) {
    audioCurrentTime.textContent = "00:00";
  }

};
