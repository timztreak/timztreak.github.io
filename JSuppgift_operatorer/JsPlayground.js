// Bengt Johansson  2019-05-23 skapad
//                  2019-05-06 uppdaterad för att hantera typdifferenser automatiskt
//
// Den här filen hanterar kopplingen mellan HTML-sidan och programmeringuppgifter.
// Den hanterar val och aktivering av uppgift som ska testas. Den hanterar formatering
// och utskrift av text till canvas på HTML sidan. Den skriver där även ut hjälptexter.

const states = {STOPPED : 1, RUNNING : 2, PAUSED : 3};
const keyCodes = {NONE : 0, RETURN : 13, ESCAPE : 27, A : 65, B : 66, C : 67, D : 68, S : 83, W : 87, LEFT : 37, RIGHT : 39, UP : 38};
const Color = ["#DFF", "#EFD", "#FDE", "#EEF", "#FFD", "#BEF"];
			
var keysDown = [];			// Skapar en array som ska hålla reda på alla tangenter som är nedtryckta
var pgCanvas;				// Referens till aktuell canvas i html-dokumentet
var pgContext;				// Kontexten för editorn som renderas i vår canvas
var pgWidth;				// Bredden på editor canvas
var pgHeight;				// Bredden på editor canvas
var mouse = {x : 0, y : 0};	// Muspekarens position i canvas
var taskNbr = 0;			// Vald uppgift av användaren
var bkgrColor = Color[0];  	// Bakgrundens färg i canvas


// Initialisering som utförs när webbsidan med alla script laddats in.
function Initialise()
{
	// Koppla en refrens till en html canvas och sätt upp kontexten för spelet.
	pgCanvas = document.getElementById("myEditor");
	pgContext = pgCanvas.getContext("2d");
	
	// Sätt intern bredd och höjd på spelets canvas enligt HTML-sidan.
	pgWidth = document.getElementById("myEditor").width;
    pgHeight = document.getElementById("myEditor").height;

	// Koppla mus-händelser till funktioner som ska hantera dessa.
	pgCanvas.onmousedown = OnMouseDown;
	pgCanvas.onmouseup = OnMouseUp;
	
	// Koppla tangentbords-händelser till funktioner som ska hantera dessa.
	document.onkeydown = OnKeyDown;
	document.onkeyup = OnKeyUp;
	
	// Visar resultatet av lösningen

	Draw(pgContext, "Hej! gör så här:\n" +
					"  1. skriv först din kod i funktionen Uppgift<nr>\n" +
					"      som du hittar i filen med samma namn under mappen\n" +
					"      Programmeringsuppgifter.\n" +
					"  2. klicka sedan på knappen med samma namn\n" +
					"  3. klicka på knappen kör!\n" +
					"  4. kontrollera resultatet du får i det här fönstret.\n" +
					"  5. om inget händer, öppna verktyg för programmerare\n" +
					"      (ctr-shift-i) i läsaren  och gå där till konsollen\n" +
					"      för att se eventuella syntax-fel.");
}

// Funktion kopplad till exekveringsknappen "kör!" på webbsidan.
function RunButtonHandleKlickEvent()
{
	// Hämta indata från html-sidans input-fält
	var inputX = document.getElementById("myInputX").value;
	var inputY = document.getElementById("myInputY").value;
	var result = null;
	
	// Kör det egna programmet
	switch (taskNbr)
	{
		case 0:
			result = isNaN(inputX) || isNaN(inputY) ? msgInvalidNaN('X och Y') : Uppgift1(Number(inputX), Number(inputY));
		break;
		case 1:
			result = isNaN(inputX) || isNaN(inputY) ? msgInvalidNaN('X och Y') : Uppgift2(Number(inputX), Number(inputY));
		break;
		case 2:
			result = isNaN(inputX) || isNaN(inputY) ? msgInvalidNaN('X och Y') : Uppgift3(Number(inputX), Number(inputY));
		break;
		case 3:
			result = isNaN(inputX) || isNaN(inputY) ? msgInvalidNaN('X och Y') : Uppgift4(Number(inputX), Number(inputY));
		break;
		case 4:
			result = isNaN(inputX) || isNaN(inputY) ? msgInvalidNaN('X och Y') : Uppgift5(Number(inputX), Number(inputY));
		break;
		/*
		case 5:
			result = isNaN(inputX) || isNaN(inputY) ? msgInvalidNaN('X och Y') : Uppgift6(Number(inputX), Number(inputY));
		break;
		*/
		default:
			result = "Ingen uppgift vald.";
	}

	Draw(pgContext, result);
}

