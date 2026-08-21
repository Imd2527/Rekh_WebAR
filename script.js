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
   AR STATE
===================================================== */

/*
   There are THREE states:

   1. scanning
   2. artifact found
   3. hotspots
*/

let arStarted = false;

let artifactDetected = false;

let hotspotMode = false;


/* =====================================================
   CONTINUE → AR
===================================================== */

function continueSetup() {

  console.log(
    "CONTINUE → AR"
  );


  showScreen("arScreen");


  /*
     Give the browser time to make
     the AR screen visible.
  */

  setTimeout(() => {

    startAR();

  }, 100);

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

    console.error(
      "MindAR scene not found."
    );

    return;

  }


  const startMindAR = () => {

    const mindar =
      scene.systems["mindar-image-system"];


    if (!mindar) {

      console.error(
        "MindAR image system not found."
      );

      return;

    }


    console.log(
      "MindAR system found."
    );


    /*
       Start the camera.
    */

    mindar.start();


    arStarted = true;


    console.log(
      "MindAR camera started."
    );

  };


  /*
     A-Frame already loaded
  */

  if (scene.hasLoaded) {

    startMindAR();

  }

  /*
     A-Frame still loading
  */

  else {

    scene.addEventListener(
      "loaded",
      startMindAR,
      { once: true }
    );

  }


  /* =================================================
     CAMERA READY
  ================================================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "CAMERA READY"
      );


      resetARState();

      showScanning();

    },
    { once: true }
  );


  /* =================================================
     CAMERA ERROR
  ================================================= */

  scene.addEventListener(
    "arError",
    event => {

      console.error(
        "AR ERROR:",
        event
      );

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


  if (!target) {

    console.error(
      "Vishnu target not found."
    );

    return;

  }


  /* =================================================
     TARGET FOUND
  ================================================= */

  target.addEventListener(
    "targetFound",
    () => {

      console.log(
        "VISHNU FOUND"
      );


      artifactDetected = true;

      hotspotMode = false;


      /*
         IMPORTANT:

         Do NOT show hotspots yet.

         First show the artifact information
         screen.
      */

      showArtifactFound();

    }
  );


  /* =================================================
     TARGET LOST
  ================================================= */

  target.addEventListener(
    "targetLost",
    () => {

      console.log(
        "VISHNU LOST"
      );


      artifactDetected = false;

      hotspotMode = false;


      /*
         Hide hotspot UI
         because the artifact is no longer tracked.
      */

      hideHotspots();


      /*
         Return to scanning state.
      */

      showScanning();

    }
  );


  /* =================================================
     HOTSPOT EVENTS
  ================================================= */

  setupHotspots();

}


/* =====================================================
   SCANNING STATE
===================================================== */

function showScanning() {

  const message =
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

  const status =
    document.getElementById("scanStatus");

  const search =
    document.getElementById("searchIcon");

  const found =
    document.getElementById("artifactFound");

  const tapLayer =
    document.getElementById("artifactTapLayer");


  if (message) {

    message.style.display =
      "block";

  }


  if (frame) {

    frame.style.display =
      "block";

  }


  if (status) {

    status.style.display =
      "block";

  }


  if (search) {

    search.style.display =
      "flex";

  }


  if (found) {

    found.classList.remove(
      "visible"
    );

  }


  if (tapLayer) {

    tapLayer.style.display =
      "none";

  }


  hideHotspots();

}


/* =====================================================
   ARTIFACT FOUND STATE
===================================================== */

function showArtifactFound() {

  const message =
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

  const status =
    document.getElementById("scanStatus");

  const search =
    document.getElementById("searchIcon");

  const found =
    document.getElementById("artifactFound");

  const tapLayer =
    document.getElementById("artifactTapLayer");


  /*
     Hide scanning UI.
  */

  if (message) {

    message.style.display =
      "none";

  }


  if (frame) {

    frame.style.display =
      "none";

  }


  if (status) {

    status.style.display =
      "none";

  }


  if (search) {

    search.style.display =
      "none";

  }


  /*
     Show artifact information.
  */

  if (found) {

    found.classList.add(
      "visible"
    );

  }


  /*
     Enable the invisible
     screen-wide tap area.
  */

  if (tapLayer) {

    tapLayer.style.display =
      "block";

  }


  /*
     Make sure hotspots
     are NOT visible yet.
  */

  hideHotspots();

}


/* =====================================================
   USER TOUCHES SCREEN AFTER
   ARTIFACT IS FOUND
===================================================== */

function enterHotspotMode() {

  if (!artifactDetected) {

    return;

  }


  if (hotspotMode) {

    return;

  }


  console.log(
    "USER TAPPED — ENTERING HOTSPOT MODE"
  );


  hotspotMode = true;


  /*
     Hide artifact information card.
  */

  const found =
    document.getElementById("artifactFound");


  if (found) {

    found.classList.remove(
      "visible"
    );

  }


  /*
     Disable tap layer.
  */

  const tapLayer =
    document.getElementById("artifactTapLayer");


  if (tapLayer) {

    tapLayer.style.display =
      "none";

  }


  /*
     Show hotspot UI.
  */

  showHotspots();

}


/* =====================================================
   HOTSPOT UI
===================================================== */

function showHotspots() {

  const hotspotUI =
    document.getElementById("hotspotUI");


  if (hotspotUI) {

    hotspotUI.classList.add(
      "visible"
    );

  }


  document
    .querySelectorAll(".hotspot")
    .forEach(hotspot => {

      hotspot.setAttribute(
        "visible",
        "true"
      );

    });

}


/* =====================================================
   HIDE HOTSPOTS
===================================================== */

function hideHotspots() {

  const hotspotUI =
    document.getElementById("hotspotUI");


  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

  }


  document
    .querySelectorAll(".hotspot")
    .forEach(hotspot => {

      hotspot.setAttribute(
        "visible",
        "false"
      );

    });


  const hotspotInfo =
    document.getElementById("hotspotInfo");


  if (hotspotInfo) {

    hotspotInfo.classList.remove(
      "visible"
    );

  }

}


