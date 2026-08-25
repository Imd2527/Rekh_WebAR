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

  if (button) {
    button.classList.toggle("active");
  }

}


/* =====================================================
   HAPTIC FEEDBACK
===================================================== */

function triggerHaptic(duration = 20) {

  if (
    "vibrate" in navigator
  ) {

    try {

      navigator.vibrate(duration);

    } catch (error) {

      console.log(
        "Haptic feedback unavailable"
      );

    }

  }

}


/* =====================================================
   START AR
===================================================== */

let arStarted = false;


function continueSetup() {

  console.log(
    "CONTINUE → AR"
  );


  /*
     Show AR screen first.
  */

  showScreen("arScreen");


  /*
     Wait for the AR screen to
     become visible before starting
     MindAR.
  */

  setTimeout(() => {

    startAR();

  }, 100);

}


/* =====================================================
   MINDAR
===================================================== */

function startAR() {

  if (arStarted) {
    return;
  }


  const scene =
    document.getElementById("mindarScene");


  if (!scene) {

    console.error(
      "MindAR scene not found"
    );

    return;

  }


  const startMindAR = () => {

    const mindar =
      scene.systems["mindar-image-system"];


    if (!mindar) {

      console.error(
        "MindAR system not found"
      );

      return;

    }


    console.log(
      "MINDAR SYSTEM FOUND"
    );


    /*
       START CAMERA
    */

    mindar.start();


    arStarted = true;


    console.log(
      "MINDAR CAMERA STARTED"
    );

  };


  /*
     Wait until A-Frame is ready.
  */

  if (scene.hasLoaded) {

    startMindAR();

  } else {

    scene.addEventListener(
      "loaded",
      startMindAR,
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
    event => {

      console.error(
        "AR ERROR:",
        event
      );

    },
    { once: true }
  );


  /* =================================================
     TARGET
  ================================================= */

  const target =
    document.getElementById("vishnuTarget");


  if (!target) {

    console.error(
      "Vishnu target not found"
    );

    return;

  }


  /* =================================================
     ARTIFACT FOUND
  ================================================= */

  target.addEventListener(
    "targetFound",
    () => {

      console.log(
        "VISHNU FOUND!"
      );

      showArtifactFound();

    }
  );


  /* =================================================
     ARTIFACT LOST
  ================================================= */

  target.addEventListener(
    "targetLost",
    () => {

      console.log(
        "VISHNU LOST"
      );

      /*
         Only show scanning again if
         we are not currently exploring
         a hotspot/story.
      */

      if (!hotspotMode) {

        showScanning();

      }

    }
  );

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

  const hotspotUI =
    document.getElementById("hotspotUI");

  const hotspotInfo =
    document.getElementById("hotspotInfo");


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

  if (hotspotUI) {
    hotspotUI.classList.remove("visible");
  }

  if (hotspotInfo) {
    hotspotInfo.classList.remove("visible");
  }


  hideAllHotspots();

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

    found.style.display = "block";

  }


  hideAllHotspots();

}


/* =====================================================
   HOTSPOT MODE
===================================================== */

let hotspotMode = false;


function enterHotspotMode() {

  console.log(
    "ENTERING HOTSPOT MODE"
  );


  triggerHaptic(25);


  hotspotMode = true;


  const found =
    document.getElementById("artifactFound");

  const hotspotUI =
    document.getElementById("hotspotUI");

  const message =
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

  const status =
    document.getElementById("scanStatus");


  /*
     Hide artifact information card.
  */

  if (found) {

    found.classList.remove("visible");

    found.style.display = "none";

  }


  /*
     Hide scanning UI.
  */

  if (message) {
    message.style.display = "none";
  }

  if (frame) {
    frame.style.display = "none";
  }

  if (status) {
    status.style.display = "none";
  }


  /*
     Show hotspot instruction.
  */

  if (hotspotUI) {

    hotspotUI.classList.add("visible");

    hotspotUI.style.display = "flex";

  }


  /*
     Show the first hotspot.
  */

  showHotspot("hotspot1");


  console.log(
    "HOTSPOT 1 SHOWN"
  );

}


