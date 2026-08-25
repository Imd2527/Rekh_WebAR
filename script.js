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

  const image = document.getElementById("storyFrame");

  if (image) {
    image.src = storyFrames[index];
  }

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
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
   HAPTIC
===================================================== */

function triggerHaptic(duration = 20) {

  if ("vibrate" in navigator) {

    try {
      navigator.vibrate(duration);
    } catch (error) {
      console.log("Haptic feedback unavailable");
    }

  }

}


/* =====================================================
   AR
===================================================== */

let arStarted = false;
let hotspotMode = false;


function continueSetup() {

  showScreen("arScreen");

  setTimeout(() => {
    startAR();
  }, 150);

}


/* =====================================================
   START MINDAR
===================================================== */

function startAR() {

  if (arStarted) {
    return;
  }

  const scene =
    document.getElementById("mindarScene");

  if (!scene) {
    console.error("MindAR scene not found");
    return;
  }


  const startMindAR = () => {

    const mindar =
      scene.systems["mindar-image-system"];

    if (!mindar) {
      console.error("MindAR system not found");
      return;
    }

    try {

      mindar.start();

      arStarted = true;

      console.log("MINDAR CAMERA STARTED");

    } catch (error) {

      console.error(
        "Could not start MindAR:",
        error
      );

    }

  };


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

      console.log("CAMERA READY");

      showScanning();

      setupHotspotListeners();
      setupHotspotUI();

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
    console.error("Vishnu target not found");
    return;
  }


  /* =================================================
     ARTIFACT FOUND
  ================================================= */

  target.addEventListener(
    "targetFound",
    () => {

      console.log("VISHNU FOUND!");

      showArtifactFound();

    }
  );


  /* =================================================
     ARTIFACT LOST
  ================================================= */

  target.addEventListener(
    "targetLost",
    () => {

      console.log("VISHNU LOST");

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

  const search =
    document.getElementById("searchIcon");

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

  if (search) {
    search.style.display = "block";
  }

  if (status) {
    status.style.display = "block";
  }

  if (found) {
    found.classList.remove("visible");
    found.style.display = "none";
  }

  if (hotspotUI) {
    hotspotUI.classList.remove("visible");
    hotspotUI.style.display = "none";
  }

  if (hotspotInfo) {
    hotspotInfo.classList.remove("visible");
    hotspotInfo.style.display = "none";
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

  const search =
    document.getElementById("searchIcon");

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

  if (search) {
    search.style.display = "none";
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
   ENTER HOTSPOT MODE
===================================================== */

function enterHotspotMode() {

  console.log("ENTERING HOTSPOT MODE");

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

  const search =
    document.getElementById("searchIcon");

  const status =
    document.getElementById("scanStatus");


  /* Hide artifact card */

  if (found) {

    found.classList.remove("visible");
    found.style.display = "none";

  }


  /* Hide scanning UI */

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


  /* Show hotspot instruction */

  if (hotspotUI) {

    hotspotUI.classList.add("visible");

    hotspotUI.style.display = "flex";

    hotspotUI.style.pointerEvents = "auto";

  }


  /* Show first hotspot */

  showHotspot("hotspot1");

}


/* =====================================================
   SHOW HOTSPOT
===================================================== */

function showHotspot(id) {

  const hotspots = [
    "hotspot1",
    "hotspot2",
    "hotspot3"
  ];

  hotspots.forEach(hotspotId => {

    const hotspot =
      document.getElementById(hotspotId);

    if (hotspot) {

      hotspot.setAttribute(
        "visible",
        hotspotId === id
      );

    }

  });

  const selected =
    document.getElementById(id);

  if (selected) {

    selected.setAttribute(
      "visible",
      "true"
    );

    selected.setAttribute(
      "class",
      "hotspot"
    );

    selected.style.pointerEvents =
      "auto";

  }

}


/* =====================================================
   SHOW ALL HOTSPOTS
===================================================== */

function showAllHotspots() {

  [
    "hotspot1",
    "hotspot2",
    "hotspot3"
  ].forEach(id => {

    const hotspot =
      document.getElementById(id);

    if (hotspot) {

      hotspot.setAttribute(
        "visible",
        "true"
      );

      hotspot.setAttribute(
        "class",
        "hotspot"
      );

    }

  });

}


/* =====================================================
   HIDE ALL HOTSPOTS
===================================================== */

function hideAllHotspots() {

  [
    "hotspot1",
    "hotspot2",
    "hotspot3"
  ].forEach(id => {

    const hotspot =
      document.getElementById(id);

    if (hotspot) {

      hotspot.setAttribute(
        "visible",
        "false"
      );

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
   HOTSPOT LISTENERS
   MOBILE + DESKTOP
===================================================== */

let hotspotListenersAttached = false;

function setupHotspotListeners() {

  if (hotspotListenersAttached) {
    return;
  }

  const hotspots = [
    "hotspot1",
    "hotspot2",
    "hotspot3"
  ];


  hotspots.forEach(id => {

    const hotspot =
      document.getElementById(id);

    if (!hotspot) {
      return;
    }


    const activateHotspot = event => {

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      console.log(
        "HOTSPOT ACTIVATED:",
        id
      );

      triggerHaptic(30);

      openHotspotStory(id);

    };


    /* Desktop */

    hotspot.addEventListener(
      "click",
      activateHotspot
    );


    /* Mobile */

    hotspot.addEventListener(
      "touchend",
      activateHotspot,
      {
        passive: false
      }
    );

  });


  hotspotListenersAttached = true;

}


/* =====================================================
   TAP "HOTSPOT TO EXPLORE" UI
===================================================== */

let hotspotUIListenerAttached = false;

function setupHotspotUI() {

  if (hotspotUIListenerAttached) {
    return;
  }

  const hotspotUI =
    document.getElementById("hotspotUI");

  if (!hotspotUI) {
    return;
  }


  hotspotUI.style.pointerEvents =
    "auto";


  const activateInstruction = event => {

    event.preventDefault();
    event.stopPropagation();

    if (!hotspotMode) {
      return;
    }

    console.log(
      "TAP A HOTSPOT TO EXPLORE"
    );

    triggerHaptic(25);

    openHotspotStory("hotspot1");

  };


  hotspotUI.addEventListener(
    "click",
    activateInstruction
  );


  hotspotUI.addEventListener(
    "touchend",
    activateInstruction,
    {
      passive: false
    }
  );


  hotspotUIListenerAttached = true;

}


/* =====================================================
   OPEN STORY CARD
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
      "No hotspot data:",
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

  const storyVisual =
    document.getElementById(
      "storyVisual"
    );

  const storyAnimation =
    document.querySelector(
      ".story-animation"
    );


  /* Update text */

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


  /* Hide hotspot instruction */

  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

    hotspotUI.style.display =
      "none";

  }


  /* Hide hotspots */

  hideAllHotspots();


  /* Make animation visible */

  if (storyVisual) {

    storyVisual.style.display =
      "flex";

    storyVisual.style.visibility =
      "visible";

    storyVisual.style.opacity =
      "1";

  }


  if (storyAnimation) {

    storyAnimation.style.display =
      "block";

    storyAnimation.style.visibility =
      "visible";

    storyAnimation.style.opacity =
      "1";

  }


  /* Open story card */

  if (hotspotInfo) {

    hotspotInfo.classList.add(
      "visible"
    );

    hotspotInfo.style.display =
      "block";

    hotspotInfo.style.visibility =
      "visible";

    hotspotInfo.style.opacity =
      "1";

  }


  /* Reset audio */

  prepareStoryAudio();

}


/* =====================================================
   CLOSE STORY
===================================================== */

function closeHotspot() {

  triggerHaptic(20);

  stopStoryAudio();


  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );


  if (hotspotInfo) {

    hotspotInfo.classList.remove(
      "visible"
    );

    hotspotInfo.style.display =
      "none";

  }


  if (hotspotMode) {

    if (hotspotUI) {

      hotspotUI.classList.add(
        "visible"
      );

      hotspotUI.style.display =
        "flex";

      hotspotUI.style.pointerEvents =
        "auto";

    }

    showAllHotspots();

  }

}


/* =====================================================
   AUDIO
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
      "Story audio not found"
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


  if (
    audio.readyState >= 1
  ) {

    updateAudioDuration();

  }


  updateAudioProgress();

}


/* =====================================================
   PLAY / PAUSE
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
   REWIND
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
   FORCE HIDE A-FRAME VR BUTTON
===================================================== */

function hideVRButton() {

  const vrButtons = [
    ".a-enter-vr",
    ".a-enter-vr-button",
    "[data-a-enter-vr]"
  ];


  vrButtons.forEach(selector => {

    document
      .querySelectorAll(selector)
      .forEach(button => {

        button.style.display =
          "none";

        button.style.visibility =
          "hidden";

        button.style.pointerEvents =
          "none";

      });

  });

}


/* =====================================================
   EXIT AR
===================================================== */

function exitAR() {

  stopStoryAudio();

  hotspotMode = false;

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


    setupAudioEvents();

    setupAudioSeek();

    setupHotspotListeners();

    setupHotspotUI();


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


    /* Hide VR immediately */

    hideVRButton();


    /* Hide it again after A-Frame loads */

    setTimeout(
      hideVRButton,
      500
    );

    setTimeout(
      hideVRButton,
      1500
    );


    console.log(
      "REKH READY"
    );

  }
);


/* =====================================================
   CONTINUOUS VR BUTTON SUPPRESSION
===================================================== */

const vrObserver =
  new MutationObserver(
    () => {
      hideVRButton();
    }
  );


vrObserver.observe(
  document.documentElement,
  {
    childList: true,
    subtree: true
  }
);v
