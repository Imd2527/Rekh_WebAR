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
   AR VARIABLES
===================================================== */

let arStarted = false;

let hotspotMode = false;



/* =====================================================
   CONTINUE → AR
===================================================== */

function continueSetup() {

  console.log("CONTINUE → AR");


  /*
     Close accessibility panel
     if it happens to be open.
  */

  closeAccessibility();


  /*
     Show the AR screen FIRST.
  */

  showScreen("arScreen");


  /*
     Give the browser a moment to
     make the A-Frame scene visible.
  */

  setTimeout(() => {

    startAR();

  }, 150);

}



/* =====================================================
   START MINDAR
===================================================== */

function startAR() {

  if (arStarted) {

    console.log("AR already started.");

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


  /*
     Function that actually starts MindAR.
  */

  const launchMindAR = () => {

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
       THIS starts the device camera
       and triggers the browser permission
       popup when permission has not yet
       been granted.
    */

    try {

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

    }

  };



  /*
     A-Frame is already loaded.
  */

  if (scene.hasLoaded) {

    launchMindAR();

  }


  /*
     A-Frame hasn't finished loading yet.
  */

  else {

    scene.addEventListener(
      "loaded",
      launchMindAR,
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
        "CAMERA READY — MINDAR IS RUNNING"
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
        "MINDAR ERROR:",
        event
      );


      alert(
        "Camera could not start. Please allow camera access and reload the page."
      );

    },
    { once: true }
  );



  /* =================================================
     TARGET
  ================================================= */

  setupTargetEvents();

}



/* =====================================================
   TARGET EVENTS
===================================================== */

function setupTargetEvents() {

  const target =
    document.getElementById("vishnuTarget");


  if (!target) {

    console.error(
      "Vishnu target not found."
    );

    return;

  }


  /*
     Prevent adding the listeners more than once.
  */

  if (
    target.dataset.listenersAdded === "true"
  ) {

    return;

  }


  target.dataset.listenersAdded = "true";



  /* =================================================
     ARTIFACT FOUND
  ================================================= */

  target.addEventListener(
    "targetFound",
    () => {

      console.log(
        "VISHNU ARTIFACT FOUND"
      );


      /*
         Always return to the
         Artifact Found UI when
         the artifact is detected.
      */

      hotspotMode = false;


      hideHotspots();


      hideHotspotInfo();


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


      /*
         If the user was exploring,
         hide the hotspots when the
         target disappears.
      */

      hotspotMode = false;


      hideHotspots();


      hideHotspotInfo();


      showScanning();

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

  const searchIcon =
    document.getElementById("searchIcon");

  const status =
    document.getElementById("scanStatus");

  const artifact =
    document.getElementById("artifactFound");

  const hotspotUI =
    document.getElementById("hotspotUI");



  if (message) {

    message.style.display =
      "block";

  }


  if (frame) {

    frame.style.display =
      "block";

  }


  if (searchIcon) {

    searchIcon.style.display =
      "flex";

  }


  if (status) {

    status.style.display =
      "block";

  }


  if (artifact) {

    artifact.classList.remove(
      "visible"
    );

  }


  if (hotspotUI) {

    hotspotUI.classList.remove(
      "visible"
    );

  }


  hideHotspots();

  hideHotspotInfo();

}



/* =====================================================
   ARTIFACT FOUND
===================================================== */

function showArtifactFound() {

  const message =
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

  const searchIcon =
    document.getElementById("searchIcon");

  const status =
    document.getElementById("scanStatus");

  const artifact =
    document.getElementById("artifactFound");



  if (message) {

    message.style.display =
      "none";

  }


  if (frame) {

    frame.style.display =
      "none";

  }


  if (searchIcon) {

    searchIcon.style.display =
      "none";

  }


  if (status) {

    status.style.display =
      "none";

  }


  if (artifact) {

    artifact.classList.add(
      "visible"
    );

  }

}



/* =====================================================
   EXPLORE ARTIFACT
===================================================== */

function enterHotspotMode() {

  console.log(
    "EXPLORE ARTIFACT → SHOW HOTSPOTS"
  );


  hotspotMode = true;


  /*
     Hide Artifact Found UI.
  */

  const artifact =
    document.getElementById("artifactFound");


  if (artifact) {

    artifact.classList.remove(
      "visible"
    );

  }


  /*
     Show hotspot instruction.
  */

  const hotspotUI =
    document.getElementById("hotspotUI");


  if (hotspotUI) {

    hotspotUI.classList.add(
      "visible"
    );

  }


  /*
     Show the actual A-Frame
     hotspot images.
  */

  showHotspots();

}



/* =====================================================
   SHOW HOTSPOTS
===================================================== */

function showHotspots() {

  console.log(
    "SHOWING HOTSPOTS"
  );


  const hotspot1 =
    document.getElementById("hotspot1");

  const hotspot2 =
    document.getElementById("hotspot2");

  const hotspot3 =
    document.getElementById("hotspot3");



  if (hotspot1) {

    hotspot1.setAttribute(
      "visible",
      "true"
    );

    hotspot1.setAttribute(
      "material",
      "opacity",
      1
    );

  }


  if (hotspot2) {

    hotspot2.setAttribute(
      "visible",
      "true"
    );

    hotspot2.setAttribute(
      "material",
      "opacity",
      1
    );

  }


  if (hotspot3) {

    hotspot3.setAttribute(
      "visible",
      "true"
    );

    hotspot3.setAttribute(
      "material",
      "opacity",
      1
    );

  }

}



/* =====================================================
   HIDE HOTSPOTS
===================================================== */

function hideHotspots() {

  const hotspot1 =
    document.getElementById("hotspot1");

  const hotspot2 =
    document.getElementById("hotspot2");

  const hotspot3 =
    document.getElementById("hotspot3");



  if (hotspot1) {

    hotspot1.setAttribute(
      "visible",
      "false"
    );

  }


  if (hotspot2) {

    hotspot2.setAttribute(
      "visible",
      "false"
    );

  }


  if (hotspot3) {

    hotspot3.setAttribute(
      "visible",
      "false"
    );

  }

}



/* =====================================================
   HOTSPOT DATA
===================================================== */

const hotspotData = {

  hotspot1: {

    number: "01",

    title: "The Crown",

    description:
      "The crown is an important element of Vishnu's iconography, representing his divine status and authority."

  },


  hotspot2: {

    number: "02",

    title: "The Right Hand",

    description:
      "The raised hand forms part of Vishnu's characteristic iconography and conveys protection and reassurance."

  },


  hotspot3: {

    number: "03",

    title: "The Ornamental Arch",

    description:
      "The carved arch frames the deity and adds a layer of ornamental detail to the sculpture."

  }

};



/* =====================================================
   HOTSPOT CLICK EVENTS
===================================================== */

function setupHotspotEvents() {

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

        openHotspot("hotspot1");

      }
    );

  }


  if (hotspot2) {

    hotspot2.addEventListener(
      "click",
      () => {

        openHotspot("hotspot2");

      }
    );

  }


  if (hotspot3) {

    hotspot3.addEventListener(
      "click",
      () => {

        openHotspot("hotspot3");

      }
    );

  }

}



