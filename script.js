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

  const storyImage = document.getElementById("storyFrame");

  if (storyImage) {
    storyImage.src = storyFrames[currentStory];
  }

  document.querySelectorAll(".dot").forEach((dot, i) => {

    dot.classList.toggle(
      "active",
      i === currentStory
    );

  });
}


/* =====================================================
   ACCESSIBILITY
===================================================== */

/*
   Accessibility starts CLOSED.
   Continue also starts HIDDEN.
*/


function openAccessibility() {

  const overlay =
    document.getElementById("accessibilityOverlay");

  const continueButton =
    document.getElementById("setupContinue");

  if (overlay) {
    overlay.classList.add("open");
  }

  /*
     Keep Continue hidden while
     accessibility panel is open.
  */

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

  /*
     Once the accessibility panel is closed,
     show Continue.
  */

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
   CONTINUE
===================================================== */

function continueSetup() {

  /*
     For now this simply keeps the setup flow ready
     for the next screen.

     We can connect this to the AR experience later.
  */

  console.log("Continue clicked");

}
