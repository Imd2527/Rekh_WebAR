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
      storyFrames[index];

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
    document.getElementById(
      "accessibilityOverlay"
    );

  const continueButton =
    document.getElementById(
      "setupContinue"
    );


  /*
     Open accessibility panel
  */

  if (overlay) {

    overlay.classList.add("open");

  }


  /*
     Continue must disappear
     while the panel is open
  */

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


  /*
     Close accessibility panel
  */

  if (overlay) {

    overlay.classList.remove("open");

  }


  /*
     Continue appears only
     after accessibility is closed
  */

  if (continueButton) {

    continueButton.classList.add("show");

  }

}


/* =====================================================
   ACCESSIBILITY TOGGLES
===================================================== */

function toggleSetting(button) {

  if (!button) {
    return;
  }

  button.classList.toggle("active");

}


/* =====================================================
   MINDAR VARIABLES
===================================================== */

let arStarted = false;

let arListenersAdded = false;


/* =====================================================
   CONTINUE → AR
===================================================== */

function continueSetup() {

  console.log(
    "CONTINUE → AR"
  );


  /*
     First make the AR screen visible.
     This is important because MindAR should
     not be started while its parent screen
     is display:none.
  */

  showScreen("arScreen");


  /*
     Wait briefly for the AR screen to become
     visible before starting MindAR.
  */

  setTimeout(() => {

    startAR();

  }, 150);

}


/* =====================================================
   START MINDAR
===================================================== */

function startAR() {

  /*
     Prevent MindAR from being started twice.
  */

  if (arStarted) {

    console.log(
      "MindAR is already running."
    );

    return;

  }


  const scene =
    document.getElementById(
      "mindarScene"
    );


  if (!scene) {

    console.error(
      "ERROR: mindarScene not found."
    );

    return;

  }


  /*
     Add AR event listeners only once.
  */

  setupAREvents(scene);


  /*
     Start MindAR once A-Frame has loaded.
  */

  const startMindAR = () => {

    const mindar =
      scene.systems[
        "mindar-image-system"
      ];


    if (!mindar) {

      console.error(
        "ERROR: MindAR image system not found."
      );

      return;

    }


    console.log(
      "MindAR system found."
    );


    console.log(
      "Requesting camera permission..."
    );


    /*
       THIS starts the actual device camera.

       Because autoStart is false in HTML,
       this call is required.
    */

    try {

      const result =
        mindar.start();


      /*
         MindAR start() returns a Promise
         in the current version.
      */

      if (
        result &&
        typeof result.then === "function"
      ) {

        result
          .then(() => {

            arStarted = true;

            console.log(
              "MindAR camera started successfully."
            );

          })
          .catch(error => {

            console.error(
              "MindAR failed to start:",
              error
            );

            arStarted = false;

            showCameraError();

          });

      } else {

        /*
           Fallback in case the installed
           MindAR version doesn't return
           a Promise.
        */

        arStarted = true;

        console.log(
          "MindAR start() called."
        );

      }

    } catch (error) {

      console.error(
        "Camera startup error:",
        error
      );

      arStarted = false;

      showCameraError();

    }

  };


  /*
     A-Frame is already loaded
  */

  if (scene.hasLoaded) {

    console.log(
      "A-Frame already loaded."
    );

    startMindAR();

  }


  /*
     A-Frame has not loaded yet
  */

  else {

    console.log(
      "Waiting for A-Frame..."
    );


    scene.addEventListener(
      "loaded",
      startMindAR,
      { once: true }
    );

  }

}


/* =====================================================
   AR EVENT LISTENERS
===================================================== */

function setupAREvents(scene) {

  /*
     Prevent duplicate listeners.
  */

  if (arListenersAdded) {

    return;

  }

  arListenersAdded = true;


  /* =================================================
     AR READY
  ================================================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "================================"
      );

      console.log(
        "CAMERA READY"
      );

      console.log(
        "MindAR is now scanning."
      );

      console.log(
        "================================"
      );


      showScanning();

    }
  );


  /* =================================================
     AR ERROR
  ================================================= */

  scene.addEventListener(
    "arError",
    event => {

      console.error(
        "================================"
      );

      console.error(
        "MINDAR CAMERA ERROR"
      );

      console.error(
        event
      );

      console.error(
        "================================"
      );


      showCameraError();

    }
  );


  /* =================================================
     VISHNU TARGET
  ================================================= */

  const target =
    document.getElementById(
      "vishnuTarget"
    );


  if (!target) {

    console.error(
      "ERROR: vishnuTarget not found."
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
        "================================"
      );

      console.log(
        "VISHNU ARTIFACT FOUND"
      );

      console.log(
        "================================"
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
        "VISHNU ARTIFACT LOST"
      );


      showScanning();

    }
  );

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

  const status =
    document.getElementById(
      "scanStatus"
    );

  const found =
    document.getElementById(
      "artifactFound"
    );


  /*
     Show scanning message
  */

  if (message) {

    message.style.display =
      "block";

  }


  /*
     Show scan frame
  */

  if (frame) {

    frame.style.display =
      "block";

  }


  /*
     Show scanning status
  */

  if (status) {

    status.style.display =
      "block";

  }


  /*
     Hide artifact information
  */

  if (found) {

    found.classList.remove(
      "visible"
    );

  }

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

  const status =
    document.getElementById(
      "scanStatus"
    );

  const found =
    document.getElementById(
      "artifactFound"
    );


  /*
     Hide scanning message
  */

  if (message) {

    message.style.display =
      "none";

  }


  /*
     Hide scan brackets
  */

  if (frame) {

    frame.style.display =
      "none";

  }


  /*
     Hide scanning text
  */

  if (status) {

    status.style.display =
      "none";

  }


  /*
     Show artifact information
  */

  if (found) {

    found.classList.add(
      "visible"
    );

  }

}


/* =====================================================
   CAMERA ERROR
===================================================== */

function showCameraError() {

  const message =
    document.getElementById(
      "scanMessage"
    );


  if (message) {

    message.style.display =
      "block";

    message.innerHTML =
      "Camera access is required";

  }


  const status =
    document.getElementById(
      "scanStatus"
    );


  if (status) {

    status.style.display =
      "block";

    status.innerHTML =
      "Please allow camera access and reload";

  }

}


/* =====================================================
   INITIALIZE AR EVENTS
===================================================== */

/*
   We don't start the camera here.

   We only prepare the MindAR event
   listeners.

   The camera starts ONLY when the user
   presses Continue.
*/

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const scene =
      document.getElementById(
        "mindarScene"
      );


    if (!scene) {

      console.log(
        "MindAR scene is not currently available."
      );

      return;

    }


    setupAREvents(scene);

  }
);
