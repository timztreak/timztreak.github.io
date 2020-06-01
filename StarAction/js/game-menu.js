function restartGame() {
  var url = "index.html";
  window.location = url;
}

function goBack() {
  var url = "../index.html";
  window.location = url;
}

//Här Börjar Ljud Functions
const myAudio = document.getElementById("gameMusicControler");
myAudio.volume = 0.05;
var isPlaying = false;
function togglePlay() {
  if (isPlaying) {
    myAudio.pause()
  } else {
    myAudio.play();
  }
};

myAudio.onplaying = function () {
  isPlaying = true;
};

myAudio.onpause = function () {
  isPlaying = false;
};

var start = new Date().getTime(),
score = '0.1';

// const interval = window.setInterval(function () {
//   var time = new Date().getTime() - start;

//   score = Math.round(time / 100);

//   if (score === 100) {
//     window.clearInterval(interval);
//     if (!alert("You guys didn't kill each other fast enough!\nPress 'OK' to play again, please kill each other this time")) {
//       window.location.reload();
//     }
//   }

//   document.getElementById('displayScore').innerHTML = score += '.00 Score';
// });

/*
NOTE: Causes bugs!

var slider = document.getElementById("myRange");
var output = document.getElementById("myAudio");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
}
*/

