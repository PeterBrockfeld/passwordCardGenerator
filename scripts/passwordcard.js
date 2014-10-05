var theCard = "";
var specialChars = "";
var cornerText = "";

window.onload = init;

function BoundaryException(value, desiredOperation) {
   this.value = value;
   this.message = "is to big for" + desiredOperation;
   this.toString = function() {
      return this.value + this.message
   };
}

/*
 * jQueryUI functions
 */

$(function() {
  $( "#generateTable" )
    .button()
    .click(function() {
    fillTheCard();});
  $( "#printCard" )
    .button()
    .click(function() {
    window.print();});  
  $( "#tabs" )
    .tabs( {heightStyle: "auto"} );
    
  });


function initializeTheCard() {
  
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
  specialChars = document.getElementById("specialChars");
  cornerText = document.getElementById("cornerText");
  specialChars.value = "+-#.,!§$%&/()=?;:_'*";
  cornerText.value = "TST";
}

function init() {
  
  theCard = document.getElementById("theCard");
  initializeSettings();
  initializeTheCard();
  fillTheCard();
}

function fillTheCard() {
  /*
   * this function fills the card with random contents.
   * As a first step, we get rid off any contents left from
   * former runs.
   * 
   * The headerline is left untouched.
   */
  
  // get all the rows and count them:
  var rowsOfTheCard = document.getElementsByTagName("tr");
  var countRows = rowsOfTheCard.length;
  
  // leave the header (nearly) untouched, so we start at "1", the second row.
  for (var i = 1; i < countRows; i++) {
    rowsOfTheCard[1].parentNode.removeChild(rowsOfTheCard[1]);

  }
 
  // adjust the corner text:
  var cornerCell = document.getElementById("cornerTextOnCard");
  cornerCell.innerHTML = cornerText.value;
  
  /* the first cell in each row is a prefix number, simply counted
   * from 1 to 9.
   */
  
  var prefix = "";
  
  /*
   * and now: generate 9 rows, each starting with a new prefix.
   * The "createSingleRow" returns one new row of cells with
   * 10 entries.
   */
  for (var i=1; i < 10; i++) {
    prefix = i.toString();
    theCard.appendChild(createSingleRow(prefix));
  }
}


function createSingleRow(prefix) {
  /*
   * this function generates a single row filled with random character 
   * triples.
   *
   * The first cell contains the prefix given. 
   */
  
  var singleRow = document.createElement("tr");
  var prefixCell = document.createElement("td");
  
  prefixCell.innerHTML = '<td>' + prefix + '</td>';
  prefixCell.setAttribute("class", "singleCell");
 
  singleRow.appendChild(prefixCell);

  for (var i = 0; i < 9; i++) {
    singleRow.appendChild(createSingleCell());
  }
  return singleRow;  
}

function createSingleCell() {
  var singleCell = document.createElement("td");

  singleCell.innerHTML = '<td>' + giveTriple() + '</td>';
  singleCell.setAttribute("class", "singleCell");

  return singleCell;
  
}

function giveTriple() {
  /*
   * initialization of the output string: start with an empty string
   */
    var outputString = "";
    
  /* there is an urn which contains all four types of characters:
    U for uppercase letters 
    l for lowercase letters 
    0 for digits and
    # for special characters
   */
  
  var urn = "Ul0#";

  /*
   * we choose one of the four types in the urn at random:
   */
  var toDraw = giveRandomPosition(4);
  
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
  var typeKey = "";
  typeKey = urn.slice(toDraw, toDraw+1);
  
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
  typeKey = urn.slice(toDraw, toDraw+1);
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


function giveRandomPosition(upTo) {
  /*
   * returns some random integer up to (but not including) "upTo"
   */
  if (upTo > 255) { 
    throw new BoundaryException(upTo, "random position generation");
  }

 var randomArray = new Uint8Array(1);
 window.crypto.getRandomValues(randomArray);
  
 return Math.floor((randomArray[0] / 256 ) * upTo);
  
}

function giveCharOfGivenType(givenType) {
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

function giveUpperCaseLetter() {
  var upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return upperCaseLetters.charAt(giveRandomPosition(26));
}

function giveLowerCaseLetter() {
  var lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  return lowerCaseLetters.charAt(giveRandomPosition(26));
}

function giveDigit() {
  var digits = "0123456789";
  return digits.charAt(giveRandomPosition(10));
}

function giveSpecialChar() {
  var specialCharsVal = specialChars.value;
  return specialCharsVal.charAt(giveRandomPosition(specialCharsVal.length));
}

function deleteNthChar(inputString, position) {
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
  outputString = outputString + inputString.slice(position+1);
  return outputString;
}







