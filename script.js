/* =====================================================
   REKH WEBAR — SCRIPT
   AR + HOTSPOTS + AUDIO + HAPTICS
   + 3D ARTIFACT VIEW
   + HAND TRACKING ROTATION
===================================================== */


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
   LOADING SCREEN
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

    image.src =
      storyFrames[currentStory];

  }

  document.querySelectorAll(".dot").forEach(
    (dot, i) => {

      dot.classList.toggle(
        "active",
        i === currentStory
      );

    }
  );

}


/* =====================================================
   ACCESSIBILITY
===================================================== */

function openAccessibility() {

  const overlay =
    document.getElementById(
      "accessibilityOverlay"
    );

  const continueButton =
    document.getElementById(
      "setupContinue"
    );

  if (overlay) {

    overlay.classList.add("open");

  }

  if (continueButton) {

    continueButton.classList.remove("show");

  }

}


function closeAccessibility() {

  const overlay =
    document.getElementById(
      "accessibilityOverlay"
    );

  const continueButton =
    document.getElementById(
      "setupContinue"
    );

  if (overlay) {

    overlay.classList.remove("open");

  }

  if (continueButton) {

    continueButton.classList.add("show");

  }

}


/* =====================================================
   HAPTIC FEEDBACK
===================================================== */

let hapticsEnabled = true;


const HAPTIC_PATTERNS = {

  tap: 35,

  select: 55,

  success: [40, 40, 40],

  open: 70,

  close: 35,

  toggle: 45,

  rewind: 35,

  play: 30

};


function hapticsSupported() {

  return (
    "vibrate" in navigator &&
    typeof navigator.vibrate === "function"
  );

}


function triggerHaptic(type = "tap") {

  if (!hapticsEnabled) {

    return false;

  }

  if (!hapticsSupported()) {

    console.warn(
      "Haptic feedback is not supported."
    );

    return false;

  }

  const pattern =
    HAPTIC_PATTERNS[type] ||
    HAPTIC_PATTERNS.tap;

  try {

    return navigator.vibrate(pattern);

  }

  catch (error) {

    console.error(
      "Haptic error:",
      error
    );

    return false;

  }

}


function addHapticToButton(
  element,
  type = "tap"
) {

  if (!element) {

    return;

  }

  element.addEventListener(
    "pointerdown",
    () => {

      triggerHaptic(type);

    },
    {
      passive: true
    }
  );

}


/* =====================================================
   ACCESSIBILITY TOGGLE
===================================================== */

function toggleSetting(button) {

  if (!button) {

    return;

  }

  button.classList.toggle("active");

  const row =
    button.closest(".accessibility-row");

  const label =
    row
      ? row.querySelector(
          ".accessibility-label h2"
        )
      : null;

  const isHapticToggle =
    label &&
    label.textContent
      .trim()
      .toLowerCase() ===
      "haptic feedback";

  if (isHapticToggle) {

    hapticsEnabled =
      button.classList.contains("active");

    console.log(
      "HAPTIC FEEDBACK:",
      hapticsEnabled
        ? "ON"
        : "OFF"
    );

    if (hapticsEnabled) {

      triggerHaptic("toggle");

    }

  }

}


/* =====================================================
   AR STATE
===================================================== */

let arStarted = false;

let arReady = false;

let artifactIsFound = false;

let hotspotMode = false;

let selectedHotspot = null;

let hotspotListenersAttached = false;

let hotspotUIListenerAttached = false;


/* =====================================================
   HOTSPOT CONTENT
===================================================== */

const hotspot1Content = {

  number: 1,

  title:
    "THE CROWN & FACE",

  subtitle:
    "How the vessel was held",

  description:
    "The calm face and elaborate crown give Vishnu a composed, authoritative presence. In sacred sculpture, such details communicate the deity's divine and royal character."

};


/* =====================================================
   CONTINUE → AR
===================================================== */

function continueSetup() {

  console.log(
    "CONTINUE CLICKED — STARTING AR"
  );

  showScreen("arScreen");

  startAR();

}


/* =====================================================
   START MINDAR
===================================================== */

function startAR() {

  const scene =
    document.getElementById(
      "mindarScene"
    );

  if (!scene) {

    console.error(
      "MindAR scene not found."
    );

    return;

  }

  if (arStarted) {

    console.log(
      "MindAR already started."
    );

    return;

  }

  setupARTarget();

  if (scene.hasLoaded) {

    launchMindAR();

  }

  else {

    scene.addEventListener(
      "loaded",
      launchMindAR,
      {
        once: true
      }
    );

  }

}


