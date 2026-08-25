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
   =====================================================
   3D ARTIFACT VIEW
   =====================================================
===================================================== */


/* =====================================================
   3D STATE
===================================================== */

let artifact3DVisible = false;

let artifact3DLoaded = false;

let handTrackingActive = false;

let handVideo = null;

let handStream = null;

let handsProcessor = null;

let handCamera = null;

let lastHandX = null;

let currentModelRotation = 0;

let handTrackingStarting = false;

let arWasRunningBefore3D = false;


/* =====================================================
   GET 3D MODEL ELEMENT
===================================================== */

function getArtifact3D() {

  return document.getElementById(
    "artifact3D"
  );

}


/* =====================================================
   SHOW 3D MODEL
===================================================== */

async function showArtifact3D() {

  console.log(
    "OPENING 3D ARTIFACT VIEW"
  );

  triggerHaptic("open");

  artifact3DVisible = true;

  hide3DButton();


  const ui =
    document.getElementById(
      "artifact3DUI"
    );

  const loading =
    document.getElementById(
      "artifact3DLoading"
    );

  const model =
    getArtifact3D();


  /* =================================================
     SHOW 3D UI
  ================================================= */

  if (ui) {

    ui.classList.add("visible");

  }


  if (loading) {

    loading.classList.add("visible");

  }


  /* =================================================
     HIDE STORY
  ================================================= */

  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );

  if (hotspotInfo) {

    hotspotInfo.classList.remove(
      "visible"
    );

  }


  /* =================================================
     HIDE HOTSPOTS
  ================================================= */

  hideHotspots();


  /* =================================================
     RESET MODEL ROTATION
  ================================================= */

  currentModelRotation = 0;

  lastHandX = null;

  if (model) {

    model.setAttribute(
      "visible",
      "true"
    );

    model.setAttribute(
      "rotation",
      "0 0 0"
    );

  }


  /* =================================================
     STOP MINDAR
     
     This releases the phone camera before
     MediaPipe requests its own camera stream.
  ================================================= */

  arWasRunningBefore3D =
    arStarted;


  if (arStarted) {

    stopMindAR();

  }


  /*
     Give the browser a moment to release
     the MindAR camera.
  */

  await wait(500);


  /* =================================================
     START HAND TRACKING
  ================================================= */

  await startHandTracking();

}


/* =====================================================
   CLOSE 3D VIEW
===================================================== */

async function closeArtifact3D() {

  console.log(
    "CLOSING 3D ARTIFACT VIEW"
  );

  triggerHaptic("close");

  artifact3DVisible = false;


  /* =================================================
     STOP HAND TRACKING
  ================================================= */

  stopHandTracking();


  /* =================================================
     HIDE 3D MODEL
  ================================================= */

  const model =
    getArtifact3D();

  if (model) {

    model.setAttribute(
      "visible",
      "false"
    );

  }


  /* =================================================
     HIDE 3D UI
  ================================================= */

  const ui =
    document.getElementById(
      "artifact3DUI"
    );

  if (ui) {

    ui.classList.remove(
      "visible"
    );

  }


  const loading =
    document.getElementById(
      "artifact3DLoading"
    );

  if (loading) {

    loading.classList.remove(
      "visible"
    );

  }


  /* =================================================
     RESET HAND TRACKING
  ================================================= */

  lastHandX = null;

  currentModelRotation = 0;


  /* =================================================
     RESTART MINDAR
  ================================================= */

  if (arWasRunningBefore3D) {

    await wait(400);

    arStarted = false;

    startAR();

  }


  /*
     Return to hotspot mode.
  */

  hotspotMode = true;

  showOneHotspot();


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

  }


  show3DButton();

}


/* =====================================================
   STOP MINDAR
===================================================== */

function stopMindAR() {

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

    return;

  }

  try {

    mindar.stop();

    arStarted = false;

    arReady = false;

    console.log(
      "MindAR stopped for 3D mode."
    );

  }

  catch (error) {

    console.warn(
      "Could not stop MindAR:",
      error
    );

  }

}


/* =====================================================
   WAIT HELPER
===================================================== */

function wait(milliseconds) {

  return new Promise(
    resolve => {

      setTimeout(
        resolve,
        milliseconds
      );

    }
  );

}


/* =====================================================
   START HAND TRACKING
===================================================== */