/* =====================================================
   SHOW HOTSPOT
===================================================== */

function showHotspot(id) {

  const hotspot =
    document.getElementById(id);


  if (!hotspot) {

    console.error(
      "Hotspot not found:",
      id
    );

    return;

  }


  /*
     Hide all other hotspots first.
  */

  hideAllHotspots();


  /*
     Make selected hotspot visible.
  */

  hotspot.setAttribute(
    "visible",
    "true"
  );


  hotspot.style.display =
    "block";


  console.log(
    "Showing hotspot:",
    id
  );

}


/* =====================================================
   SHOW ALL HOTSPOTS
===================================================== */

function showAllHotspots() {

  const hotspots = [
    "hotspot1",
    "hotspot2",
    "hotspot3"
  ];


  hotspots.forEach(id => {

    const hotspot =
      document.getElementById(id);


    if (hotspot) {

      hotspot.setAttribute(
        "visible",
        "true"
      );

      hotspot.style.display =
        "block";

    }

  });


  console.log(
    "ALL HOTSPOTS SHOWN"
  );

}


/* =====================================================
   HIDE ALL HOTSPOTS
===================================================== */

function hideAllHotspots() {

  const hotspots = [
    "hotspot1",
    "hotspot2",
    "hotspot3"
  ];


  hotspots.forEach(id => {

    const hotspot =
      document.getElementById(id);


    if (hotspot) {

      hotspot.setAttribute(
        "visible",
        "false"
      );

      hotspot.style.display =
        "none";

    }

  });

}


/* =====================================================
   HOTSPOT DATA
===================================================== */

const hotspotData = {

  hotspot1: {

    title:
      "THE CROWN & FACE",

    subtitle:
      "The divine presence of Vishnu",

    description:
      "The calm face and elaborate crown give Vishnu a composed, authoritative presence. In sacred sculpture, such details communicate the deity's divine and royal character."

  },


  hotspot2: {

    title:
      "THE RIGHT HAND",

    subtitle:
      "Symbols of power and protection",

    description:
      "The position and attributes held by Vishnu's hands help communicate his divine role and his association with protection, preservation and cosmic order."

  },


  hotspot3: {

    title:
      "THE ORNAMENTAL ARCH",

    subtitle:
      "Framing the divine figure",

    description:
      "The elaborate arch surrounding Vishnu creates a visual frame around the deity and adds depth and richness to the sculpture."

  }

};


/* =====================================================
   HOTSPOT CLICK HANDLING
===================================================== */

function setupHotspotListeners() {

  const hotspots = [
    "hotspot1",
    "hotspot2",
    "hotspot3"
  ];


  hotspots.forEach(id => {

    const hotspot =
      document.getElementById(id);


    if (!hotspot) {

      console.warn(
        "Could not find:",
        id
      );

      return;

    }


    /*
       Prevent duplicate listeners.
    */

    hotspot.addEventListener(
      "click",
      () => {

        console.log(
          "HOTSPOT CLICKED:",
          id
        );


        triggerHaptic(30);


        openHotspotStory(id);

      }
    );

  });

}


/* =====================================================
   OPEN HOTSPOT STORY
===================================================== */

function openHotspotStory(id) {

  console.log(
    "OPENING STORY:",
    id
  );


  const data =
    hotspotData[id];


  if (!data) {

    console.error(
      "No hotspot data for:",
      id
    );

    return;

  }


  const title =
    document.getElementById(
      "hotspotTitle"
    );

  const subtitle =
    document.getElementById(
      "hotspotSubtitle"
    );

  const description =
    document.getElementById(
      "hotspotDescription"
    );

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );

  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );


  /*
     Update text.
  */

  if (title) {
    title.textContent =
      data.title;
  }

  if (subtitle) {
    subtitle.textContent =
      data.subtitle;
  }

  if (description) {
    description.textContent =
      data.description;
  }


  /*
     Hide hotspot instruction.
  */

  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

    hotspotUI.style.display =
      "none";

  }


  /*
     Hide hotspots while
     story is open.
  */

  hideAllHotspots();


  /*
     Show story card.
  */

  if (hotspotInfo) {

    hotspotInfo.classList.add(
      "visible"
    );

    hotspotInfo.style.display =
      "block";

  }


  /*
     Reset audio.
  */

  prepareStoryAudio();

}