/* =====================================================
   HOTSPOT INTERACTIONS
===================================================== */

function setupHotspots() {

  const hotspot1 =
    document.getElementById("hotspot1");

  const hotspot2 =
    document.getElementById("hotspot2");

  const hotspot3 =
    document.getElementById("hotspot3");


  if (hotspot1) {

    hotspot1.addEventListener(
      "click",
      () => {

        openHotspot(
          1,
          "Vishnu's Crown",
          "The crown and head ornaments emphasize Vishnu's divine status and royal presence."
        );

      }
    );

  }


  if (hotspot2) {

    hotspot2.addEventListener(
      "click",
      () => {

        openHotspot(
          2,
          "Divine Attributes",
          "The objects held by Vishnu are symbolic attributes that help identify and understand the deity."
        );

      }
    );

  }


  if (hotspot3) {

    hotspot3.addEventListener(
      "click",
      () => {

        openHotspot(
          3,
          "Ornamental Frame",
          "The carved frame surrounding the figure adds depth and decorative detail to the sculpture."
        );

      }
    );

  }

}


/* =====================================================
   OPEN HOTSPOT INFORMATION
===================================================== */

function openHotspot(
  number,
  title,
  description
) {

  const info =
    document.getElementById("hotspotInfo");

  const numberElement =
    document.getElementById("hotspotNumber");

  const titleElement =
    document.getElementById("hotspotTitle");

  const descriptionElement =
    document.getElementById("hotspotDescription");


  if (numberElement) {

    numberElement.textContent =
      String(number).padStart(2, "0");

  }


  if (titleElement) {

    titleElement.textContent =
      title;

  }


  if (descriptionElement) {

    descriptionElement.textContent =
      description;

  }


  if (info) {

    info.classList.add(
      "visible"
    );

  }

}


/* =====================================================
   CLOSE HOTSPOT
===================================================== */

function closeHotspot() {

  const info =
    document.getElementById("hotspotInfo");


  if (info) {

    info.classList.remove(
      "visible"
    );

  }

}


/* =====================================================
   EXIT AR
===================================================== */

function exitAR() {

  console.log(
    "Leaving AR"
  );


  const scene =
    document.getElementById("mindarScene");


  /*
     Stop MindAR camera.
  */

  if (
    scene &&
    scene.systems &&
    scene.systems["mindar-image-system"]
  ) {

    try {

      scene.systems[
        "mindar-image-system"
      ].stop();

    }

    catch (error) {

      console.warn(
        "Could not stop MindAR:",
        error
      );

    }

  }


  arStarted = false;

  artifactDetected = false;

  hotspotMode = false;


  hideHotspots();


  showScreen("howRekh");

}


/* =====================================================
   ACCESSIBILITY FROM AR
===================================================== */

function openAccessibilityFromAR() {

  openAccessibility();

}


/* =====================================================
   GLOBAL TOUCH HANDLER
===================================================== */

/*
   THIS is the key change.

   When the artifact has been found,
   the FIRST user touch anywhere on the AR
   screen moves from:

      ARTIFACT FOUND

   to:

      HOTSPOTS

   We ignore the back and accessibility buttons.
*/

document.addEventListener(
  "pointerup",
  event => {

    if (!artifactDetected) {

      return;

    }


    if (hotspotMode) {

      return;

    }


    /*
       Don't treat the top controls
       as the "continue" tap.
    */

    if (
      event.target.closest(".ar-back") ||
      event.target.closest(".ar-accessibility") ||
      event.target.closest("#accessibilityOverlay")
    ) {

      return;

    }


    enterHotspotMode();

  }
);


/* =====================================================
   INITIAL AR STATE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    hideHotspots();

  }
);
