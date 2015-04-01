/*jslint browser: true*/
/*globals $, jQuery, alert, Uint8Array*/
/*
 * password card generator
 * Peter Brockfeld, 2014-11-06
 */

var theCard = "",
    specialChars = "",
    cornerText = "",
    hasCrypto = false,
    /*
     * Translations, thanks to Sebastian Fuchs for describing the usage of
     * data attributes as an translation tool.
     *
     * http://foxable.net/2014/04/client-seitige-mehrsprachigkeit-mit-jquery/
     *
     */
    lang = "de", // current language

    // translation data
    langData = {
        de: {
            PASSWORDCARD: "Passwort-Karte",
            SHORT_DESCRIPTION: "Diese Anwendung erzeugt eine Karte für Passwörter.",
            THE_CARD: "Die Karte",
            SETTINGS: "Einstellungen",
            SPECIAL_CHARS: "Sonderzeichen:",
            CORNER_TEXT: "Eckentext:",
            GENERATE_CARD: "Karte erzeugen",
            PRINT_CARD: "Karte drucken",
            NO_CRYPTO_WARNING: "Ihr Browser unterstützt keine kryptografisch starken Zufallszahlen.",
            EXPLANATIONS_TEXT: "Die Anwendung erzeugt eine kreditkartengroße Passwortkarte nach den Ideen des Artikels 'Passwort aus Papier - Kennwörter mit Zettel und Stift verwalten' in der c't 18/2014, S. 92. Weitere Erläuterungen finden sich in der README.md-Datei.",
            EXPLANATION: "Erläuterung"
        },
        en: {
            PASSWORDCARD: "Passwordcard",
            SHORT_DESCRIPTION: "This application generates a card for passwords.",
            THE_CARD: "The card",
            SETTINGS: "Settings",
            SPECIAL_CHARS: "Special chars:",
            CORNER_TEXT: "Corner text:",
            GENERATE_CARD: "Generate card",
            PRINT_CARD: "Print card",
            NO_CRYPTO_WARNING: "Your browser doesn't support cryptographically strong random numbers.",
            EXPLANATIONS_TEXT: "This application generates a credit card sized card for passwords. The idea is from an article in the german magazine c't, issue 18/2014, p. 92. Some further explanations could be found in README.md",
            EXPLANATION: "Explanation"
        }
    };

function BoundaryException(value, desiredOperation) {
    "use strict";
    this.value = value;
    this.message = "is to big for" + desiredOperation;
    this.toString = function () {
        return this.value + this.message;
    };
}

// returns the translation for the given
// language key (depending on the current language)
function translate(key) {
    "use strict";
    if (langData.hasOwnProperty(lang)) {
        if (langData[lang].hasOwnProperty(key)) {
            return langData[lang][key];
        } else {
            return "Undefined";
        }
    } else {
        return "Undefined";
    }
}

// translate all multi-lingual DOM elements
function translateView() {
    "use strict";
    $(".totranslate").each(function () {
        var key = $(this).attr("data-totranslate");

        $(this).text(translate(key));
    });
}

function giveRandomPosition(upTo) {
    "use strict";
    /*
     * returns some random integer up to (but not including) "upTo"
     */
    if (upTo > 255) {
        throw new BoundaryException(upTo, "random position generation");
    }

    if (hasCrypto) {
        var randomArray = new Uint8Array(1);
        //TODO replace by Math.Random for older browsers
        window.crypto.getRandomValues(randomArray);

        return Math.floor((randomArray[0] / 256) * upTo);
    } else {
        return Math.floor(Math.random() * upTo);
    }
}

function giveUpperCaseLetter() {
    "use strict";
    var upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return upperCaseLetters.charAt(giveRandomPosition(26));
}

function giveLowerCaseLetter() {
    "use strict";
    var lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    return lowerCaseLetters.charAt(giveRandomPosition(26));
}

function giveDigit() {
    "use strict";
    var digits = "0123456789";
    return digits.charAt(giveRandomPosition(10));
}

function giveSpecialChar() {
    "use strict";
    var specialCharsVal = specialChars.value;
    return specialCharsVal.charAt(giveRandomPosition(specialCharsVal.length));
}

function giveCharOfGivenType(givenType) {
    "use strict";
    /*
     * returns one random character of the given type:
     * U - uppercase letter
     * l - lowercase letter
     * 0 - single digit
     * # - special character
     */

    var charToReturn = "";

    switch (givenType) {
    case "U":
        charToReturn = giveUpperCaseLetter();
        break;
    case "l":
        charToReturn = giveLowerCaseLetter();
        break;
    case "0":
        charToReturn = giveDigit();
        break;
    case "#":
        charToReturn = giveSpecialChar();
        break;
    default:
        charToReturn = "";
        break;
    }
    return charToReturn;

}

/*
 * the next four functions return a random character, each function
 * chooses the character at random out of its own set of characters.
 */


function deleteNthChar(inputString, position) {
    "use strict";
    /*
     * deletes the n-th character of the input string and
     * returns the (now one character shorter) string.
     *
     * n is counted from 0
     */
    if (position > inputString.length) {
        throw new BoundaryException(position, "deleting char at position");
    }

    var outputString = "";
    outputString = inputString.slice(0, position);
    outputString = outputString + inputString.slice(position + 1);
    return outputString;
}