/* =====================================================
   LAUNCH MINDAR
===================================================== */

function launchMindAR() {

  const scene =
    document.getElementById(
      "mindarScene"
    );

  if (!scene) {

    return;

  }

  const mindar =
    scene.systems[
      "mindar-image-system"
    ];

  if (!mindar) {

    console.error(
      "MindAR image system not found."
    );

    return;

  }

  if (arStarted) {

    return;

  }

  console.log(
    "MindAR system found."
  );

  try {

    mindar.start();

    arStarted = true;

    console.log(
      "MindAR camera starting..."
    );

  }

  catch (error) {

    console.error(
      "Could not start MindAR:",
      error
    );

    alert(
      "Camera could not start. Please allow camera access and reload the page."
    );

  }

}


/* =====================================================
   AR TARGET SETUP
===================================================== */

function setupARTarget() {

  const scene =
    document.getElementById(
      "mindarScene"
    );

  const target =
    document.getElementById(
      "vishnuTarget"
    );

  if (!scene || !target) {

    console.error(
      "AR scene or Vishnu target not found."
    );

    return;

  }

  if (
    target.dataset.listenersAttached ===
    "true"
  ) {

    return;

  }

  target.dataset.listenersAttached =
    "true";


  /* =================================================
     CAMERA READY
  ================================================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "MindAR READY — CAMERA IS RUNNING"
      );

      arReady = true;

      showScanning();

    }
  );


  /* =================================================
     CAMERA ERROR
  ================================================= */

  scene.addEventListener(
    "arError",
    event => {

      console.error(
        "MindAR ERROR:",
        event
      );

      alert(
        "Camera could not start. Please allow camera access and reload the page."
      );

    }
  );


  /* =================================================
     ARTIFACT FOUND
  ================================================= */

  target.addEventListener(
    "targetFound",
    () => {

      console.log(
        "VISHNU ARTIFACT FOUND"
      );

      artifactIsFound = true;

      hotspotMode = false;

      selectedHotspot = null;

      showArtifactFound();

      hideHotspots();

    }
  );


  /* =================================================
     ARTIFACT LOST
  ================================================= */

  target.addEventListener(
    "targetLost",
    () => {

      console.log(
        "VISHNU ARTIFACT LOST"
      );

      artifactIsFound = false;

      if (!hotspotMode) {

        showScanning();

      }

    }
  );


  setupHotspots();

}


/* =====================================================
   SCANNING UI
===================================================== */

function showScanning() {

  const message =
    document.getElementById(
      "scanMessage"
    );

  const frame =
    document.getElementById(
      "scanFrame"
    );

  const search =
    document.getElementById(
      "searchIcon"
    );

  const status =
    document.getElementById(
      "scanStatus"
    );

  const found =
    document.getElementById(
      "artifactFound"
    );


  if (message) {

    message.style.display = "block";

  }

  if (frame) {

    frame.style.display = "block";

  }

  if (search) {

    search.style.display = "flex";

  }

  if (status) {

    status.style.display = "block";

  }

  if (found) {

    found.classList.remove("visible");

    found.style.display = "";

  }

  hideHotspots();

}


/* =====================================================
   ARTIFACT FOUND UI
===================================================== */

function showArtifactFound() {

  const message =
    document.getElementById(
      "scanMessage"
    );

  const frame =
    document.getElementById(
      "scanFrame"
    );

  const search =
    document.getElementById(
      "searchIcon"
    );

  const status =
    document.getElementById(
      "scanStatus"
    );

  const found =
    document.getElementById(
      "artifactFound"
    );


  if (message) {

    message.style.display = "none";

  }

  if (frame) {

    frame.style.display = "none";

  }

  if (search) {

    search.style.display = "none";

  }

  if (status) {

    status.style.display = "none";

  }

  if (found) {

    found.classList.add("visible");

    found.style.display = "";

  }

  hotspotMode = false;

  hideHotspots();

}


/* =====================================================
   HOTSPOT SETUP
===================================================== */

function setupHotspots() {

  if (hotspotListenersAttached) {

    return;

  }

  const hotspot1 =
    document.getElementById(
      "hotspot1"
    );

  if (!hotspot1) {

    console.error(
      "hotspot1 not found."
    );

    return;

  }


  const hotspotHandler =
    event => {

      event.preventDefault();

      event.stopPropagation();

      console.log(
        "HOTSPOT 1 CLICKED"
      );

      triggerHaptic("select");

      selectHotspot(
        hotspot1Content.number,
        hotspot1Content.title,
        hotspot1Content.description
      );

    };


  hotspot1.addEventListener(
    "click",
    hotspotHandler
  );


  hotspot1.addEventListener(
    "touchend",
    hotspotHandler,
    {
      passive: false
    }
  );


  addHapticToButton(
    hotspot1,
    "select"
  );


  hotspotListenersAttached = true;

}


