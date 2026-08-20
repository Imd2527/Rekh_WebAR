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
   MINDAR VARIABLES
===================================================== */

let arStarted = false;
let arStarting = false;


/* =====================================================
   CONTINUE → OPEN AR
===================================================== */

function continueSetup() {

  console.log("Continue clicked");
  console.log("Opening AR camera...");

  /*
     IMPORTANT:
     Show the AR screen immediately.
  */

  showScreen("arScreen");


  /*
     Start MindAR immediately from the
     button interaction.
  */

  startAR();

}


/* =====================================================
   START MINDAR
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
     Prevent multiple starts.
  */

  if (arStarted || arStarting) {

    console.log(
      "AR is already starting/running."
    );

    return;

  }


  arStarting = true;


  /*
     Make absolutely sure the AR screen
     is visible before starting MindAR.
  */

  const arScreen =
    document.getElementById("arScreen");

  if (arScreen) {

    arScreen.classList.add("active");

  }


  /*
     Get MindAR system.
  */

  const startMindAR = () => {

    const arSystem =
      scene.systems["mindar-image-system"];


    if (!arSystem) {

      console.error(
        "ERROR: MindAR image system not found."
      );

      arStarting = false;

      return;

    }


    console.log(
      "MindAR system found."
    );


    /*
       Register AR events BEFORE starting.
    */

    setupAREvents();


    /*
       START CAMERA
       ----------------

       This triggers the browser's
       camera permission request.
    */

    console.log(
      "Requesting camera access..."
    );


    try {

      const result =
        arSystem.start();


      /*
         MindAR start() returns a Promise.
      */

      if (result && typeof result.then === "function") {

        result
          .then(() => {

            console.log(
              "MindAR start() successful."
            );

          })
          .catch(error => {

            console.error(
              "MindAR failed to start:",
              error
            );

            arStarting = false;

            showCameraError(error);

          });

      }

    } catch (error) {

      console.error(
        "Camera start error:",
        error
      );

      arStarting = false;

      showCameraError(error);

    }

  };


  /*
     A-Frame may still be loading.
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

}


/* =====================================================
   AR EVENTS
===================================================== */

function setupAREvents() {

  const scene =
    document.getElementById("mindarScene");

  const target =
    document.getElementById("vishnuTarget");


  if (!scene) {
    return;
  }


  /*
     CAMERA / AR READY
  */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "MindAR ready — CAMERA IS RUNNING."
      );

      arStarted = true;
      arStarting = false;

      showScanning();

    },
    { once: true }
  );


  /*
     CAMERA / AR ERROR
  */

  scene.addEventListener(
    "arError",
    event => {

      console.error(
        "MindAR AR error:",
        event
      );

      arStarted = false;
      arStarting = false;

      showCameraError(event);

    },
    { once: true }
  );


  /*
     ARTIFACT FOUND
  */

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


    /*
       ARTIFACT LOST
    */

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
   ARTIFACT FOUND UI
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
   CAMERA ERROR
===================================================== */

function showCameraError(error) {

  console.error(
    "Camera could not be started:",
    error
  );


  /*
     Keep the AR screen visible,
     but tell the user what happened.
  */

  const scanMessage =
    document.getElementById("scanMessage");


  if (scanMessage) {

    scanMessage.innerHTML =
      "Camera access is required";


    scanMessage.style.display =
      "block";

  }


  /*
     Helpful console information.
  */

  if (
    error &&
    error.name === "NotAllowedError"
  ) {

    console.error(
      "Camera permission was denied."
    );

  }

}


/* =====================================================
   INITIAL AR UI STATE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const scanMessage =
      document.getElementById("scanMessage");

    const scanFrame =
      document.getElementById("scanFrame");

    const scanStatus =
      document.getElementById("scanStatus");

    const artifactFound =
      document.getElementById("artifactFound");


    /*
       Do not show AR scanning UI
       until camera starts.
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


    if (artifactFound) {

      artifactFound.classList.remove(
        "visible"
      );

    }

  }
);
