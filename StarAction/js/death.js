function load() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  // Check if we know the killed player
  if(!urlParams.has("player")) {
    newGame();
    return;
  }

  const playerDeath = urlParams.get("player");

  // Check if the provided string is "player1" or "player2"
  if(playerDeath != "player1" && playerDeath != "player2") {
    newGame();
    return;
  }

  document.querySelector("body").style.backgroundImage = "url(./img/death-" + playerDeath + ".png)";
}

/*Funktion för att starta ett nytt spel*/
function newGame() {
  var url = "./game.html";
  window.location = url;
}

/*Funktion för att ta sig tillbaka till huvudmenyn*/
function backToMenu() {
  var url = "./index.html";
  window.location = url;
}