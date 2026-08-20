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

  const storyImage =
    document.getElementById("storyFrame");

  if (storyImage) {

    storyImage.src =
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
   CONTINUE TO AR
===================================================== */

function continueSetup() {

  console.log("Starting AR experience");

  showScreen("arScreen");

  startAR();

}

/* =====================================================
   MINDAR AR
===================================================== */

let arStarted = false;
let arSystem = null;


/* =====================================================
   START AR
===================================================== */

function startAR() {

  const scene =
    document.getElementById("mindarScene");

  if (!scene) {

    console.error("MindAR scene not found.");

    return;

  }


  /*
     Wait until A-Frame has finished loading
     the scene and MindAR system.
  */

  const launchAR = () => {

    arSystem =
      scene.systems["mindar-image-system"];


    if (!arSystem) {

      console.error(
        "MindAR image system not found."
      );

      return;

    }


    if (arStarted) {

      return;

    }


    arStarted = true;


    console.log(
      "Starting MindAR camera..."
    );


    /*
       THIS is what actually requests
       camera permission and starts
       the device camera.
    */

    arSystem.start();

  };


  /*
     If A-Frame is already loaded,
     start immediately.
  */

  if (scene.hasLoaded) {

    launchAR();

  } else {

    scene.addEventListener(
      "loaded",
      launchAR,
      { once: true }
    );

  }


  /*
     MindAR successfully started.
  */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "MindAR ready — camera is running."
      );

      showScanning();

    }
  );


  /*
     Camera / AR startup failed.
  */

  scene.addEventListener(
    "arError",
    (event) => {

      console.error(
        "MindAR camera error:",
        event
      );

      alert(
        "Camera could not start. Please allow camera access and reload the page."
      );

    }
  );


  /*
     Vishnu detected.
  */

  const target =
    document.getElementById("vishnuTarget");


  if (target) {

    target.addEventListener(
      "targetFound",
      () => {

        console.log(
          "Vishnu artifact found!"
        );

        showArtifactFound();

      }
    );


    target.addEventListener(
      "targetLost",
      () => {

        console.log(
          "Vishnu artifact lost."
        );

        showScanning();

      }
    );

  }

}


/* =====================================================
   SCANNING UI
===================================================== */

function showScanning() {

  const scanMessage =
    document.getElementById("scanMessage");

  const scanFrame =
    document.getElementById("scanFrame");

  const scanStatus =
    document.getElementById("scanStatus");

  const artifactFound =
    document.getElementById("artifactFound");


  if (scanMessage) {

    scanMessage.style.display =
      "block";

  }


  if (scanFrame) {

    scanFrame.style.display =
      "block";

  }


  if (scanStatus) {

    scanStatus.style.display =
      "block";

  }


  if (artifactFound) {

    artifactFound.classList.remove(
      "visible"
    );

  }

}


/* =====================================================
   ARTIFACT FOUND
===================================================== */

function showArtifactFound() {

  const scanMessage =
    document.getElementById("scanMessage");

  const scanFrame =
    document.getElementById("scanFrame");

  const scanStatus =
    document.getElementById("scanStatus");

  const artifactFound =
    document.getElementById("artifactFound");


  if (scanMessage) {

    scanMessage.style.display =
      "none";

  }


  if (scanFrame) {

    scanFrame.style.display =
      "none";

  }


  if (scanStatus) {

    scanStatus.style.display =
      "none";

  }


  if (artifactFound) {

    artifactFound.classList.add(
      "visible"
    );

  }

}


/* =====================================================
   CONTINUE → START AR
===================================================== */

function continueSetup() {

  console.log(
    "Continue clicked — opening camera..."
  );


  /*
     Show AR screen FIRST.
     This is important because the A-Frame
     scene was previously hidden.
  */

  showScreen("arScreen");


  /*
     Give the browser one frame to make
     the AR scene visible, then start MindAR.
  */

  requestAnimationFrame(() => {

    startAR();

  });

}

