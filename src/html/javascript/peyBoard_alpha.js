//==========================================
// Title:  peyBoard_alpha.js
// Author: Pegor Karoglanian
// Date:   7/1/22
// Notes:  This is a lightweight touchscreen keyboard class. 
//         It is currently in alpha stages but works for this application.
//==========================================

class PeyBoard_alpha {
    constructor(divId, textInput, opt2 = {}) {

        var divType = document.getElementById(divId).tagName;
        if (divType != 'DIV') {
            throw("peyBoard can only be created within a DIV element.")
        } else {
            this._div = document.getElementById(divId);
        }

        this._divId = divId;

        this._clientWidth =  480; //this._div.clientWidth;
        this._clientHeight = 300; //this._div.clientHeight;
        
        var keepRatio = 1; //leave for now
        this._keyWidth = ((this._clientWidth / 10 ) - 5)*keepRatio;
        this._keyHeight = ((this._clientHeight / 4 ) - 5)*keepRatio;

        if (this._keyWidth < 20) {
            this._keyWidth = 20;
        }

        if (this._keyHeight < 20) {
            this._keyHeight = 20;
        }

        this._lowercaseLayout  = "";
        this._uppercaseLayout  = "";
        this._symbols1Layout   = "";
        this._symbols2Layout   = "";

        this._upperCase = false;

        //uppercase
        this.generateLettersLayout(false);
        //lowercase
        this.generateLettersLayout(true);

        //uppercase
        this.generateSymbolsLayout(false);
        //lowercase
        this.generateSymbolsLayout(true);
        

        $("#" + divId).html(this._lowercaseLayout)
        console.log("peyBoard initiated.")
    }

    static lettersFirstRow    = ["q","w","e","r","t","y","u","i","o","p"];
    static lettersSecondRow   = ["a","s","d","f","g","h","j","k","l"];
    static lettersThirdRow    = ["z","x","c","v","b","n","m"];

    static symbols1FirstRow   = ["1","2","3","4","5","6","7","8","9","0"]
    static symbols1SecondRow  = ["@","#","$","_","&","-","+","(",")"];
    // static symbols1ThirdRow   = "*\"\':;!?";
    static symbols1ThirdRow   = ["\"","\\","\'",":",";","!","?"];
    
    static symbols2FirstRow   = ["~","`","|","^","=","{","}","\%","*"];
    static symbols2SecondRow  = ["[","]","<",">",",",".","/"];
}


// ----------------------- FUNCTIONS ---------------------

PeyBoard_alpha.prototype.calculateDynamicStyle = function() {
    this._keyHeight = argument
    this._keyWidth
}

PeyBoard_alpha.prototype.show = function() {
    $("#" + this._divId).show();
}

PeyBoard_alpha.prototype.hide = function() {
    $("#" + this._divId).hide();
}

PeyBoard_alpha.prototype.generateLettersLayout = function(upperCase) {
    // first row (10 elements)
    var letterLayout = [];
    var dynamicStyle = "style='height:"+ this._keyHeight +"px; width:"+ this._keyWidth +"px; line-height:"+ this._keyHeight +"px;'";
    var dynamicSpaceStyle = "style='height:"+ this._keyHeight +"px; width:"+ (5 * this._keyWidth) +"px; line-height:"+ this._keyHeight +"px;'";
    letterLayout.push("<div class = peyBoard style='height:"+ this._clientHeight +"px; width:"+ this._clientWidth +"px;'>")
    letterLayout.push("<div class = 'keyboardRow'>");
    for (letter in PeyBoard_alpha.lettersFirstRow) {
        var key = (upperCase ? PeyBoard_alpha.lettersFirstRow[letter].toUpperCase() : PeyBoard_alpha.lettersFirstRow[letter])
        var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
        letterLayout.push(divElement);
    }
    letterLayout.push("</div>");

    // second row (9 elements)
    letterLayout.push("<div class = 'keyboardRow'>");
    for (letter in PeyBoard_alpha.lettersSecondRow) {
        var key = (upperCase ? PeyBoard_alpha.lettersSecondRow[letter].toUpperCase() : PeyBoard_alpha.lettersSecondRow[letter])
        var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
        letterLayout.push(divElement);
    }
    letterLayout.push("</div>");

    // third row (9 elements)
    letterLayout.push("<div class = 'keyboardRow'>");
    letterLayout.push("<div onclick = upperCase(false); class = 'keyboardKey" + (upperCase ? ' shiftKeyActive\' ' : ' shiftKeyInactive\' ')+ dynamicStyle +">" + "^" + "</div>");
    for (letter in PeyBoard_alpha.lettersThirdRow) {
        var key = (upperCase ? PeyBoard_alpha.lettersThirdRow[letter].toUpperCase() : PeyBoard_alpha.lettersThirdRow[letter])
        var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
        letterLayout.push(divElement);
    }
    letterLayout.push("<div class = 'keyboardKey deleteKey' "+ dynamicStyle +" onclick='removeLetter()'>" + "<=" + "</div>");
    letterLayout.push("</div>");


    // fourth row (4 elements)
    letterLayout.push("<div class = 'keyboardRow'>");
    letterLayout.push("<div onclick = upperCase(true); class = 'keyboardKey' "+ dynamicStyle + ">" + "?123" + "</div>")
    letterLayout.push("<div class = 'keyboardKey' "+ dynamicSpaceStyle + " onclick = addLetter('space')>" + "space" + "</div>");
    letterLayout.push("</div>");

    if (upperCase) {
        this._uppercaseLayout  = letterLayout.join("");
    } else {
        this._lowercaseLayout = letterLayout.join("");
    }
}