/* =====================================================
   HOTSPOT UI
===================================================== */

function setupHotspotUI() {

  if (hotspotUIListenerAttached) {

    return;

  }

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );

  if (!hotspotUI) {

    console.warn(
      "hotspotUI not found."
    );

    return;

  }

  hotspotUI.style.pointerEvents =
    "auto";

  hotspotUI.style.cursor =
    "pointer";


  addHapticToButton(
    hotspotUI,
    "tap"
  );


  hotspotUI.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      if (!hotspotMode) {

        return;

      }

      selectHotspot(
        hotspot1Content.number,
        hotspot1Content.title,
        hotspot1Content.description
      );

    }
  );


  hotspotUIListenerAttached = true;

}


/* =====================================================
   ENTER HOTSPOT MODE
===================================================== */

function enterHotspotMode() {

  console.log(
    "EXPLORE ARTIFACT CLICKED"
  );

  hotspotMode = true;

  triggerHaptic("open");

  selectedHotspot = null;


  /* =================================================
     HIDE ARTIFACT FOUND CARD
  ================================================= */

  const found =
    document.getElementById(
      "artifactFound"
    );

  if (found) {

    found.classList.remove("visible");

    found.style.display = "none";

  }


  /* =================================================
     HIDE SCANNING UI
  ================================================= */

  const message =
    document.getElementById(
      "scanMessage"
    );

  const frame =
    document.getElementById(
      "scanFrame"
    );

  const search =
    document.getElementById(
      "searchIcon"
    );

  const status =
    document.getElementById(
      "scanStatus"
    );


  if (message) {

    message.style.display = "none";

  }

  if (frame) {

    frame.style.display = "none";

  }

  if (search) {

    search.style.display = "none";

  }

  if (status) {

    status.style.display = "none";

  }


  /* =================================================
     SHOW ONE HOTSPOT
  ================================================= */

  showOneHotspot();


  /* =================================================
     SHOW HOTSPOT UI
  ================================================= */

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );

  if (hotspotUI) {

    hotspotUI.classList.add("visible");

    hotspotUI.style.display = "block";

    hotspotUI.style.pointerEvents =
      "auto";

    hotspotUI.style.cursor =
      "pointer";

  }

}


/* =====================================================
   SHOW ONE HOTSPOT
===================================================== */

function showOneHotspot() {

  const hotspot1 =
    document.getElementById(
      "hotspot1"
    );

  const hotspot2 =
    document.getElementById(
      "hotspot2"
    );

  const hotspot3 =
    document.getElementById(
      "hotspot3"
    );


  if (hotspot1) {

    hotspot1.setAttribute(
      "visible",
      "false"
    );

  }

  if (hotspot2) {

    hotspot2.setAttribute(
      "visible",
      "false"
    );

  }

  if (hotspot3) {

    hotspot3.setAttribute(
      "visible",
      "false"
    );

  }


  if (hotspot1) {

    hotspot1.setAttribute(
      "src",
      "assets/images/Hotspot.png"
    );

    hotspot1.setAttribute(
      "visible",
      "true"
    );

    hotspot1.setAttribute(
      "class",
      "hotspot"
    );

  }

}


/* =====================================================
   HIDE ALL HOTSPOTS
===================================================== */

function hideHotspots() {

  const hotspots = [

    document.getElementById(
      "hotspot1"
    ),

    document.getElementById(
      "hotspot2"
    ),

    document.getElementById(
      "hotspot3"
    )

  ];


  hotspots.forEach(
    hotspot => {

      if (hotspot) {

        hotspot.setAttribute(
          "visible",
          "false"
        );

      }

    }
  );


  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );

  if (hotspotInfo) {

    hotspotInfo.classList.remove(
      "visible"
    );

  }


  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );

  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

    hotspotUI.style.pointerEvents =
      "none";

  }

}


/* =====================================================
   SELECT HOTSPOT
===================================================== */

