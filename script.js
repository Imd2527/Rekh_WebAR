/* =====================================================
   SCREEN NAVIGATION
===================================================== */

function showScreen(screenId) {

  document.querySelectorAll(".screen").forEach(screen => {
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
   THREE AR STATES:

   1. SCANNING
   2. ARTIFACT FOUND
   3. HOTSPOTS
*/

let arStarted = false;

let artifactDetected = false;

let hotspotMode = false;

let arEventsBound = false;

let hotspotsBound = false;


/* =====================================================
   RESET AR STATE
===================================================== */

function resetARState() {

  artifactDetected = false;

  hotspotMode = false;


  const found =
    document.getElementById("artifactFound");

  const tapLayer =
    document.getElementById("artifactTapLayer");


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
   CONTINUE → AR
===================================================== */

function continueSetup() {

  console.log(
    "CONTINUE → AR"
  );


  showScreen("arScreen");


  /*
     Give the browser a moment
     to display the AR screen.
  */

  setTimeout(() => {

    startAR();

  }, 100);

}


/* =====================================================
   START MINDAR
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


  const target =
    document.getElementById("vishnuTarget");


  if (!target) {

    console.error(
      "Vishnu target not found."
    );

    return;

  }


  /* =================================================
     TARGET EVENTS
     
     Bind these only once so that
     reopening AR does not create
     duplicate listeners.
  ================================================= */

  if (!arEventsBound) {


    /* ---------------------------------------------
       TARGET FOUND
    --------------------------------------------- */

    target.addEventListener(
      "targetFound",
      () => {

        console.log(
          "VISHNU FOUND"
        );


        artifactDetected = true;

        hotspotMode = false;


        /*
           Do NOT show hotspots immediately.

           First show the artifact information.
        */

        showArtifactFound();

      }
    );


    /* ---------------------------------------------
       TARGET LOST
    --------------------------------------------- */

    target.addEventListener(
      "targetLost",
      () => {

        console.log(
          "VISHNU LOST"
        );


        artifactDetected = false;

        hotspotMode = false;


        hideHotspots();

        showScanning();

      }
    );


    arEventsBound = true;

  }


  /* =================================================
     HOTSPOT EVENTS
  ================================================= */

  setupHotspots();


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
    {
      once: true
    }
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
    {
      once: true
    }
  );


  /* =================================================
     START MINDAR
  ================================================= */

  const startMindAR = () => {

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


    try {

      mindar.start();

      arStarted = true;


      console.log(
        "MindAR camera started."
      );

    }

    catch (error) {

      console.error(
        "Could not start MindAR:",
        error
      );

    }

  };


  /* ---------------------------------------------
     A-FRAME ALREADY LOADED
  --------------------------------------------- */

  if (scene.hasLoaded) {

    startMindAR();

  }


  /* ---------------------------------------------
     A-FRAME STILL LOADING
  --------------------------------------------- */

  else {

    scene.addEventListener(
      "loaded",
      startMindAR,
      {
        once: true
      }
    );

  }

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


  /* ---------------------------------------------
     SHOW SCANNING MESSAGE
  --------------------------------------------- */

  if (message) {

    message.style.display =
      "block";

  }


  /* ---------------------------------------------
     SHOW SCAN FRAME
  --------------------------------------------- */

  if (frame) {

    frame.style.display =
      "block";

  }


  /* ---------------------------------------------
     SHOW STATUS
  --------------------------------------------- */

  if (status) {

    status.style.display =
      "block";

  }


  /* ---------------------------------------------
     SHOW SEARCH ICON
  --------------------------------------------- */

  if (search) {

    search.style.display =
      "flex";

  }


  /* ---------------------------------------------
     HIDE ARTIFACT CARD
  --------------------------------------------- */

  if (found) {

    found.classList.remove(
      "visible"
    );

  }


  /* ---------------------------------------------
     DISABLE TAP LAYER
  --------------------------------------------- */

  if (tapLayer) {

    tapLayer.style.display =
      "none";

  }


  /* ---------------------------------------------
     HIDE HOTSPOTS
  --------------------------------------------- */

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


  /* ---------------------------------------------
     HIDE SCANNING UI
  --------------------------------------------- */

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


  /* ---------------------------------------------
     SHOW ARTIFACT INFORMATION
  --------------------------------------------- */

  if (found) {

    found.classList.add(
      "visible"
    );

  }


  /* ---------------------------------------------
     ENABLE TAP LAYER
  --------------------------------------------- */

  if (tapLayer) {

    tapLayer.style.display =
      "block";

  }


  /* ---------------------------------------------
     KEEP HOTSPOTS HIDDEN
  --------------------------------------------- */

  hideHotspots();

}


/* =====================================================
   ENTER HOTSPOT MODE
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


  showHotspots();

}


/* =====================================================
   SHOW HOTSPOTS
===================================================== */

function showHotspots() {

  console.log(
    "SHOWING HOTSPOTS"
  );


  hotspotMode = true;


  const found =
    document.getElementById("artifactFound");

  const tapLayer =
    document.getElementById("artifactTapLayer");

  const hotspotUI =
    document.getElementById("hotspotUI");


  /* ---------------------------------------------
     HIDE ARTIFACT CARD
  --------------------------------------------- */

  if (found) {

    found.classList.remove(
      "visible"
    );

  }


  /* ---------------------------------------------
     DISABLE TAP LAYER
  --------------------------------------------- */

  if (tapLayer) {

    tapLayer.style.display =
      "none";

  }


  /* ---------------------------------------------
     SHOW "EXPLORE THE ARTIFACT"
  --------------------------------------------- */

  if (hotspotUI) {

    hotspotUI.classList.add(
      "visible"
    );

  }


  /* ---------------------------------------------
     FIND ALL 3D HOTSPOTS
  --------------------------------------------- */

  const hotspots =
    document.querySelectorAll(
      "#vishnuTarget .hotspot"
    );


  console.log(
    "Number of hotspots:",
    hotspots.length
  );


  /* ---------------------------------------------
     MAKE HOTSPOTS VISIBLE
  --------------------------------------------- */

  hotspots.forEach(
    (hotspot, index) => {


      /*
         Force visibility.
      */

      hotspot.setAttribute(
        "visible",
        "true"
      );


      /*
         Make them larger so they are
         definitely visible during testing.
      */

      hotspot.setAttribute(
        "radius",
        "0.065"
      );


      /*
         Force the material.
      */

      hotspot.setAttribute(
        "material",
        "shader: flat; color: #F4D35E; opacity: 1; transparent: false; side: double;"
      );


      console.log(
        `Hotspot ${index + 1} visible`,
        hotspot.getAttribute(
          "position"
        )
      );

    }
  );

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


  const hotspots =
    document.querySelectorAll(
      "#vishnuTarget .hotspot"
    );


  hotspots.forEach(
    hotspot => {

      hotspot.setAttribute(
        "visible",
        "false"
      );

    }
  );


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

  /*
     Don't attach the same listeners
     repeatedly.
  */

  if (hotspotsBound) {

    return;

  }


  const hotspot1 =
    document.getElementById("hotspot1");

  const hotspot2 =
    document.getElementById("hotspot2");

  const hotspot3 =
    document.getElementById("hotspot3");


  console.log(
    "Setting up hotspots:",
    hotspot1,
    hotspot2,
    hotspot3
  );


  /* ---------------------------------------------
     GENERIC HOTSPOT BINDER
  --------------------------------------------- */

  const bindHotspot = (
    element,
    number,
    title,
    description
  ) => {

    if (!element) {

      return;

    }


    const handler = event => {

      event.stopPropagation();


      console.log(
        `HOTSPOT ${number} CLICKED`
      );


      openHotspot(
        number,
        title,
        description
      );

    };


    element.addEventListener(
      "click",
      handler
    );


    element.addEventListener(
      "touchend",
      handler,
      {
        passive: false
      }
    );

  };


  /* ---------------------------------------------
     HOTSPOT 1
  --------------------------------------------- */

  bindHotspot(
    hotspot1,
    1,
    "Vishnu's Crown",
    "The crown and head ornaments emphasize Vishnu's divine status and royal presence."
  );


  /* ---------------------------------------------
     HOTSPOT 2
  --------------------------------------------- */

  bindHotspot(
    hotspot2,
    2,
    "Divine Attributes",
    "The objects held by Vishnu are symbolic attributes that help identify and understand the deity."
  );


  /* ---------------------------------------------
     HOTSPOT 3
  --------------------------------------------- */

  bindHotspot(
    hotspot3,
    3,
    "Ornamental Frame",
    "The carved frame surrounding the figure adds depth and decorative detail to the sculpture."
  );


  hotspotsBound = true;

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
    document.getElementById(
      "hotspotDescription"
    );


  /* ---------------------------------------------
     NUMBER
  --------------------------------------------- */

  if (numberElement) {

    numberElement.textContent =
      String(number).padStart(
        2,
        "0"
      );

  }


  /* ---------------------------------------------
     TITLE
  --------------------------------------------- */

  if (titleElement) {

    titleElement.textContent =
      title;

  }


  /* ---------------------------------------------
     DESCRIPTION
  --------------------------------------------- */

  if (descriptionElement) {

    descriptionElement.textContent =
      description;

  }


  /* ---------------------------------------------
     SHOW CARD
  --------------------------------------------- */

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
    document.getElementById(
      "mindarScene"
    );


  /* ---------------------------------------------
     STOP MINDAR CAMERA
  --------------------------------------------- */

  if (
    scene &&
    scene.systems &&
    scene.systems[
      "mindar-image-system"
    ]
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


  /* ---------------------------------------------
     RESET STATE
  --------------------------------------------- */

  arStarted = false;

  artifactDetected = false;

  hotspotMode = false;


  hideHotspots();


  showScreen(
    "howRekh"
  );

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
   FLOW:

   Artifact detected
        ↓
   Artifact information shown
        ↓
   User taps
        ↓
   Hotspots appear

   IMPORTANT:

   We only respond when the
   invisible artifact tap layer
   is active.
*/

document.addEventListener(
  "pointerup",
  event => {


    /* ---------------------------------------------
       ARTIFACT MUST BE DETECTED
    --------------------------------------------- */

    if (!artifactDetected) {

      return;

    }


    /* ---------------------------------------------
       DON'T RE-ENTER HOTSPOT MODE
    --------------------------------------------- */

    if (hotspotMode) {

      return;

    }


    /* ---------------------------------------------
       GET TAP LAYER
    --------------------------------------------- */

    const tapLayer =
      document.getElementById(
        "artifactTapLayer"
      );


    if (!tapLayer) {

      return;

    }


    /*
       Only continue if the
       tap layer is actually active.
    */

    if (
      tapLayer.style.display !==
      "block"
    ) {

      return;

    }


    /* ---------------------------------------------
       IGNORE TOP BUTTONS
    --------------------------------------------- */

    if (
      event.target.closest(
        ".ar-back"
      ) ||
      event.target.closest(
        ".ar-accessibility"
      ) ||
      event.target.closest(
        "#accessibilityOverlay"
      )
    ) {

      return;

    }


    console.log(
      "USER TAPPED — ENTERING HOTSPOT MODE"
    );


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