async function startHandTracking() {

  if (handTrackingActive) {

    return;

  }

  if (handTrackingStarting) {

    return;

  }

  handTrackingStarting = true;

  console.log(
    "STARTING HAND TRACKING..."
  );


  /* =================================================
     CHECK MEDIAPIPE
  ================================================= */

  if (
    typeof Hands === "undefined"
  ) {

    console.error(
      "MediaPipe Hands library not loaded."
    );

    handTrackingStarting = false;

    hide3DLoading();

    alert(
      "Hand tracking could not load. Please refresh the page and try again."
    );

    return;

  }


  /* =================================================
     CHECK CAMERA API
  ================================================= */

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    console.error(
      "Camera API not available."
    );

    handTrackingStarting = false;

    hide3DLoading();

    alert(
      "Hand tracking requires camera access. Please use the HTTPS GitHub Pages version of the app."
    );

    return;

  }


  try {

    /* =================================================
       CREATE HIDDEN VIDEO
    ================================================= */

    handVideo =
      document.createElement("video");

    handVideo.id =
      "handTrackingVideo";

    handVideo.autoplay = true;

    handVideo.muted = true;

    handVideo.playsInline = true;

    handVideo.setAttribute(
      "playsinline",
      ""
    );

    handVideo.style.position =
      "fixed";

    handVideo.style.left =
      "-9999px";

    handVideo.style.top =
      "-9999px";

    handVideo.style.width =
      "1px";

    handVideo.style.height =
      "1px";

    handVideo.style.opacity =
      "0";

    handVideo.style.pointerEvents =
      "none";

    document.body.appendChild(
      handVideo
    );


    /* =================================================
       REQUEST CAMERA
       
       Rear/environment camera is preferred.
    ================================================= */

    handStream =
      await navigator.mediaDevices.getUserMedia({

        video: {

          facingMode: {
            ideal: "environment"
          },

          width: {
            ideal: 640
          },

          height: {
            ideal: 480
          },

          frameRate: {
            ideal: 30,
            max: 30
          }

        },

        audio: false

      });


    handVideo.srcObject =
      handStream;


    await handVideo.play();


    /* =================================================
       INITIALISE MEDIAPIPE HANDS
    ================================================= */

    handsProcessor =
      new Hands({

        locateFile: file => {

          return (
            "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" +
            file
          );

        }

      });


    handsProcessor.setOptions({

      maxNumHands: 1,

      modelComplexity: 1,

      minDetectionConfidence: 0.6,

      minTrackingConfidence: 0.6

    });


    handsProcessor.onResults(
      handleHandResults
    );


    /* =================================================
       MEDIAPIPE CAMERA LOOP
    ================================================= */

    handCamera =
      new Camera(
        handVideo,
        {

          onFrame: async () => {

            if (
              !artifact3DVisible ||
              !handsProcessor
            ) {

              return;

            }

            try {

              await handsProcessor.send({

                image:
                  handVideo

              });

            }

            catch (error) {

              console.warn(
                "Hand tracking frame error:",
                error
              );

            }

          },

          width: 640,

          height: 480

        }
      );


    handCamera.start();

    handTrackingActive = true;

    handTrackingStarting = false;

    console.log(
      "HAND TRACKING ACTIVE"
    );

    hide3DLoading();

  }

  catch (error) {

    console.error(
      "HAND TRACKING CAMERA ERROR:",
      error
    );

    handTrackingStarting = false;

    handTrackingActive = false;

    hide3DLoading();


    /*
       Clean up if camera permission
       or stream creation failed.
    */

    stopHandTracking();


    alert(
      "Camera access is needed to rotate the 3D artifact with your hand. Please allow camera access and try again."
    );

  }

}


/* =====================================================
   HANDLE HAND TRACKING RESULTS
===================================================== */

