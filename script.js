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
   MINDAR
===================================================== */

let arStarted = false;


function startAR() {

  if (arStarted) {
    return;
  }

  const scene =
    document.getElementById("mindarScene");

  if (!scene) {
    console.error("MindAR scene not found.");
    return;
  }


  const target =
    document.getElementById("vishnuTarget");

  if (!target) {
    console.error("Vishnu target not found.");
    return;
  }


  arStarted = true;


  /* -----------------------------------------
     TARGET FOUND
  ----------------------------------------- */

  target.addEventListener(
    "targetFound",
    () => {

      console.log("Vishnu artifact found.");

      showArtifactFound();

    }
  );


  /* -----------------------------------------
     TARGET LOST
  ----------------------------------------- */

  target.addEventListener(
    "targetLost",
    () => {

      console.log("Vishnu artifact lost.");

      showScanning();

    }
  );


  /* -----------------------------------------
     AR ERROR
  ----------------------------------------- */

  scene.addEventListener(
    "arError",
    () => {

      console.error(
        "MindAR could not start."
      );

    }
  );

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
    scanMessage.style.display = "block";
  }

  if (scanFrame) {
    scanFrame.style.display = "block";
  }

  if (scanStatus) {
    scanStatus.style.display = "block";
  }

  if (artifactFound) {
    artifactFound.classList.remove("visible");
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
    scanMessage.style.display = "none";
  }

  if (scanFrame) {
    scanFrame.style.display = "none";
  }

  if (scanStatus) {
    scanStatus.style.display = "none";
  }

  if (artifactFound) {
    artifactFound.classList.add("visible");
  }

}