function selectHotspot(
  number,
  title,
  description
) {

  console.log(
    "SELECTING HOTSPOT:",
    number
  );

  selectedHotspot = number;

  triggerHaptic("select");


  /* =================================================
     SELECT HOTSPOT ICON
  ================================================= */

  const selected =
    document.getElementById(
      "hotspot" + number
    );

  if (selected) {

    selected.setAttribute(
      "src",
      "assets/images/Hotspot Selected.png"
    );

  }


  /* =================================================
     TITLE
  ================================================= */

  const titleElement =
    document.getElementById(
      "hotspotTitle"
    );

  if (titleElement) {

    titleElement.textContent =
      title;

  }


  /* =================================================
     SUBTITLE
  ================================================= */

  const subtitleElement =
    document.getElementById(
      "hotspotSubtitle"
    );

  if (subtitleElement) {

    subtitleElement.textContent =
      hotspot1Content.subtitle;

  }


  /* =================================================
     DESCRIPTION
  ================================================= */

  const descriptionElement =
    document.getElementById(
      "hotspotDescription"
    );

  if (descriptionElement) {

    descriptionElement.textContent =
      description;

  }


  /* =================================================
     SHOW STORY CARD
  ================================================= */

  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );

  if (hotspotInfo) {

    hotspotInfo.classList.add(
      "visible"
    );

  }


  /* =================================================
     HIDE HOTSPOT UI
  ================================================= */

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );

  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

    hotspotUI.style.pointerEvents =
      "none";

  }


  /* =================================================
     PREPARE AUDIO
  ================================================= */

  setupStoryAudio();

}


/* =====================================================
   SHOW 3D BUTTON
===================================================== */

function show3DButton() {

  const button =
    document.getElementById(
      "view3DButton"
    );

  if (!button) {

    console.warn(
      "3D button not found."
    );

    return;

  }

  button.classList.add("visible");

  button.style.display = "flex";

}


/* =====================================================
   HIDE 3D BUTTON
===================================================== */

function hide3DButton() {

  const button =
    document.getElementById(
      "view3DButton"
    );

  if (!button) {

    return;

  }

  button.classList.remove("visible");

  button.style.display = "none";

}


/* =====================================================
   CLOSE HOTSPOT
===================================================== */

function closeHotspot() {

  triggerHaptic("close");


  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );

  if (hotspotInfo) {

    hotspotInfo.classList.remove(
      "visible"
    );

  }


  selectedHotspot = null;


  /* =================================================
     STOP AUDIO
  ================================================= */

  const audio =
    document.getElementById(
      "storyAudio"
    );

  if (audio) {

    audio.pause();

  }


  /* =================================================
     RETURN TO HOTSPOT MODE
  ================================================= */

  if (hotspotMode) {

    const hotspot1 =
      document.getElementById(
        "hotspot1"
      );

    if (hotspot1) {

      hotspot1.setAttribute(
        "src",
        "assets/images/Hotspot.png"
      );

      hotspot1.setAttribute(
        "visible",
        "true"
      );

    }


    const hotspotUI =
      document.getElementById(
        "hotspotUI"
      );

    if (hotspotUI) {

      hotspotUI.classList.add(
        "visible"
      );

      hotspotUI.style.display =
        "block";

      hotspotUI.style.pointerEvents =
        "auto";

      hotspotUI.style.cursor =
        "pointer";

    }

  }


  /* =================================================
     SHOW 3D OPTION
  ================================================= */

  show3DButton();

}


/* =====================================================
   STORY AUDIO
===================================================== */

let storyAudioReady = false;


function setupStoryAudio() {

  const audio =
    document.getElementById(
      "storyAudio"
    );

  if (!audio) {

    return;

  }

  if (storyAudioReady) {

    updateAudioDuration();

    return;

  }

  storyAudioReady = true;


  audio.addEventListener(
    "loadedmetadata",
    () => {

      updateAudioDuration();

    }
  );


  audio.addEventListener(
    "play",
    () => {

      const button =
        document.getElementById(
          "playPauseButton"
        );

      if (button) {

        button.textContent = "Ⅱ";

      }

    }
  );


  audio.addEventListener(
    "pause",
    () => {

      const button =
        document.getElementById(
          "playPauseButton"
        );

      if (button) {

        button.textContent = "▶";

      }

    }
  );


  audio.addEventListener(
    "ended",
    () => {

      const button =
        document.getElementById(
          "playPauseButton"
        );

      if (button) {

        button.textContent = "▶";

      }

    }
  );


  audio.addEventListener(
    "timeupdate",
    updateAudioProgress
  );


  const progress =
    document.getElementById(
      "audioProgress"
    );

  if (progress) {

    progress.addEventListener(
      "input",
      () => {

        if (!audio.duration) {

          return;

        }

        audio.currentTime =
          (
            progress.value / 100
          ) *
          audio.duration;

      }
    );

  }

  updateAudioDuration();

}


/* =====================================================
   UPDATE AUDIO DURATION
===================================================== */

