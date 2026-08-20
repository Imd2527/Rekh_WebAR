function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

setTimeout(() => {
  showScreen("welcome");
}, 2500);
const storyFrames = [
  "assets/images/Rekh_How_It_Works_Frame_1_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_2_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_3_HD.png",
  "assets/images/Rekh_How_It_Works_Frame_4_HD.png"
];

function showStory(index) {
  document.getElementById("storyFrame").src = storyFrames[index];

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}