function giveTriple() {
    "use strict";
    /*
     * initialization of the output string: start with an empty string
     */
    var outputString = "",
        /* there is an urn which contains all four types of characters:
    U for uppercase letters 
    l for lowercase letters 
    0 for digits and
    # for special characters
   */
        urn = "Ul0#",
        /*
         * we choose one of the four types in the urn at random:
         */
        toDraw = giveRandomPosition(4),
        typeKey = "";

    /*
     * we delete the choosen type from the urn:
     */
    urn = deleteNthChar(urn, toDraw);

    /*
     * the urn now contains three types of characters, and we
     * choose one of them:
     */

    toDraw = giveRandomPosition(3);

    /*
     * we put choosen character type into a new variable "typeKey"
     */

    typeKey = urn.slice(toDraw, toDraw + 1);

    /*
     * we generate one character of the choosen type and put it
     * into the output:
     */

    outputString = outputString + giveCharOfGivenType(typeKey);

    /*
     * we delete the choosen type from the urn, the urn now contains two types
     */
    urn = deleteNthChar(urn, toDraw);

    /*
     * again, we choose one of them at random:
     */

    toDraw = giveRandomPosition(2);

    /*
     * one character of the choosen type into the output string:
     */
    typeKey = urn.slice(toDraw, toDraw + 1);
    outputString = outputString + giveCharOfGivenType(typeKey);

    /*
     * we delete the choosen one, the urn has one left
     */

    urn = deleteNthChar(urn, toDraw);

    /*
     * nothing to choose, we use the last type of character to finish
     * the output string
     */

    typeKey = urn;
    outputString = outputString + giveCharOfGivenType(typeKey);

    return outputString;
}




function initializeTheCard() {
    "use strict";
    // create header:
    var singleRow = "";

    singleRow = document.createElement("tr");
    singleRow.innerHTML =
        '<tr>' +
        '<th class="singleCell" id="cornerTextOnCard"></th>' +
        '<th class="singleCell">ABC</th>' +
        '<th class="singleCell">DEF</th>' +
        '<th class="singleCell">GHI</th>' +
        '<th class="singleCell">JKL</th>' +
        '<th class="singleCell">MNO</th>' +
        '<th class="singleCell">PQR</th>' +
        '<th class="singleCell">STU</th>' +
        '<th class="singleCell">VWX</th>' +
        '<th class="singleCell">YZ.</th>' +
        '</th>';
    singleRow.setAttribute("class", "tableHead");
    theCard.appendChild(singleRow);
}

function initializeSettings() {
    "use strict";
    specialChars = document.getElementById("specialChars");
    cornerText = document.getElementById("cornerText");
    specialChars.value = "+-#.,!§$%&/()=?;:_'*";
    cornerText.value = "TST";
}

function checkCryptoSupport() {
    "use strict";
    hasCrypto = window.crypto ? true : false;
    if (hasCrypto === false) {
        $("#noCryptoWarning").dialog("open");
    }
}

function createSingleCell() {
    "use strict";
    var singleCell = document.createElement("td");

    singleCell.innerHTML = '<td>' + giveTriple() + '</td>';
    singleCell.setAttribute("class", "singleCell");

    return singleCell;

}

function createSingleRow(prefix) {
    "use strict";
    /*
     * this function generates a single row filled with random character
     * triples.
     *
     * The first cell contains the prefix given.
     */

    var singleRow = document.createElement("tr"),
        prefixCell = document.createElement("td"),
        i = 0;

    prefixCell.innerHTML = '<td>' + prefix + '</td>';
    prefixCell.setAttribute("class", "singleCell");

    singleRow.appendChild(prefixCell);

    for (i = 0; i < 9; i = i + 1) {
        singleRow.appendChild(createSingleCell());
    }

    singleRow.setAttribute("class", "generatedRow");
    return singleRow;
}


function fillTheCard() {
    "use strict";
    /*
     * this function fills the card with random contents.
     * As a first step, we get rid off any contents left from
     * former runs.
     *
     * The headerline is left untouched.
     */

    // get all the rows and count them:
    var rowsOfTheCard = document.getElementsByClassName("generatedRow"),
        countRows = rowsOfTheCard.length,
        i = 0,
        cornerCell = document.getElementById("cornerTextOnCard"),
        prefix = "";

    for (i = 0; i < countRows; i = i + 1) {
        rowsOfTheCard[0].parentNode.removeChild(rowsOfTheCard[0]);

    }

    // adjust the corner text:

    cornerCell.innerHTML = cornerText.value;

    /* the first cell in each row is a prefix number, simply counted
     * from 1 to 9.
     */

    /*
     * and now: generate 9 rows, each starting with a new prefix.
     * The "createSingleRow" returns one new row of cells with
     * 10 entries.
     */
    for (i = 1; i < 10; i = i + 1) {
        prefix = i.toString();
        theCard.appendChild(createSingleRow(prefix));
    }
}

/*
 * jQueryUI functions
 */

$(function () {
    "use strict";
    $("#generateTable")
        .button()
        .click(function () {
            fillTheCard();
        });
    $("#printCard")
        .button()
        .click(function () {
            window.print();
        });
    $("#tabs")
        .tabs({
            heightStyle: "auto"
        });
    $("#de, #en").click(function () {
        lang = $(this).attr("id");
        translateView();
    });
    $("#noCryptoWarning").dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
});

function init() {
    "use strict";
    checkCryptoSupport();
    theCard = document.getElementById("theCard");
    initializeSettings();
    translateView();
    initializeTheCard();
    fillTheCard();
}


window.onload = init;