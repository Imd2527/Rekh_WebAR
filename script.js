function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(screenId);

  if (screen) {
    screen.classList.add("active");
  }
}


/* LOADING → WELCOME */

setTimeout(() => {
  showScreen("welcome");
}, 2500);


/* STORYBOARD */

const storyFrames = [
  "assets/images/Rekh_How_It_Works_Frame_1_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_2_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_3_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_4_HD.png"
];

let currentStory = 0;


function showStory(index) {

  currentStory = index;

  document.getElementById("storyFrame").src =
    storyFrames[currentStory];

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle(
      "active",
      i === currentStory
    );
  });
}


/* SWIPE */

let touchStartX = 0;

const swipeArea =
  document.querySelector(".story-carousel");

if (swipeArea) {

  swipeArea.addEventListener("touchstart", function(event) {
    touchStartX =
      event.changedTouches[0].screenX;
  });

  swipeArea.addEventListener("touchend", function(event) {

    const touchEndX =
      event.changedTouches[0].screenX;

    if (touchEndX < touchStartX - 50) {

      currentStory++;

      if (currentStory >= storyFrames.length) {
        currentStory = 0;
      }

      showStory(currentStory);
    }

    if (touchEndX > touchStartX + 50) {

      currentStory--;

      if (currentStory < 0) {
        currentStory = storyFrames.length - 1;
      }

      showStory(currentStory);
    }

  });

}
