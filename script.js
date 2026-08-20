/* =====================================================
   SCREEN NAVIGATION
===================================================== */

function showScreen(screenId) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove("active");

    });


  const screen =
    document.getElementById(screenId);


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
    document.getElementById(
      "storyFrame"
    );


  if (image) {

    image.src =
      storyFrames[index];

  }


  document
    .querySelectorAll(".dot")
    .forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === index
      );

    });

}


/* =====================================================
   ACCESSIBILITY
===================================================== */

function openAccessibility() {

  const overlay =
    document.getElementById(
      "accessibilityOverlay"
    );


  if (overlay) {

    overlay.classList.add("open");

  }

}


function closeAccessibility() {

  const overlay =
    document.getElementById(
      "accessibilityOverlay"
    );


  if (overlay) {

    overlay.classList.remove("open");

  }

}


/* =====================================================
   ACCESSIBILITY FROM AR
===================================================== */

function openAccessibilityFromAR() {

  const overlay =
    document.getElementById(
      "accessibilityOverlay"
    );


  if (overlay) {

    overlay.classList.add("open");

  }

}


/* =====================================================
   ACCESSIBILITY TOGGLES
===================================================== */

function toggleSetting(button) {

  if (!button) {
    return;
  }


  button.classList.toggle(
    "active"
  );

}


/* =====================================================
   AR VARIABLES
===================================================== */

let mindarStarted = false;

let cameraStream = null;


/* =====================================================
   CONTINUE → AR
===================================================== */

async function continueSetup() {

  console.log(
    "CONTINUE CLICKED"
  );


  /*
     IMPORTANT:

     Do NOT use setTimeout here.

     The camera permission request
     happens directly from the user's
     button click.
  */


  showScreen("arScreen");


  /*
     Give the AR screen a moment to
     become visible.
  */

  await new Promise(resolve => {

    requestAnimationFrame(resolve);

  });


  /*
     Explicitly request camera access.

     This is the part that forces the
     browser to show the permission
     popup if permission has not yet
     been granted.
  */

  try {

    console.log(
      "Requesting camera permission..."
    );


    cameraStream =
      await navigator.mediaDevices.getUserMedia({

        video: {
          facingMode: {
            ideal: "environment"
          }
        },

        audio: false

      });


    console.log(
      "Camera permission granted."
    );


    /*
       Stop this temporary stream.

       MindAR will create and manage
       its own camera stream.
    */

    cameraStream
      .getTracks()
      .forEach(track => {

        track.stop();

      });


    cameraStream = null;


    /*
       Now start MindAR.
    */

    startMindAR();


  }

  catch (error) {

    console.error(
      "CAMERA PERMISSION ERROR:",
      error
    );


    showCameraPermissionError();

  }

}


/* =====================================================
   START MINDAR
===================================================== */

function startMindAR() {

  if (mindarStarted) {

    console.log(
      "MindAR already started."
    );

    return;

  }


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


  const start = () => {

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


    console.log(
      "MindAR system found."
    );


    console.log(
      "Starting MindAR..."
    );


    try {

      const result =
        mindar.start();


      mindarStarted = true;


      console.log(
        "MindAR start() called."
      );


      /*
         Handle promise if returned.
      */

      if (
        result &&
        typeof result.then ===
        "function"
      ) {

        result
          .then(() => {

            console.log(
              "MindAR started successfully."
            );

          })
          .catch(error => {

            console.error(
              "MindAR start failed:",
              error
            );

            mindarStarted = false;

            showCameraPermissionError();

          });

      }

    }

    catch (error) {

      console.error(
        "MindAR startup error:",
        error
      );

      mindarStarted = false;

      showCameraPermissionError();

    }

  };


  /*
     A-Frame already loaded.
  */

  if (scene.hasLoaded) {

    start();

  }

  /*
     Wait for A-Frame.
  */

  else {

    scene.addEventListener(
      "loaded",
      start,
      { once: true }
    );

  }

}


/* =====================================================
   CAMERA PERMISSION ERROR
===================================================== */

function showCameraPermissionError() {

  const message =
    document.getElementById(
      "scanMessage"
    );


  const status =
    document.getElementById(
      "scanStatus"
    );


  if (message) {

    message.style.display =
      "block";

    message.textContent =
      "Camera access is required";

  }


  if (status) {

    status.style.display =
      "block";

    status.textContent =
      "ALLOW CAMERA ACCESS AND RELOAD";

  }

}


/* =====================================================
   MINDAR EVENTS
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const scene =
      document.getElementById(
        "mindarScene"
      );


    const target =
      document.getElementById(
        "vishnuTarget"
      );


    if (!scene) {

      console.error(
        "mindarScene not found."
      );

      return;

    }


    if (!target) {

      console.error(
        "vishnuTarget not found."
      );

      return;

    }


    /* ================================================
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
          "SCANNING FOR VISHNU"
        );

        console.log(
          "================================"
        );


        showScanning();

      }
    );


    /* ================================================
       AR ERROR
    ================================================= */

    scene.addEventListener(
      "arError",
      event => {

        console.error(
          "MINDAR ERROR:",
          event
        );


        showCameraPermissionError();

      }
    );


    /* ================================================
       TARGET FOUND
    ================================================= */

    target.addEventListener(
      "targetFound",
      () => {

        console.log(
          "VISHNU TARGET FOUND!"
        );


        showArtifactFound();

      }
    );


    /* ================================================
       TARGET LOST
    ================================================= */

    target.addEventListener(
      "targetLost",
      () => {

        console.log(
          "VISHNU TARGET LOST"
        );


        showScanning();

      }
    );

  }
);


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

    message.style.display =
      "block";

    message.textContent =
      "Point your camera at the artifact";

  }


  if (frame) {

    frame.style.display =
      "block";

  }


  if (search) {

    search.style.display =
      "flex";

  }


  if (status) {

    status.style.display =
      "block";

  }


  if (found) {

    found.classList.remove(
      "visible"
    );

  }

}


/* =====================================================
   ARTIFACT FOUND
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

    message.style.display =
      "none";

  }


  if (frame) {

    frame.style.display =
      "none";

  }


  if (search) {

    search.style.display =
      "none";

  }


  if (status) {

    status.style.display =
      "none";

  }


  if (found) {

    found.classList.add(
      "visible"
    );

  }

}


/* =====================================================
   EXIT AR
===================================================== */

function exitAR() {

  console.log(
    "Exiting AR..."
  );


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


  mindarStarted = false;


  showScreen("setup");

}
