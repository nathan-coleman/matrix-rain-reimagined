var _fontSize = 16;
var _fontFamily = "Courier New";
var _minDelay = 1;
var _maxDelay = 6;
var _tailLength = 10;

var _specialCharacters = "・Zﾆﾇ".split("");
var _primaryColor = "#00ff00";
var _secondaryColor = "#ff0000";
var _backgroundColor = "#000000";
var _glowColor = "#ffffff";
var _glowRadius = 6;
var _isRainbowEnabled = false;

var _katakanaChars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ"
var _latinChars = "012345789Z"
var _otherChars = ":・.\"=*+-<></>¦｜ç"
var _characters = (_katakanaChars + _latinChars + _otherChars).split("");
var _rainbowColors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];

var _columns = 0;
var _rows = 0;
var _grid = [];
var _columnSettings = [];
var _timeoutId = 0;
var _frameNumber = 0;

var _canvas = document.querySelector("canvas");
var _renderContext = _canvas.getContext("2d");

function livelyPropertyListener(inputName, input) {
    switch (inputName) {
        case "fontSize":
            _fontSize = Math.max(1, parseInt(input) || _fontSize);
            _renderContext.font = "bold " + _fontSize + "px " + _fontFamily;
            initializeGrid();
            break;
        case "fontFamily":
            _fontFamily = input || _fontFamily;
            _renderContext.font = "bold " + _fontSize + "px " + _fontFamily;
            break;
        case "minDelay":
            _minDelay = Math.max(1, parseInt(input) || _minDelay);
            break;
        case "maxDelay":
            _maxDelay = Math.max(1, parseInt(input) || _maxDelay);
            break;
        case "tailLength":
            _tailLength = Math.max(1, parseInt(input) || _tailLength);
            break;
        case "specialCharacters":
            _specialCharacters = (input || "").split("");
            break;
        case "primaryColor":
            _primaryColor = input || _primaryColor;
            break;
        case "secondaryColor":
            _secondaryColor = input || _secondaryColor;
            break;
        case "backgroundColor":
            _backgroundColor = input || _backgroundColor;
            break;
        case "glowColor":
            _glowColor = input || _glowColor;
            _renderContext.shadowColor = _glowColor;
            break;
        case "glowRadius":
            _glowRadius = Math.max(1, parseFloat(input) || _glowRadius);
            _renderContext.shadowBlur = _glowRadius;
            break;
        case "isRainbowEnabled":
            _isRainbowEnabled = !!input;
            break;
    }
}

function initializeGrid() {
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    _renderContext.textBaseline = "top";
    _renderContext.font = "bold " + _fontSize + "px " + _fontFamily;
    _renderContext.shadowColor = _glowColor;
    _renderContext.shadowBlur = _glowRadius;

    _columns = Math.floor(_canvas.width / _fontSize);
    _rows = Math.ceil(_canvas.height / _fontSize);

    _grid = new Array(_columns);
    _columnSettings = new Array(_columns);

    for (var columnIndex = 0; columnIndex < _columns; columnIndex++) {
        var column = new Array(_rows);
        for (var rowIndex = 0; rowIndex < _rows; rowIndex++) {
            column[rowIndex] = createCell(rowIndex === 0);
        }
        _grid[columnIndex] = column;
        _columnSettings[columnIndex] = createColumnSettings()
    }
}

function createColumnSettings() {
    return {
        delay: _minDelay + Math.random() * (_maxDelay - _minDelay),
        delayOffset: Math.random() * 10
    };
}

function createCell(isTip) {
    var character = getRandomChar();
    return {
        char: character,
        isTip: !!isTip,
        fade: isTip ? 1 : 0,
        color: pickGlyphColor(character)
    };
}

function getRandomChar() {
    var index = Math.floor(Math.random() * _characters.length);
    return _characters[index];
}

function pickGlyphColor(char) {
    if (_isRainbowEnabled) {
        var index = Math.floor(Math.random() * _rainbowColors.length);
        return _rainbowColors[index];
    }

    return _specialCharacters.includes(char) ? _secondaryColor : _primaryColor;
}

function draw() {
    _frameNumber++;

    _renderContext.fillStyle = _backgroundColor;
    _renderContext.fillRect(0, 0, _canvas.width, _canvas.height);

    for (var columnIndex = 0; columnIndex < _columns; columnIndex++) {
        advanceColumn(columnIndex);
        paintColumn(columnIndex);
    }

    _timeoutId = setTimeout(draw, 20);
}

function advanceColumn(columnIndex) {
    var column = _grid[columnIndex];
    var settings = _columnSettings[columnIndex];
    
    var tipRow = 0;
    for (var rowIndex = 0; rowIndex < _rows; rowIndex++) {
        var cell = column[rowIndex];
        
        if (cell.isTip) {
            tipRow = rowIndex;
        }

        cell.fade = Math.max(0, cell.fade - (1 / _tailLength / settings.delay));
    }
    
    if (Math.floor((_frameNumber + settings.delay) % settings.delay) !== 0) return;

    column[tipRow].isTip = false;
    tipRow++;
    if (tipRow >= _rows) {
        tipRow = 0;
        _columnSettings[columnIndex] = createColumnSettings()
    }

    column[tipRow] = createCell(true);
}

function paintColumn(columnIndex) {
    var column = _grid[columnIndex];
    var xPos = columnIndex * _fontSize;
    
    for (var rowIndex = 0; rowIndex < _rows; rowIndex++) {
        var cell = column[rowIndex];
        var yPos = rowIndex * _fontSize;
        
        _renderContext.fillStyle = cell.color + Math.floor(cell.fade * 255).toString(16).padStart(2, "0");
        _renderContext.fillText(cell.char, xPos, yPos);
    }
}

window.addEventListener("resize", initializeGrid);

initializeGrid();
draw();