/* =====================================================
   OPEN HOTSPOT
===================================================== */

function openHotspot(id) {

  console.log(
    "HOTSPOT CLICKED:",
    id
  );


  const data =
    hotspotData[id];


  if (!data) {

    console.error(
      "No hotspot data found for:",
      id
    );

    return;

  }


  const number =
    document.getElementById(
      "hotspotNumber"
    );

  const title =
    document.getElementById(
      "hotspotTitle"
    );

  const description =
    document.getElementById(
      "hotspotDescription"
    );

  const info =
    document.getElementById(
      "hotspotInfo"
    );



  if (number) {

    number.textContent =
      data.number;

  }


  if (title) {

    title.textContent =
      data.title;

  }


  if (description) {

    description.textContent =
      data.description;

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

  hideHotspotInfo();

}



/* =====================================================
   HIDE HOTSPOT INFO
===================================================== */

function hideHotspotInfo() {

  const info =
    document.getElementById(
      "hotspotInfo"
    );


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
    "EXITING AR"
  );


  /*
     Stop MindAR if it is running.
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


    if (mindar) {

      try {

        mindar.stop();

      }

      catch (error) {

        console.warn(
          "Could not stop MindAR:",
          error
        );

      }

    }

  }


  arStarted = false;


  hotspotMode = false;


  hideHotspots();

  hideHotspotInfo();


  /*
     Return to How Rekh Works.
  */

  showScreen("howRekh");

}



/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "Rekh app loaded."
    );


    /*
       Prepare hotspot click listeners.
    */

    setupHotspotEvents();


    /*
       Make sure hotspots are hidden
       when the app first loads.
    */

    hideHotspots();


    hideHotspotInfo();


    /*
       Prepare initial AR UI.
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
);