function updateAudioDuration() {

  const audio =
    document.getElementById(
      "storyAudio"
    );

  const duration =
    document.getElementById(
      "audioDuration"
    );

  if (
    !audio ||
    !duration ||
    !isFinite(audio.duration)
  ) {

    return;

  }

  duration.textContent =
    formatTime(
      audio.duration
    );

}


/* =====================================================
   UPDATE AUDIO PROGRESS
===================================================== */

function updateAudioProgress() {

  const audio =
    document.getElementById(
      "storyAudio"
    );

  const progress =
    document.getElementById(
      "audioProgress"
    );

  const current =
    document.getElementById(
      "audioCurrentTime"
    );

  if (!audio) {

    return;

  }

  if (current) {

    current.textContent =
      formatTime(
        audio.currentTime
      );

  }

  if (
    progress &&
    audio.duration
  ) {

    progress.value =
      (
        audio.currentTime /
        audio.duration
      ) * 100;

  }

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(seconds) {

  if (
    !isFinite(seconds) ||
    seconds < 0
  ) {

    return "00:00";

  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  const secs =
    Math.floor(
      seconds % 60
    );

  return (

    String(minutes)
      .padStart(2, "0") +

    ":" +

    String(secs)
      .padStart(2, "0")

  );

}


/* =====================================================
   PLAY / PAUSE AUDIO
===================================================== */

function toggleStoryAudio() {

  const audio =
    document.getElementById(
      "storyAudio"
    );

  if (!audio) {

    console.error(
      "Audio element not found."
    );

    return;

  }

  triggerHaptic("play");

  if (audio.paused) {

    audio.play()
      .then(() => {

        console.log(
          "STORY AUDIO PLAYING"
        );

      })
      .catch(
        error => {

          console.error(
            "Audio playback failed:",
            error
          );

        }
      );

  }

  else {

    audio.pause();

  }

}


/* =====================================================
   REWIND AUDIO
===================================================== */

function rewindStoryAudio() {

  triggerHaptic("rewind");

  const audio =
    document.getElementById(
      "storyAudio"
    );

  if (!audio) {

    return;

  }

  audio.currentTime =
    Math.max(
      0,
      audio.currentTime - 10
    );

}
/* =====================================================
   3D ARTIFACT VIEW
===================================================== */

let artifactRotation = 0;


/* OPEN 3D VIEW */

function showArtifact3D() {

  console.log("Opening 3D artifact view");

  const view =
    document.getElementById("artifact3DView");

  const viewer =
    document.getElementById("artifactViewer");

  if (!view || !viewer) {

    console.error(
      "3D viewer elements not found"
    );

    return;
  }


  /* Hide the old AR interface */

  const artifactFound =
    document.getElementById("artifactFound");

  const hotspotUI =
    document.getElementById("hotspotUI");

  const hotspotInfo =
    document.getElementById("hotspotInfo");

  const view3DButton =
    document.getElementById("view3DButton");


  if (artifactFound) {
    artifactFound.style.display = "none";
  }

  if (hotspotUI) {
    hotspotUI.style.display = "none";
  }

  if (hotspotInfo) {
    hotspotInfo.style.display = "none";
  }

  if (view3DButton) {
    view3DButton.style.display = "none";
  }


  /* Show 3D screen */

  view.classList.add("visible");


  /* Reset rotation */

  artifactRotation = 0;

  viewer.cameraOrbit =
    "0deg 75deg 2.5m";


  /* Make sure model starts loading */

  viewer.setAttribute(
    "src",
    "assets/images/visnu_lokesvara17mb.glb"
  );

}


/* =====================================================
   ROTATE MODEL
===================================================== */

function rotateArtifact(amount) {

  const viewer =
    document.getElementById("artifactViewer");

  if (!viewer) return;


  artifactRotation += amount;


  viewer.cameraOrbit =
    `${artifactRotation}deg 75deg 2.5m`;
}


/* =====================================================
   RESET ROTATION
===================================================== */

function resetArtifactRotation() {

  const viewer =
    document.getElementById("artifactViewer");

  if (!viewer) return;


  artifactRotation = 0;

  viewer.cameraOrbit =
    "0deg 75deg 2.5m";
}


/* =====================================================
   CLOSE 3D VIEW
===================================================== */

function closeArtifact3D() {

  const view =
    document.getElementById("artifact3DView");

  if (!view) return;


  view.classList.remove("visible");


  /* Return to AR */

  const view3DButton =
    document.getElementById("view3DButton");

  if (view3DButton) {

    view3DButton.classList.add("visible");

  }

}
