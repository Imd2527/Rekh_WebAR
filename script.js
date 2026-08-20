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
    image.src = storyFrames[index];
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
   START AR
===================================================== */

let arStarted = false;


function continueSetup() {

  console.log("CONTINUE CLICKED");

  /*
     Show AR screen
  */

  showScreen("arScreen");


  /*
     Wait until the AR screen is visible,
     then start MindAR.
  */

  setTimeout(() => {

    startAR();

  }, 100);

}


/* =====================================================
   MINDAR
===================================================== */

function startAR() {

  if (arStarted) {
    return;
  }


  const scene =
    document.getElementById("mindarScene");


  if (!scene) {

    console.error(
      "MindAR scene not found"
    );

    return;

  }


  const startMindAR = () => {

    const mindar =
      scene.systems["mindar-image-system"];


    if (!mindar) {

      console.error(
        "MindAR system not found"
      );

      return;

    }


    console.log(
      "MINDAR SYSTEM FOUND"
    );


    /*
       START CAMERA
    */

    mindar.start();


    arStarted = true;


    console.log(
      "MINDAR CAMERA STARTED"
    );

  };


  /*
     Same idea as your working postcard:
     wait until A-Frame is ready.
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


  /* =================================================
     AR READY
  ================================================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "CAMERA READY"
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
    return;
  }


  target.addEventListener(
    "targetFound",
    () => {

      console.log(
        "VISHNU FOUND!"
      );

      showArtifactFound();

    }
  );


  target.addEventListener(
    "targetLost",
    () => {

      console.log(
        "VISHNU LOST"
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
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

  const status =
    document.getElementById("scanStatus");

  const found =
    document.getElementById("artifactFound");


  if (message) {
    message.style.display = "block";
  }

  if (frame) {
    frame.style.display = "block";
  }

  if (status) {
    status.style.display = "block";
  }

  if (found) {
    found.classList.remove("visible");
  }

}


/* =====================================================
   ARTIFACT FOUND
===================================================== */

function showArtifactFound() {

  const message =
    document.getElementById("scanMessage");

  const frame =
    document.getElementById("scanFrame");

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

  if (status) {
    status.style.display = "none";
  }

  if (found) {
    found.classList.add("visible");
  }

}