PeyBoard_alpha.prototype.generateSymbolsLayout = function(upperCase) {
    var symbolLayout = [];
    var dynamicStyle = "style='height:"+ this._keyHeight +"px; width:"+ this._keyWidth +"px; line-height:"+ this._keyHeight +"px;'";
    var dynamicSpaceStyle = "style='height:"+ this._keyHeight +"px; width:"+ (5 * this._keyWidth) +"px; line-height:"+ this._keyHeight +"px;'";
    symbolLayout.push("<div class = peyBoard style='height:"+ this._clientHeight +"px; width:"+ this._clientWidth +"px;'>")
    symbolLayout.push("<div class = 'keyboardRow'>");
    if (upperCase) {
        for (symbol in PeyBoard_alpha.symbols1FirstRow) {
            var key = PeyBoard_alpha.symbols1FirstRow[symbol]
            var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
            symbolLayout.push(divElement);
        }
        symbolLayout.push("</div>");
    
        // second row (9 elements)
        symbolLayout.push("<div class = 'keyboardRow'>");
        for (symbol in PeyBoard_alpha.symbols1SecondRow) {
            var key = PeyBoard_alpha.symbols1SecondRow[symbol]
            var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
            symbolLayout.push(divElement);
        }
        symbolLayout.push("</div>");
    
        // third row (9 elements)
        symbolLayout.push("<div class = 'keyboardRow'>");
        symbolLayout.push("<div onclick = upperCase(true); class = 'keyboardKey"  + (upperCase ? ' shiftKeyActive\' ' : '\' ') + dynamicStyle +">" + "^" + "</div>");
        for (symbol in PeyBoard_alpha.symbols1ThirdRow) {
            var key = PeyBoard_alpha.symbols1ThirdRow[symbol]
            if (key == "\"") {
                var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\"quot\")'>" + key + "</div>"
            } else if (key == "\'") {
                var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\"apos\")'>" + key + "</div>"
            } else if (key == "\\") { 
                var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\"bsla\")'>" + key + "</div>"
            } else {
                var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
            }
            symbolLayout.push(divElement);
        }
        symbolLayout.push("<div class = 'keyboardKey' "+ dynamicStyle +" onclick='removeLetter()'>" + "<=" + "</div>");
        symbolLayout.push("</div>");
    } else {
        for (symbol in PeyBoard_alpha.symbols1FirstRow) {
            var key = PeyBoard_alpha.symbols1FirstRow[symbol]
            var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
            symbolLayout.push(divElement);
        }
        symbolLayout.push("</div>");
    
        // second row (9 elements)
        symbolLayout.push("<div class = 'keyboardRow'>");
        for (symbol in PeyBoard_alpha.symbols2FirstRow) {
            var key = PeyBoard_alpha.symbols2FirstRow[symbol]
            var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
            symbolLayout.push(divElement);
        }
        symbolLayout.push("</div>");
    
        // third row (9 elements)
        symbolLayout.push("<div class = 'keyboardRow'>");
        symbolLayout.push("<div onclick = upperCase(true); class = 'keyboardKey'" + dynamicStyle +">" + "^" + "</div>");
        for (symbol in PeyBoard_alpha.symbols2SecondRow) {
            var key = PeyBoard_alpha.symbols2SecondRow[symbol]
            var divElement = "<div class = 'keyboardKey' "+ dynamicStyle +" onclick='addLetter(\""+ key +"\")'>" + key + "</div>"
            symbolLayout.push(divElement);
        }
        symbolLayout.push("<div class = 'keyboardKey' "+ dynamicStyle +" onclick='removeLetter()'>" + "<=" + "</div>");
        symbolLayout.push("</div>");
    }



    // fourth row (4 elements)
    symbolLayout.push("<div class = 'keyboardRow'>");
    symbolLayout.push("<div onclick = upperCase(false); class = 'keyboardKey' "+ dynamicStyle + ">" + "ABC" + "</div>")
    symbolLayout.push("<div class = 'keyboardKey' onclick = addLetter('space'); "+ dynamicSpaceStyle + ">" + "space" + "</div>");
    symbolLayout.push("</div>");

    if (upperCase) {
        this._symbols1Layout  = symbolLayout.join("");
    } else {
        this._symbols2Layout = symbolLayout.join("");
    }
}


function upperCase(symbol) {
    if(symbol) {
        if(_pBoard._upperCase) {
            $("#" + _pBoard._divId).html(_pBoard._symbols1Layout)
            _pBoard._upperCase = false;
        } else {
            $("#" + _pBoard._divId).html(_pBoard._symbols2Layout)
            _pBoard._upperCase = true;
        }
    } else {
        if(_pBoard._upperCase) {
            $("#" + _pBoard._divId).html(_pBoard._lowercaseLayout)
            _pBoard._upperCase = false;
        } else {
            $("#" + _pBoard._divId).html(_pBoard._uppercaseLayout)
            _pBoard._upperCase = true;
        }
    }
}

function symbolsFirst() {

}

function symbolsSecond() {

}

function addLetter(letter) {
    if (letter == "quot") {
        letter = "\"";
    } else if (letter == "apos") {
        letter = "\'";
    } else if (letter == "bsla") {
        letter = "\\";
    } else if (letter == "space") {
        letter = " ";
    }

    var scrollLeft = $("#wifiPassword").val().length * 341
    $("#wifiPassword").val($('#wifiPassword').val()+letter).focus()
    $("#wifiPassword").scrollLeft(scrollLeft);
    checkWifiPassword();
}

function removeLetter() {
    var scrollLeft = $("#wifiPassword").val().length * 341
    $("#wifiPassword").val($('#wifiPassword').val().slice(0,-1)).focus()
    $("#wifiPassword").scrollLeft(scrollLeft);
    checkWifiPassword();
}