/* =====================================================
   CLOSE HOTSPOT STORY
===================================================== */

function closeHotspot() {

  console.log(
    "CLOSING HOTSPOT STORY"
  );


  triggerHaptic(20);


  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );


  /*
     Stop audio.
  */

  stopStoryAudio();


  /*
     Hide story.
  */

  if (hotspotInfo) {

    hotspotInfo.classList.remove(
      "visible"
    );

    hotspotInfo.style.display =
      "none";

  }


  /*
     Return to hotspot mode.
  */

  if (hotspotMode) {

    if (hotspotUI) {

      hotspotUI.classList.add(
        "visible"
      );

      hotspotUI.style.display =
        "flex";

    }


    /*
       Show all three hotspots again.
    */

    showAllHotspots();

  }

}


/* =====================================================
   STORY AUDIO
===================================================== */

let storyAudio = null;


function getStoryAudio() {

  if (!storyAudio) {

    storyAudio =
      document.getElementById(
        "storyAudio"
      );

  }

  return storyAudio;

}


/* =====================================================
   PREPARE AUDIO
===================================================== */

function prepareStoryAudio() {

  const audio =
    getStoryAudio();


  if (!audio) {

    console.warn(
      "Story audio element not found"
    );

    return;

  }


  audio.pause();

  audio.currentTime = 0;


  const playButton =
    document.getElementById(
      "playPauseButton"
    );


  if (playButton) {

    playButton.textContent =
      "▶";

  }


  /*
     Update duration when metadata
     is available.
  */

  if (audio.readyState >= 1) {

    updateAudioDuration();

  } else {

    audio.addEventListener(
      "loadedmetadata",
      updateAudioDuration,
      { once: true }
    );

  }


  updateAudioProgress();

}


/* =====================================================
   PLAY / PAUSE AUDIO
===================================================== */

function toggleStoryAudio() {

  const audio =
    getStoryAudio();


  if (!audio) {
    return;
  }


  triggerHaptic(20);


  if (audio.paused) {

    audio.play()
      .then(() => {

        updatePlayButton(true);

      })
      .catch(error => {

        console.error(
          "Audio playback failed:",
          error
        );

      });

  } else {

    audio.pause();

    updatePlayButton(false);

  }

}


/* =====================================================
   PLAY BUTTON
===================================================== */

function updatePlayButton(isPlaying) {

  const button =
    document.getElementById(
      "playPauseButton"
    );


  if (!button) {
    return;
  }


  button.textContent =
    isPlaying
      ? "Ⅱ"
      : "▶";

}


/* =====================================================
   REWIND AUDIO
===================================================== */

function rewindStoryAudio() {

  const audio =
    getStoryAudio();


  if (!audio) {
    return;
  }


  triggerHaptic(20);


  audio.currentTime =
    Math.max(
      0,
      audio.currentTime - 10
    );


  updateAudioProgress();

}


/* =====================================================
   AUDIO PROGRESS
===================================================== */

function updateAudioProgress() {

  const audio =
    getStoryAudio();

  const progress =
    document.getElementById(
      "audioProgress"
    );

  const currentTime =
    document.getElementById(
      "audioCurrentTime"
    );


  if (!audio) {
    return;
  }


  if (
    progress &&
    audio.duration &&
    isFinite(audio.duration)
  ) {

    progress.value =
      (
        audio.currentTime /
        audio.duration
      ) * 100;

  }


  if (currentTime) {

    currentTime.textContent =
      formatTime(
        audio.currentTime
      );

  }

}


