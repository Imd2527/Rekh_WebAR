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
   CONTINUE → START AR
===================================================== */

function continueSetup() {

  console.log("Continue clicked — opening camera...");

  /*
     Show the AR screen.
  */

  showScreen("arScreen");


  /*
     Start MindAR immediately.
     
     IMPORTANT:
     This is called directly from the
     Continue button click so the browser
     can request camera permission.
  */

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

    console.error(
      "MindAR scene not found."
    );

    return;

  }


  /*
     Get the MindAR system.
  */

  arSystem =
    scene.systems["mindar-image-system"];


  if (!arSystem) {

    console.error(
      "MindAR image system not found."
    );

    return;

  }


  /*
     Prevent starting MindAR twice.
  */

  if (arStarted) {

    console.log(
      "MindAR is already running."
    );

    return;

  }


  console.log(
    "Starting MindAR camera..."
  );


  /*
     Start camera + image tracking.
     
     This is intentionally called directly
     from continueSetup().
  */

  arStarted = true;

  arSystem.start();


  /* =================================================
     AR READY
  ================================================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "MindAR ready — CAMERA IS RUNNING."
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
        "MindAR camera error:",
        event
      );

      arStarted = false;

      alert(
        "Camera could not start. Please allow camera access and reload the page."
      );

    },
    { once: true }
  );


  /* =================================================
     VISHNU TARGET
  ================================================= */

  const target =
    document.getElementById("vishnuTarget");


  if (target) {


    /*
       Artifact detected
    */

    target.addEventListener(
      "targetFound",
      () => {

        console.log(
          "VISHNU ARTIFACT FOUND!"
        );

        showArtifactFound();

      }
    );


    /*
       Artifact lost
    */

    target.addEventListener(
      "targetLost",
      () => {

        console.log(
          "VISHNU ARTIFACT LOST."
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


  /*
     Show scanning UI
  */

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


  /*
     Hide artifact found UI
  */

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


  /*
     Hide scanning UI
  */

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


  /*
     Show artifact information
  */

  if (artifactFound) {

    artifactFound.classList.add(
      "visible"
    );

  }

}


/* =====================================================
   RESET AR STATE
===================================================== */

function resetAR() {

  arStarted = false;
  arSystem = null;

  console.log(
    "AR state reset."
  );

}
