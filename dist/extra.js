var _this7 = this;
     
// Create training button
var button = document.getElementById(btnType);
//button.innerText = "Add Example"; //"Train " + words[i].toUpperCase()
//div.appendChild(button);

// Listen for mouse events when clicking the button
button.addEventListener('mousedown', function () {
    return _this7.training = i;
});
button.addEventListener('mouseup', function () {
    return _this7.training = -1;
});

// Create clear button to remove training examples
var btn = document.getElementById('clear_'+btnType);


btn.addEventListener('mousedown', function () {
    console.log("clear training data for this label");
    _this7.knn.clearClass(i);
    _this7.infoTexts[i].innerText = " 0 examples";
    _this7.checkMarks[i].src="Images\\loader.gif";
});

// Create info text
var infoText = document.getElementById('counter_'+btnType);
var checkMark = document.getElementById('checkmark_'+btnType);

var cardArea=document.getElementById("trained_cards");
var gestureCard= document.createElement("div");
gestureCard.className="trained-gestures";
var gestName="";
if(btnType=="startButton"){
    gestName="Start Button";
} else{
    gestName="Stop Button";
}
var gestureName= document.createElement("h5");
gestureName.innerText=gestName;
//add image
//add accuracy
gestureCard.appendChild(gestureName);
cardArea.appendChild(gestureCard);

infoText.innerText = " 0 examples";
checkMark.src='Images\\loader.gif';
this.infoTexts.push(infoText);
this.checkMarks.push(checkMark);
this.gestureCards.push(gestureCard);