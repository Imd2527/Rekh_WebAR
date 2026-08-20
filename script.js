/* =========================================
   SCREEN NAVIGATION
========================================= */

function showScreen(screenId) {

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const targetScreen = document.getElementById(screenId);

  if (targetScreen) {
    targetScreen.classList.add("active");
  }

}


/* =========================================
   LOADING SCREEN
========================================= */

setTimeout(() => {
  showScreen("welcome");
}, 2500);


/* =========================================
   STORYBOARD
========================================= */

const storyFrames = [
  "assets/images/Rekh_How_It_Works_Frame_1_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_2_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_3_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_4_HD.png"
];

let currentStory = 0;


function updateStory() {

  const storyImage = document.getElementById("storyFrame");

  if (!storyImage) return;

  storyImage.src = storyFrames[currentStory];


  document.querySelectorAll(".dot").forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentStory
    );

  });

}


function showStory(index) {

  currentStory = index;

  updateStory();

}


/* =========================================
   STORYBOARD SWIPE
========================================= */

let touchStartX = 0;
let touchEndX = 0;

const swipeArea = document.querySelector(".story-carousel");

if (swipeArea) {

  swipeArea.addEventListener("touchstart", function(event) {

    touchStartX =
      event.changedTouches[0].screenX;

  });


  swipeArea.addEventListener("touchend", function(event) {

    touchEndX =
      event.changedTouches[0].screenX;


    /* SWIPE LEFT */

    if (touchEndX < touchStartX - 50) {

      currentStory++;

      if (currentStory >= storyFrames.length) {
        currentStory = 0;
      }

      updateStory();

    }


    /* SWIPE RIGHT */

    if (touchEndX > touchStartX + 50) {

      currentStory--;

      if (currentStory < 0) {
        currentStory = storyFrames.length - 1;
      }

      updateStory();

    }

  });

}


/* =========================================
   ACCESSIBILITY TOGGLES
========================================= */

function toggleSetting(button) {

  button.classList.toggle("active");

}


/* =========================================
   TEXT SIZE
========================================= */

const textSizeButtons =
  document.querySelectorAll(".text-size-selector button");

textSizeButtons.forEach((button, index) => {

  button.addEventListener("click", function() {

    textSizeButtons.forEach(btn => {
      btn.classList.remove("selected");
    });

    this.classList.add("selected");


    /* Small */

    if (index === 0) {
      document.body.classList.remove("large-text");
      document.body.classList.add("small-text");
    }


    /* Medium */

    if (index === 1) {
      document.body.classList.remove("small-text");
      document.body.classList.remove("large-text");
    }


    /* Large */

    if (index === 2) {
      document.body.classList.remove("small-text");
      document.body.classList.add("large-text");
    }

  });

});


/* =========================================
   HIGH CONTRAST
========================================= */

function updateHighContrast(button) {

  document.body.classList.toggle(
    "high-contrast",
    button.classList.contains("active")
  );

}


/* =========================================
   ACCESSIBILITY SETTINGS
========================================= */

document.addEventListener("click", function(event) {

  const button = event.target.closest(".toggle");

  if (!button) return;


  /* High contrast is the third toggle
     after Audio and Captions */

  const rows =
    document.querySelectorAll(".accessibility-row");

  rows.forEach(row => {

    const title =
      row.querySelector(".accessibility-label h2");

    if (!title) return;


    if (title.textContent.trim() === "High contrast") {

      const toggle =
        row.querySelector(".toggle");

      updateHighContrast(toggle);

    }

  });

});