/* =====================================================
   AUDIO DURATION
===================================================== */

function updateAudioDuration() {

  const audio =
    getStoryAudio();

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
   FORMAT TIME
===================================================== */

function formatTime(seconds) {

  if (
    !seconds ||
    !isFinite(seconds)
  ) {

    return "00:00";

  }


  const minutes =
    Math.floor(
      seconds / 60
    );

  const remainingSeconds =
    Math.floor(
      seconds % 60
    );


  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );

}


/* =====================================================
   AUDIO SEEK
===================================================== */

function setupAudioSeek() {

  const progress =
    document.getElementById(
      "audioProgress"
    );


  if (!progress) {
    return;
  }


  progress.addEventListener(
    "input",
    () => {

      const audio =
        getStoryAudio();


      if (
        !audio ||
        !audio.duration ||
        !isFinite(audio.duration)
      ) {

        return;

      }


      audio.currentTime =
        (
          Number(progress.value) /
          100
        ) * audio.duration;

    }
  );

}


/* =====================================================
   STOP AUDIO
===================================================== */

function stopStoryAudio() {

  const audio =
    getStoryAudio();


  if (!audio) {
    return;
  }


  audio.pause();

  audio.currentTime = 0;


  updatePlayButton(false);

  updateAudioProgress();

}


/* =====================================================
   AUDIO EVENTS
===================================================== */

function setupAudioEvents() {

  const audio =
    getStoryAudio();


  if (!audio) {
    return;
  }


  audio.addEventListener(
    "timeupdate",
    updateAudioProgress
  );


  audio.addEventListener(
    "loadedmetadata",
    updateAudioDuration
  );


  audio.addEventListener(
    "play",
    () => {

      updatePlayButton(true);

    }
  );


  audio.addEventListener(
    "pause",
    () => {

      updatePlayButton(false);

    }
  );


  audio.addEventListener(
    "ended",
    () => {

      updatePlayButton(false);

      updateAudioProgress();

    }
  );

}


/* =====================================================
   EXIT AR
===================================================== */

function exitAR() {

  console.log(
    "EXITING AR"
  );


  /*
     Stop audio.
  */

  stopStoryAudio();


  /*
     Reset hotspot state.
  */

  hotspotMode = false;

  hideAllHotspots();


  /*
     Hide hotspot UI.
  */

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );

  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );


  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

    hotspotUI.style.display =
      "none";

  }


  if (hotspotInfo) {

    hotspotInfo.classList.remove(
      "visible"
    );

    hotspotInfo.style.display =
      "none";

  }


  /*
     Stop MindAR.
  */

  const scene =
    document.getElementById(
      "mindarScene"
    );


  if (scene) {

    const mindar =
      scene.systems[
        "mindar-image-system"
      ];


    if (
      mindar &&
      typeof mindar.stop === "function"
    ) {

      try {

        mindar.stop();

      } catch (error) {

        console.warn(
          "Could not stop MindAR:",
          error
        );

      }

    }

  }


  arStarted = false;


  /*
     Return to setup.
  */

  showScreen("setup");

}


/* =====================================================
   INITIALISE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "REKH INITIALISING"
    );


    /*
       Setup hotspot clicks.
    */

    setupHotspotListeners();


    /*
       Setup audio.
    */

    setupAudioEvents();

    setupAudioSeek();


    /*
       Initial UI state.
    */

    hideAllHotspots();


    const hotspotUI =
      document.getElementById(
        "hotspotUI"
      );

    const hotspotInfo =
      document.getElementById(
        "hotspotInfo"
      );


    if (hotspotUI) {

      hotspotUI.classList.remove(
        "visible"
      );

      hotspotUI.style.display =
        "none";

    }


    if (hotspotInfo) {

      hotspotInfo.classList.remove(
        "visible"
      );

      hotspotInfo.style.display =
        "none";

    }


    console.log(
      "REKH READY"
    );

  }
);
