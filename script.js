function livelyPropertyListener(inputName, input) {
    switch (inputName) {
        case "textSize":
            fontSize = input;
            columns = canvas.width / fontSize;
            break;
        case "fontFamily":
            font = input;
            break;
        case "fallingDelay":
            delay = input;
            if (timeoutId != 0)
            {
                clearTimeout(timeoutId);
                draw();
            }
            break;
        case "characterFade":
            characterFade = input / 100.0;
            break;
        case "rainingCharacters":
            letters = input.split("");
            break;
        case "rainingCharactersColor":
            primaryColor = input;
            break;
        case "specialCharacters":
            specialLetters = input.split("");
            break;
        case "specialCharactersColor":
            secondaryColor = input;
            break;
        case "isRainbowEnabled":
            isRainbowEnabled = input;
            break;
        case "color1":
            rainbowColors[0] = input;
            break;
        case "color2":
            rainbowColors[1] = input;
            break;
        case "color3":
            rainbowColors[2] = input;
            break;
        case "color4":
            rainbowColors[3] = input;
            break;
        case "color5":
            rainbowColors[4] = input;
            break;
        case "color6":
            rainbowColors[5] = input;
            break;
        case "color7":
            rainbowColors[6] = input
    }
}

function draw() {
    renderContext.fillStyle = "rgba(0, 0, 0, " + characterFade + ")";
    renderContext.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < drops.length; i++) {
        var char = letters[Math.floor(Math.random() * letters.length)];
        char = char || "v";
    
        if (isRainbowEnabled)
        {
            renderContext.fillStyle = rainbowColors[rainbowIndex];
            rainbowIndex = (rainbowIndex + 1) % rainbowColors.length;
        }
        else if (specialLetters.includes(char))
        {
            renderContext.fillStyle = secondaryColor;
        }
        else 
        {
            renderContext.fillStyle = primaryColor;
        }

        renderContext.font = fontSize + "px " + font;
        renderContext.fillText(char, i * fontSize, drops[i] * fontSize);
        drops[i]++;

        if (drops[i] * fontSize > canvas.height && Math.random() > .95)
        {
            drops[i] = 0;
        }
    }
    timeoutId = setTimeout(draw, parseInt(delay))
}

// Set up canvas
var canvas = document.querySelector("canvas");
var renderContext = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Declare defaults
var fontSize = 16;
var columns = canvas.width / fontSize;
var font = "Arial";
var delay = 40;
var characterFade = 0.1;

var kanjiChars = "日"
var katakanaChars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇ"
var missingKatakanaChars = "ｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ"
var digitChars = "012345789"
var romanChars = "Z"
var punctuationChars = ":・.\"=*+-<></>"
var otherChars = "¦｜ç"

var letters = (kanjiChars + katakanaChars + missingKatakanaChars + digitChars + romanChars + punctuationChars + otherChars).split("");
var specialLetters = "日・Zﾆﾇ".split("");
var primaryColor = "#00ff00";
var secondaryColor = "#ff0000";
var backgroundColor = "#0fff00";
var isRainbowEnabled = false;
var rainbowColors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];

// Create drops
var drops = []
for (var i = 0; i < columns; i++)
{
    drops[i] = 1;
}
var timeoutId;
var rainbowIndex = 0;

// Finally, begin the drawing loop
draw();
