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

    continueButton.classList.remove(
      "show"
    );

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

    continueButton.classList.add(
      "show"
    );

  }

}



/* =====================================================
   ACCESSIBILITY TOGGLES
===================================================== */

function toggleSetting(button) {

  button.classList.toggle("active");

}



/* =====================================================
   AR VARIABLES
===================================================== */

let arStarted = false;

let arReady = false;

let artifactIsFound = false;

let hotspotMode = false;

let selectedHotspot = null;



/* =====================================================
   CONTINUE → AR
===================================================== */

function continueSetup() {

  console.log(
    "CONTINUE CLICKED — STARTING AR"
  );


  /*
     Show the AR screen first.
  */

  showScreen("arScreen");


  /*
     Start MindAR immediately from the
     user's button click.
  */

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


  /*
     Prevent starting twice.
  */

  if (arStarted) {

    console.log(
      "MindAR already started."
    );

    return;

  }


  /*
     Prepare target and hotspot listeners
     before starting the camera.
  */

  setupARTarget();


  /*
     A-Frame may already be loaded.
  */

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

    /*
       This starts the device camera
       and triggers the browser camera
       permission request.
    */

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


  /*
     Avoid adding listeners multiple times.
  */

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


      /*
         Show the Artifact Found UI.
      */

      showArtifactFound();


      /*
         Make sure hotspots are hidden
         until Explore is pressed.
      */

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


      /*
         If the target disappears,
         go back to scanning state.
      */

      if (!hotspotMode) {

        showScanning();

      }

    }
  );



  /*
     Set up hotspot click events.
  */

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

    message.style.display =
      "block";

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


  /*
     Hotspots should not appear
     during scanning.
  */

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


  /*
     Make sure hotspot mode
     is not active yet.
  */

  hotspotMode = false;

  hideHotspots();

}



/* =====================================================
   HOTSPOT SETUP
===================================================== */

function setupHotspots() {

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
     Crown
  */

  if (hotspot1) {

    hotspot1.addEventListener(
      "click",
      () => {

        selectHotspot(
          1,
          "Crown",
          "The crown is an important part of Vishnu's iconography, representing his divine identity and royal presence."
        );

      }
    );

  }


  /*
     Right hand
  */

  if (hotspot2) {

    hotspot2.addEventListener(
      "click",
      () => {

        selectHotspot(
          2,
          "Right Hand",
          "The position and objects associated with Vishnu's hands are important elements of his traditional iconography."
        );

      }
    );

  }


  /*
     Ornamental arch
  */

  if (hotspot3) {

    hotspot3.addEventListener(
      "click",
      () => {

        selectHotspot(
          3,
          "Ornamental Arch",
          "The carved arch frames the figure and adds another layer of decorative detail to the stone sculpture."
        );

      }
    );

  }

}



/* =====================================================
   ENTER HOTSPOT MODE
===================================================== */

function enterHotspotMode() {

  console.log(
    "EXPLORE ARTIFACT CLICKED"
  );


  /*
     Only allow this after
     the artifact has been detected.
  */

  if (!artifactIsFound) {

    console.log(
      "Artifact has not been detected yet."
    );

    return;

  }


  hotspotMode = true;


  /*
     Hide Artifact Found information.
  */

  const found =
    document.getElementById(
      "artifactFound"
    );


  if (found) {

    found.classList.remove(
      "visible"
    );

  }


  /*
     Hide scanning UI.
  */

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


  /*
     Show the three hotspots.
  */

  showHotspots();


  /*
     Show hotspot instruction.
  */

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );


  if (hotspotUI) {

    hotspotUI.classList.add(
      "visible"
    );

  }


  console.log(
    "HOTSPOT MODE ACTIVE"
  );

}



/* =====================================================
   SHOW HOTSPOTS
===================================================== */

function showHotspots() {

  const hotspots = [

    document.getElementById(
      "hotspot1"
    ),

    document.getElementById(
      "hotspot2"
    ),

    document.getElementById(
      "hotspot3"
    )

  ];


  hotspots.forEach(
    hotspot => {

      if (hotspot) {

        hotspot.setAttribute(
          "visible",
          "true"
        );

      }

    }
  );


  console.log(
    "3 HOTSPOTS SHOWN"
  );

}



/* =====================================================
   HIDE HOTSPOTS
===================================================== */

function hideHotspots() {

  const hotspots = [

    document.getElementById(
      "hotspot1"
    ),

    document.getElementById(
      "hotspot2"
    ),

    document.getElementById(
      "hotspot3"
    )

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


  /*
     Hide hotspot information too.
  */

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
    "HOTSPOT SELECTED:",
    number
  );


  selectedHotspot =
    number;


  /*
     Reset all hotspots
     back to normal image.
  */

  resetHotspotImages();


  /*
     Change selected hotspot
     to Hotspot Selected.png.
  */

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


  /*
     Fill information card.
  */

  const numberElement =
    document.getElementById(
      "hotspotNumber"
    );

  const titleElement =
    document.getElementById(
      "hotspotTitle"
    );

  const descriptionElement =
    document.getElementById(
      "hotspotDescription"
    );


  if (numberElement) {

    numberElement.textContent =
      String(number).padStart(
        2,
        "0"
      );

  }


  if (titleElement) {

    titleElement.textContent =
      title;

  }


  if (descriptionElement) {

    descriptionElement.textContent =
      description;

  }


  /*
     Show information card.
  */

  const hotspotInfo =
    document.getElementById(
      "hotspotInfo"
    );


  if (hotspotInfo) {

    hotspotInfo.classList.add(
      "visible"
    );

  }


  /*
     Hide "Tap a hotspot" hint
     while a hotspot is selected.
  */

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );


  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

  }

}



/* =====================================================
   RESET HOTSPOT IMAGES
===================================================== */

function resetHotspotImages() {

  const hotspots = [

    document.getElementById(
      "hotspot1"
    ),

    document.getElementById(
      "hotspot2"
    ),

    document.getElementById(
      "hotspot3"
    )

  ];


  hotspots.forEach(
    hotspot => {

      if (hotspot) {

        hotspot.setAttribute(
          "src",
          "assets/images/Hotspot.png"
        );

      }

    }
  );

}



/* =====================================================
   CLOSE HOTSPOT INFORMATION
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
     Restore normal hotspot images.
  */

  resetHotspotImages();


  /*
     Show the hotspot instruction again.
  */

  const hotspotUI =
    document.getElementById(
      "hotspotUI"
    );


  if (hotspotUI && hotspotMode) {

    hotspotUI.classList.add(
      "visible"
    );

  }

}



/* =====================================================
   EXIT AR
===================================================== */

function exitAR() {

  console.log(
    "EXITING AR"
  );


  const scene =
    document.getElementById(
      "mindarScene"
    );


  /*
     Stop MindAR camera.
  */

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


  /*
     Reset AR state.
  */

  arStarted = false;

  arReady = false;

  artifactIsFound = false;

  hotspotMode = false;

  selectedHotspot = null;


  hideHotspots();


  /*
     Return to setup screen.
  */

  showScreen("setup");

}



/* =====================================================
   INITIALISE AR ELEMENTS
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "Rekh WebAR loaded."
    );


    /*
       Prepare hotspot listeners.
    */

    setupHotspots();

  }
);