function handleHandResults(results) {

  if (
    !artifact3DVisible
  ) {

    return;

  }

  if (
    !results ||
    !results.multiHandLandmarks ||
    results.multiHandLandmarks.length === 0
  ) {

    lastHandX = null;

    return;

  }


  const landmarks =
    results.multiHandLandmarks[0];

  if (
    !landmarks ||
    landmarks.length < 21
  ) {

    return;

  }


  /* =================================================
     USE PALM CENTRE
     
     Using multiple points makes rotation
     more stable than using one fingertip.
  ================================================= */

  const palmPoints = [

    landmarks[0],

    landmarks[5],

    landmarks[9],

    landmarks[13],

    landmarks[17]

  ];


  let palmX = 0;


  palmPoints.forEach(
    point => {

      palmX += point.x;

    }
  );


  palmX /=
    palmPoints.length;


  /* =================================================
     FIRST FRAME
  ================================================= */

  if (lastHandX === null) {

    lastHandX = palmX;

    return;

  }


  /* =================================================
     CALCULATE HAND MOVEMENT
  ================================================= */

  const movement =
    palmX - lastHandX;


  lastHandX = palmX;


  /*
     Ignore tiny hand movements.
  */

  if (
    Math.abs(movement) < 0.004
  ) {

    return;

  }


  /* =================================================
     ROTATE MODEL
     
     MediaPipe x:
     0 = left
     1 = right

     Moving hand right rotates model right.
  ================================================= */

  const sensitivity = 320;

  currentModelRotation +=
    movement * sensitivity;


  /* =================================================
     LIMIT ROTATION VALUE
     
     Prevents the number from becoming
     extremely large over time.
  ================================================= */

  if (
    currentModelRotation > 360 ||
    currentModelRotation < -360
  ) {

    currentModelRotation =
      currentModelRotation % 360;

  }


  /* =================================================
     APPLY ROTATION
  ================================================= */

  const model =
    getArtifact3D();

  if (!model) {

    return;

  }

  model.setAttribute(
    "rotation",
    {
      x: 0,
      y: currentModelRotation,
      z: 0
    }
  );

}


/* =====================================================
   STOP HAND TRACKING
===================================================== */

function stopHandTracking() {

  console.log(
    "STOPPING HAND TRACKING"
  );


  handTrackingActive =
    false;

  handTrackingStarting =
    false;

  lastHandX =
    null;


  /* =================================================
     STOP MEDIAPIPE CAMERA
  ================================================= */

  if (handCamera) {

    try {

      handCamera.stop();

    }

    catch (error) {

      console.warn(
        "Hand camera stop error:",
        error
      );

    }

    handCamera =
      null;

  }


  /* =================================================
     CLOSE MEDIAPIPE
  ================================================= */

  if (handsProcessor) {

    try {

      handsProcessor.close();

    }

    catch (error) {

      console.warn(
        "Hands processor close error:",
        error
      );

    }

    handsProcessor =
      null;

  }


  /* =================================================
     STOP CAMERA TRACKS
  ================================================= */

  if (handStream) {

    handStream
      .getTracks()
      .forEach(
        track => {

          track.stop();

        }
      );

    handStream =
      null;

  }


  /* =================================================
     REMOVE VIDEO
  ================================================= */

  if (handVideo) {

    handVideo.pause();

    handVideo.srcObject =
      null;

    if (
      handVideo.parentNode
    ) {

      handVideo.parentNode.removeChild(
        handVideo
      );

    }

    handVideo =
      null;

  }

}


/* =====================================================
   HIDE 3D LOADING
===================================================== */

function hide3DLoading() {

  const loading =
    document.getElementById(
      "artifact3DLoading"
    );

  if (loading) {

    loading.classList.remove(
      "visible"
    );

  }

}


/* =====================================================
   3D MODEL LOADED
===================================================== */

function setup3DModel() {

  const model =
    getArtifact3D();

  if (!model) {

    console.warn(
      "3D artifact entity not found."
    );

    return;

  }


  model.addEventListener(
    "model-loaded",
    () => {

      artifact3DLoaded =
        true;

      console.log(
        "3D ARTIFACT MODEL LOADED"
      );

      hide3DLoading();

    }
  );


  model.addEventListener(
    "model-error",
    event => {

      console.error(
        "3D MODEL ERROR:",
        event
      );

      hide3DLoading();

      alert(
        "The 3D artifact could not be loaded. Please check the GLB file path."
      );

    }
  );

}


/* =====================================================
   OPTIONAL TOUCH FALLBACK
===================================================== */

/*
   If hand tracking is unavailable, the user can
   still rotate the artifact by dragging on it.

   This does NOT replace hand tracking.
*/

let touchRotationActive = false;

let touchStartX = 0;