// Funktion kopplad till varje knapp som väljer uppgift på webbsidan.
// Parameter task: numret på den valda uppgiften
function TaskButtonKlickEvent(task)
{
	var txt = "Testkör uppgift " + (task + 1);
	taskNbr = task;
	bkgrColor = Color[taskNbr];
	
	Draw(pgContext, txt);
}

// Rapporterar ett ogiltigt tal som givits som indata.
// Parameter inputName: namnet på indatat
// Return: felmeddelande
function msgInvalidNaN(inputName)
{
	return "Indata " + inputName + " behöver vara tal.";
}


// Formaterar texten m.a.p. manuell radbrytning med \n och automatiskt
// vid maximal radlängd.
// Parameter txt: strängen som ska formateras
// Return: en array med radindelade textsträngar
function Format(txt)
{
	var inArr;
	var outArr = [];
   
	inArr = txt.toString().split(/\n|\\n/g);
	
	for (var i = 0; i < inArr.length; ++i)
	{
		while (inArr[i].length > 58)
		{
			outArr.push(inArr[i].slice(0, 58));
			inArr[i] = inArr[i].slice(58, inArr[i].length);  			
		}
		outArr.push(inArr[i]);
	}
	return outArr;
}

// Presenterar utdata på canvas
// Parameter ctx : referensen till den canvas som funktionen jobbar mot
// Parameter str : textsträng som ska skrivas ut i canvas
//text/teckensträng som ska presenteras i canvas som text
function Draw(ctx, txt)
{
	var txtArr = Format(txt);
	var maxLineWidth = 0;
	var posX = 30;
	var posY = 30;

	ctx.fillStyle = bkgrColor;
	ctx.fillRect(0, 0, pgWidth, pgHeight);
	
	ctx.fillStyle = "#000";
	ctx.font = "20px Arial";
		
	for (var i = 0; i < txtArr.length; ++i)
	{
		maxLineWidth = Math.max(maxLineWidth, txtArr[i].length);
		ctx.fillText(txtArr[i], posX, posY);
		posY += 24;
		
		if (posY > (pgHeight - 10))
		{   // Raderna slut i canvas. Börja om i ny kolumn.
			posX += maxLineWidth * 10;
			posY = 30;
		}
	}
}

// Lyssnar efter och memorerar tangenter som är nedtryckta
// Parameter e: den händelse (det event) som ska hanteras
function OnKeyDown(e) {
	
	// Krävs för att hantera event i Internet Explorer
	e = e || window.event;
	
    keysDown[e.keyCode] = true;
}

// Lyssnar efter och nollställer tangenter som släpps upp
// Parameter e: den händelse (det event) som ska hanteras  
function OnKeyUp(e) {
	
	// Krävs för att hantera event i Internet Explorer
	e = e || window.event;
	
    keysDown[e.keyCode] = false;
}

// Agerar på nedtryckning av vänster musknapp
// Parameter e: den händelse (det event) som ska hanteras 
function OnMouseDown(e)
{
	// Krävs för att hantera event i Internet Explorer
	e = e || window.event;
	
	if (event.which != 1) {
		alert ("Höger musknapp fungerar inte här. Prova vänster musknapp istället.")
		return;
	}
	
	// Hämta muspekarens position som den har på webbsidan
	mouse.x = e.clientX;
	mouse.y = e.clientY;
	
	// Justera positionen till vad den har för position i canvas-fönstret
	mouse.x -= pgCanvas.offsetLeft; 
	mouse.y -= pgCanvas.offsetTop;
}

// Agerar på släpp av vänster musknapp
// Parameter e: den händelse "event" som ska hanteras 
function OnMouseUp(e)
{
	mouseX = 0;
	mouseY = 0;
}
