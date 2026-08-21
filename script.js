/* =====================================================
   REKH WEBAR — SCRIPT
   One-hotspot stable version
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
    image.src = storyFrames[currentStory];
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


function toggleSetting(button) {

  if (button) {
    button.classList.toggle("active");
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

  title: "THE CROWN & FACE",

  subtitle: "How the vessel was held",

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

  } else {

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
    target.dataset.listenersAttached === "true"
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

    found.classList.add(
      "visible"
    );

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


  const hotspotHandler = event => {

    event.preventDefault();

    event.stopPropagation();

    console.log(
      "HOTSPOT 1 CLICKED"
    );


    selectHotspot(
      hotspot1Content.number,
      hotspot1Content.title,
      hotspot1Content.description
    );

  };


  /* Desktop */

  hotspot1.addEventListener(
    "click",
    hotspotHandler
  );


  /* Mobile */

  hotspot1.addEventListener(
    "touchend",
    hotspotHandler,
    {
      passive: false
    }
  );


  hotspotListenersAttached = true;


  console.log(
    "ONE HOTSPOT LISTENER ATTACHED"
  );
}


/* =====================================================
   IMPORTANT NEW PART
   TAP A HOTSPOT TO EXPLORE UI
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


  /*
     Make the UI itself clickable.
  */

  hotspotUI.style.pointerEvents =
    "auto";

  hotspotUI.style.cursor =
    "pointer";


  /*
     CLICK / TAP
  */

  hotspotUI.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      /*
         Only work after the user has
         entered hotspot mode.
      */

      if (!hotspotMode) {

        console.log(
          "HOTSPOT UI CLICK IGNORED — NOT IN HOTSPOT MODE"
        );

        return;
      }


      console.log(
        "TAP A HOTSPOT TO EXPLORE CLICKED"
      );


      /*
         Open the same card as the
         actual yellow hotspot.
      */

      selectHotspot(
        hotspot1Content.number,
        hotspot1Content.title,
        hotspot1Content.description
      );

    }
  );


  hotspotUIListenerAttached = true;


  console.log(
    "HOTSPOT UI LISTENER ATTACHED"
  );
}


/* =====================================================
   ENTER HOTSPOT MODE
===================================================== */

function enterHotspotMode() {

  console.log(
    "================================="
  );

  console.log(
    "EXPLORE ARTIFACT CLICKED"
  );

  console.log(
    "artifactIsFound:",
    artifactIsFound
  );

  console.log(
    "================================="
  );


  /*
     Do not block this because of
     artifactIsFound.

     The button is only shown after
     artifact detection anyway.
  */

  hotspotMode = true;

  selectedHotspot = null;


  /* =================================================
     HIDE ARTIFACT FOUND CARD
  ================================================= */

  const found =
    document.getElementById(
      "artifactFound"
    );

  if (found) {

    found.classList.remove(
      "visible"
    );

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
     SHOW TAP HOTSPOT UI
  ================================================= */

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );

  if (hotspotUI) {

    hotspotUI.classList.add(
      "visible"
    );

    hotspotUI.style.display = "block";

    hotspotUI.style.pointerEvents =
      "auto";

    hotspotUI.style.cursor =
      "pointer";

  }


  console.log(
    "HOTSPOT MODE ACTIVE"
  );
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


  /*
     Hide everything first.
  */

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


  /*
     Show ONLY hotspot 1.
  */

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


    console.log(
      "HOTSPOT 1 IS NOW VISIBLE"
    );

  }

  else {

    console.error(
      "HOTSPOT 1 DOES NOT EXIST"
    );

  }
}


/* =====================================================
   HIDE ALL HOTSPOTS
===================================================== */

function hideHotspots() {

  const hotspots = [
    document.getElementById("hotspot1"),
    document.getElementById("hotspot2"),
    document.getElementById("hotspot3")
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


  /* =================================================
     CHANGE HOTSPOT TO SELECTED
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
     HIDE TAP HOTSPOT INSTRUCTION
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


  console.log(
    "HOTSPOT STORY CARD OPENED"
  );
}


/* =====================================================
   CLOSE HOTSPOT
===================================================== */

function closeHotspot() {

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


  /*
     Return to hotspot mode.
  */

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
     STOP AUDIO
  ================================================= */

  const audio =
    document.getElementById(
      "storyAudio"
    );


  if (audio) {

    audio.pause();

  }
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

    console.warn(
      "storyAudio element not found."
    );

    return;
  }


  if (storyAudioReady) {

    updateAudioDuration();

    return;
  }


  storyAudioReady = true;


  /* =================================================
     METADATA LOADED
  ================================================= */

  audio.addEventListener(
    "loadedmetadata",
    () => {

      updateAudioDuration();

    }
  );


  /* =================================================
     AUDIO PLAYING
  ================================================= */

  audio.addEventListener(
    "play",
    () => {

      const button =
        document.getElementById(
          "playPauseButton"
        );


      if (button) {

        button.textContent =
          "Ⅱ";

      }

    }
  );


  /* =================================================
     AUDIO PAUSED
  ================================================= */

  audio.addEventListener(
    "pause",
    () => {

      const button =
        document.getElementById(
          "playPauseButton"
        );


      if (button) {

        button.textContent =
          "▶";

      }

    }
  );


  /* =================================================
     AUDIO FINISHED
  ================================================= */

  audio.addEventListener(
    "ended",
    () => {

      const button =
        document.getElementById(
          "playPauseButton"
        );


      if (button) {

        button.textContent =
          "▶";

      }

    }
  );


  /* =================================================
     UPDATE PROGRESS
  ================================================= */

  audio.addEventListener(
    "timeupdate",
    updateAudioProgress
  );


  /* =================================================
     PROGRESS SLIDER
  ================================================= */

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
    String(minutes).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0")
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


  if (audio.paused) {

    audio.play()
      .then(() => {

        console.log(
          "STORY AUDIO PLAYING"
        );

      })
      .catch(error => {

        console.error(
          "Audio playback failed:",
          error
        );

      });

  }

  else {

    audio.pause();

  }
}


/* =====================================================
   REWIND AUDIO
===================================================== */

function rewindStoryAudio() {

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
   EXIT AR
===================================================== */

function exitAR() {

  console.log(
    "EXITING AR"
  );


  const audio =
    document.getElementById(
      "storyAudio"
    );


  if (audio) {

    audio.pause();

    audio.currentTime = 0;

  }


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


  arStarted = false;
  arReady = false;
  artifactIsFound = false;
  hotspotMode = false;
  selectedHotspot = null;


  hideHotspots();


  showScreen("setup");
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


    /*
       Prepare actual AR hotspot.
    */

    setupHotspots();


    /*
       IMPORTANT:
       Prepare the "Tap a hotspot to explore"
       UI as a clickable element.
    */

    setupHotspotUI();


    /*
       Prepare audio.
    */

    setupStoryAudio();

  }
);