function setup3DTouchFallback() {

  const model =
    getArtifact3D();

  if (!model) {

    return;

  }


  const scene =
    document.getElementById(
      "mindarScene"
    );

  if (!scene) {

    return;

  }


  const canvas =
    scene.querySelector(
      "canvas"
    );

  if (!canvas) {

    return;

  }


  canvas.addEventListener(
    "touchstart",
    event => {

      if (!artifact3DVisible) {

        return;

      }

      if (
        !event.touches ||
        !event.touches.length
      ) {

        return;

      }

      touchRotationActive =
        true;

      touchStartX =
        event.touches[0].clientX;

    },
    {
      passive: true
    }
  );


  canvas.addEventListener(
    "touchmove",
    event => {

      if (
        !artifact3DVisible ||
        !touchRotationActive
      ) {

        return;

      }

      if (
        !event.touches ||
        !event.touches.length
      ) {

        return;

      }

      const currentX =
        event.touches[0].clientX;

      const movement =
        currentX - touchStartX;

      touchStartX =
        currentX;


      currentModelRotation +=
        movement * 0.8;


      model.setAttribute(
        "rotation",
        {
          x: 0,
          y: currentModelRotation,
          z: 0
        }
      );

    },
    {
      passive: true
    }
  );


  canvas.addEventListener(
    "touchend",
    () => {

      touchRotationActive =
        false;

    },
    {
      passive: true
    }
  );

}


/* =====================================================
   EXIT AR
===================================================== */

function exitAR() {

  triggerHaptic("close");

  console.log(
    "EXITING AR"
  );


  /* =================================================
     CLOSE 3D MODE IF ACTIVE
  ================================================= */

  if (artifact3DVisible) {

    stopHandTracking();

    artifact3DVisible =
      false;

  }


  /* =================================================
     STOP AUDIO
  ================================================= */

  const audio =
    document.getElementById(
      "storyAudio"
    );

  if (audio) {

    audio.pause();

    audio.currentTime = 0;

  }


  /* =================================================
     STOP MINDAR
  ================================================= */

  const scene =
    document.getElementById(
      "mindarScene"
    );

  if (scene) {

    const mindar =
      scene.systems[
        "mindar-image-system"
      ];

    if (mindar) {

      try {

        mindar.stop();

      }

      catch (error) {

        console.log(
          "MindAR stop:",
          error
        );

      }

    }

  }


  /* =================================================
     RESET AR STATE
  ================================================= */

  arStarted =
    false;

  arReady =
    false;

  artifactIsFound =
    false;

  hotspotMode =
    false;

  selectedHotspot =
    null;


  /* =================================================
     HIDE 3D
  ================================================= */

  const model =
    getArtifact3D();

  if (model) {

    model.setAttribute(
      "visible",
      "false"
    );

  }


  const ui =
    document.getElementById(
      "artifact3DUI"
    );

  if (ui) {

    ui.classList.remove(
      "visible"
    );

  }


  hide3DButton();

  hideHotspots();


  /* =================================================
     RETURN TO SETUP
  ================================================= */

  showScreen(
    "setup"
  );

}


/* =====================================================
   INITIALISE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "Rekh WebAR loaded."
    );


    /* =================================================
       HOTSPOTS
    ================================================= */

    setupHotspots();

    setupHotspotUI();


    /* =================================================
       AUDIO
    ================================================= */

    setupStoryAudio();


    /* =================================================
       3D MODEL
    ================================================= */

    setup3DModel();

    setup3DTouchFallback();


    /* =================================================
       HAPTIC BUTTONS
    ================================================= */

    const exploreButton =
      document.getElementById(
        "exploreArtifactButton"
      );

    if (exploreButton) {

      addHapticToButton(
        exploreButton,
        "open"
      );

    }


    const closeButton =
      document.querySelector(
        "#hotspotInfo .hotspot-close"
      );

    if (closeButton) {

      addHapticToButton(
        closeButton,
        "close"
      );

    }


    const playButton =
      document.getElementById(
        "playPauseButton"
      );

    if (playButton) {

      addHapticToButton(
        playButton,
        "play"
      );

    }


    const rewindButton =
      document.getElementById(
        "rewindButton"
      );

    if (rewindButton) {

      addHapticToButton(
        rewindButton,
        "rewind"
      );

    }


    /* =================================================
       3D BUTTON HAPTIC
    ================================================= */

    const view3DButton =
      document.getElementById(
        "view3DButton"
      );

    if (view3DButton) {

      addHapticToButton(
        view3DButton,
        "open"
      );

    }


    /* =================================================
       3D CLOSE BUTTON HAPTIC
    ================================================= */

    const close3DButton =
      document.querySelector(
        ".artifact-3d-close"
      );

    if (close3DButton) {

      addHapticToButton(
        close3DButton,
        "close"
      );

    }


    console.log(
      "Rekh WebAR initialisation complete."
    );

  }
);
