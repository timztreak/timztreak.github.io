// This function will be called when the death screen is loaded
function load() {
  // Get the query parameters from the url
  const queryString = window.location.search;
  // Make a new URL Search Params object using the query parametes of the url
  const urlParams = new URLSearchParams(queryString);
  
  // Check if the url parameters do not contain the killed player
  if(!urlParams.has("player")) {
    // Make a new game
    newGame();
    return;
  }

  // Get the player killed
  const playerDeath = urlParams.get("player");

  // Check if the provided string is "player1" or "player2"
  if(playerDeath != "player1" && playerDeath != "player2") {
    newGame();
    return;
  }

  // Set the background image according to the killed player
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