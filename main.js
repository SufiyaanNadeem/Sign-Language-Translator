/* 
File Description:
This file manages the Training and Translation of Words using the SqueezeNet Classifier and Google TensorFlow's
version of the k-Nearest Neighbour (kNN) Classifier. This file is also responsible for altering page elements in 
index.html and creates local host where the ASL Translator Runs runs.

Credits:
The kNN Classifier used for this project was created by Google TensorFlow. 
The kNN classifier requires the computation of random numbers that is not readily available on JavaScript.
To accomplish the work of Johannes Baagøe on "implementations of Randomness in Javascript" was used.
Additionally, usage of TensorFlow was learned from Abishek Singh's "alexa-sign-language-translator".

My Work:
The Main() method that is responsible for using the TensorFlow library to train and predict words from the video
feed as well as control the User Interface was programmed by me. The main differentiator from the way I have used
TensorFlow and how others have in the past, especially in terms of sign language translation, is that more gestures
can be trained in my version even after prediction has started. Additionally, customized training yields more accurate
results compared with other projects where datasets are used. This is because most datasets have black backgrounds, 
perfect lighting, and not enough images. This limits not only the accuracy of the prediction but also what words or
letters can be trained. My program is accurate and has been able to handle more than 20 different words in testing.

Main Goals for Final Release:
I am to save users' trained models so they can be reloaded whenever the translator is reactivated in order to save
training time. Additionally, I aim to create a server for video chatting + live translation for Final Release.
For more information on the updates that will be ready for Final Release please view README.md.

To check my progress on this project, please visit: https://github.com/SufiyaanNadeem/American-Sign-Language-Translator
Author: Sufiyaan Nadeem
*/
// Launch in kiosk mode
// /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --app=http://localhost:9966


import {
  KNNImageClassifier
} from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';


function setCookie(cname, cvalue, exdays) {
  console.log("cookie set");
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;

const predictionThreshold = 0.98

var words = ["start", "stop"];

// words from above array which act as terminal words in a sentence
var endWords = ["stop"];


class Main {
  constructor() {
    // Initiate variables
    this.infoTexts = [];
    this.checkMarks = [];
    this.gestureCards = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;

    this.previousPrediction = -1;
    this.currentPredictedWords = [];

    // variables to restrict prediction rate
    this.now;
    this.then = Date.now();
    this.startTime = this.then;
    this.fps = 5; //framerate - number of prediction per second
    this.fpsInterval = 1000 / this.fps;
    this.elapsed = 0;

    this.knn = getCookie("knn");
    if (this.knn != "") {
      alert("Welcome again " + "sufiyaan"); //this.knn.exampleCount[0]);
    } else {
      alert("nothing happened");
      this.knn = null;
      /*knn = prompt("Please enter your name:", "");
                if (knn != "" && knn != null) {
                    setCookie("knn", knn, 365);
                }*/
    }

    var name = getCookie("name");
    if (name != "") {
      alert("Welcome again " + name);
    } else {
      //alert("nothing happened");
      this.name = null;
      name = prompt("Please enter your name:", "");
      if (name != "" && name != null) {
        setCookie("name", name, 365);
      }
    }
    //setCookie("name","Sufiyaan",365);


    this.initialKnn = this.knn;

    this.stageTitle = document.getElementById("stage");
    this.textLine = document.getElementById("steps");

    this.translationContainer = document.getElementById("translationContainer");
    this.translationText = document.getElementById("translationText");

    // Get video element that will contain the webcam image
    this.video = document.getElementById('video');

    this.statusText = document.getElementById("status-text");
    this.saveThis = null;

    this.welcomeContainer = document.getElementById("welcomeContainer");
    this.proceedBtn = document.getElementById("proceedButton");


    this.proceedBtn.addEventListener('mousedown', () => {
      this.welcomeContainer.classList.add("slideOutUp");
    })

    this.video.addEventListener('mousedown', () => {
      // click on video to go back to training buttons
      main.pausePredicting();
    });

    document.getElementById("status").style.display = "none";

    this.createTrainingBtn();

    // load text to speech
    this.tts = new TextToSpeech();

  }



  createPredictBtn() {

    var predButton = document.getElementById("predictButton");
    predButton.style.display = "block";

    predButton.addEventListener('mousedown', () => {
      if (predButton.innerText == "Translate") {
        setCookie("knn", this.knn, 365);
        const exampleCount = this.knn.getClassExampleCount()

        // check if training has been done
        if (Math.max(...exampleCount) > 0) {
          // if wake word has not been trained
          if (exampleCount[0] == 0) {
            alert('You haven\'t added examples for the Start Gesture');
            return;
          }

          // if the catchall phrase other hasnt been trained
          if (exampleCount[1] == 0) {
            alert('You haven\'t added examples for the Stop Gesture.\n\nCapture yourself in idle states e.g hands by your side, empty background etc.');
            return;
          }
          predButton.innerText = "Back to Training";

          this.stageTitle.innerText = "Translate";
          this.textLine.innerText = "Start Translating with your Start Gesture.";


          var trainingContainer = document.getElementById("train-new");
          trainingContainer.style.display = "none";
          var trainedCards = document.getElementById("trained_cards");
          trainedCards.style.display = "none";

          this.translationContainer.style.display = "block";


          var videoContainer = document.getElementById("videoHolder");
          videoContainer.className = "videoContainerPredict";

          var video = document.getElementById("video");
          video.className = "videoPredict";


          console.log("sign your query");


          this.startPredicting();
        } else {
          alert('You haven\'t added any examples yet.\n\nPress and hold on the "Add Example" button next to each word while performing the sign in front of the webcam.');
        }
      } else {
        main.pausePredicting();
        predButton.innerText = "Translate";

        this.stageTitle.innerText = "Train Gestures";
        this.textLine.innerText = "Train about 30 samples of your Start Gesture and 30 for your idle, Stop Gesture.";


        var trainingContainer = document.getElementById("train-new");
        trainingContainer.style.display = "block";
        var trainedCards = document.getElementById("trained_cards");
        trainedCards.style.display = "block";

        this.translationContainer.style.display = "none";


        var videoContainer = document.getElementById("videoHolder");
        videoContainer.className = "videoContainerTrain";

        var video = document.getElementById("video");
        video.className = "videoTrain";
      }

    })
  }

  createTrainingBtn() {
    this.startWebcam();

    console.log("ready to train");
    this.createButtonList(true);

    this.loadKNN();

  }

  areTerminalWordsTrained(exampleCount) {

    var totalTerminalWordsTrained = 0;

    for (var i = 0; i < words.length; i++) {
      if (endWords.includes(words[i])) {
        if (exampleCount[i] > 0) {
          totalTerminalWordsTrained += 1;
        }
      }
    }

    return totalTerminalWordsTrained;
  }

  startWebcam() {
    // Setup webcam
    navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        },
        audio: false
      })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.width = IMAGE_SIZE;
        this.video.height = IMAGE_SIZE;

        this.video.addEventListener('playing', () => this.videoPlaying = true);
        this.video.addEventListener('paused', () => this.videoPlaying = false);
      })
  }


  loadKNN() {
    this.knn = new KNNImageClassifier(words.length, TOPK);

    // Load knn model
    this.knn.load().then(() => this.startTraining());
  }

  createButtonList(showBtn) {
    // Create clear button to remove training examples
    var btn = document.getElementById('nextButton');
    btn.addEventListener('mousedown', () => {
      const exampleCount = this.knn.getClassExampleCount();
      if (Math.max(...exampleCount) > 0) {
        // if wake word has not been trained
        if (exampleCount[0] == 0) {
          alert('You haven\'t added examples for the Start Gesture');
          return;
        }

        // if the catchall phrase other hasnt been trained
        if (exampleCount[1] == 0) {
          alert('You haven\'t added examples for the Stop Gesture.\n\nCapture yourself in idle states e.g hands by your side, empty background etc.');
          return;
        }
        btn.style.display = "none";
        this.stageTitle.innerText = "Continue Training";
        this.textLine.innerText = "Add Gesture Name and Train.";

        this.createGestureList(true);
      }
    });

    this.intialBtn(0, "startButton");
    this.intialBtn(1, "stopButton");

  }

  createGestureList(showBtn) {
    //showBtn - true: show training btns, false:show only text

    console.log("next step");
    const exampleCount = this.knn.getClassExampleCount();

    // check if training has been done
    if (Math.max(...exampleCount) > 0) {

      // if wake word has not been trained
      if (exampleCount[0] == 0) {
        alert('You haven\'t added examples for the wake word');
        return;
      }

      // if the catchall phrase other hasnt been trained
      if (exampleCount[1] == 0) {
        alert('You haven\'t added examples for the catchall sign OTHER.\n\nCapture yourself in idle states e.g hands by your side, empty background etc.\n\nThis prevents words from being erroneously detected.');
        return;
      }

      //Delete/Move all the things we're done with
      var initialTraining = document.getElementById('initialTraining');
      initialTraining.style.display = "none";

      //Add Cards
      var startTraining = document.getElementById('train-new');
      startTraining.style.display = "block";
      var trainedCards = document.getElementById('trained_cards');
      trainedCards.style.display = "block";
      trainedCards.classList.add("animated");
      trainedCards.classList.add("slower");
      trainedCards.classList.add("slideInUp");


      console.log("start adding gestures");
      /*for (var i = 0; i < words.length; i++) {
          this.createButton(i, showBtn);
      }*/

      this.addWordForm = document.getElementById("add-word");
      this.addWordForm.addEventListener('submit', (e) => {
        var trainingDiv = document.getElementById("trainingDisplay");
        trainingDiv.innerHTML = "";

        e.preventDefault();
        var word = document.getElementById("new-word").value.trim();
        //var checkbox = document.getElementById("is-terminal-word");

        if (word && !words.includes(word)) {
          //console.log(word)
          words.push(word); //insert at penultimate index in array
          this.numClasses += 1;
          console.log("INDEX: " + words.indexOf(word));
          this.createButton(words.indexOf(word));
          //console.log(words)


          document.getElementById("new-word").value = '';
          //now set and train ready to click
          console.log("came here once");

          console.log("Knn for gestures: " + this.initialKnn.getClassExampleCount()[0]);
          //this.initialKnn=this.knn;
          //this.loadKNN();
          this.knn.numClasses += 1;

          this.knn.classLogitsMatrices.push(null);
          this.knn.classExampleCount.push(0);

          this.startTraining();
          this.createPredictBtn();

        } else {
          alert("Duplicate word or no word entered");
        }

        return;
      });



    } else {
      alert('You haven\'t added any examples yet.\n\nPress and hold on the "Add Example" button next to each word while performing the sign in front of the webcam.');
    }
  }

  createButton(i) { //i is the index of the new word

    var div = document.getElementById("trainingDisplay");

    // Create Word Text
    var trainBtn = document.createElement('button');
    trainBtn.className = "trainBtn";

    var clearBtn = document.createElement('button');
    clearBtn.className = "clearButton";

    // Create training button
    trainBtn.innerText = "Train"; //"Train " + words[i].toUpperCase()
    clearBtn.innerText = "Clear"; //`Clear ${words[i].toUpperCase()}`

    //Part of train btn div
    div.appendChild(trainBtn);
    div.appendChild(clearBtn);

    // Listen for mouse events when clicking the button
    trainBtn.addEventListener('mousedown', () => {
      return this.training = i;
    });
    trainBtn.addEventListener('mouseup', () => {
      return this.training = -1;
    });


    clearBtn.addEventListener('mousedown', () => {
      console.log("clear training data for this label");
      this.knn.clearClass(i);
      this.infoTexts[i].innerText = " 0 examples";
      this.gestureCards[i].removeChild(this.gestureCards[i].childNodes[1]);
      //clear canvas
    });

    // Create info text
    var infoText = document.createElement('h3');
    infoText.style.color = "black";

    div.appendChild(infoText);
    var checkMark = document.createElement('img');
    checkMark.className = "checkMark";
    div.appendChild(checkMark);

    var cardArea = document.getElementById("trained_cards");
    var gestureCard = document.createElement("div");
    gestureCard.className = "trained-gestures";
    var gestName = words[i];

    var gestureName = document.createElement("h5");
    gestureName.innerText = gestName;
    //add image
    //add accuracy
    gestureCard.appendChild(gestureName);
    cardArea.appendChild(gestureCard);

    infoText.innerText = " 0 examples";
    checkMark.src = 'Images\\loader.gif';
    this.infoTexts.push(infoText);
    this.checkMarks.push(checkMark);
    this.gestureCards.push(gestureCard);

    gestureCard.addEventListener('mousedown', () => { //create btn
      if (gestureCard.style.marginTop == "17px" || gestureCard.style.marginTop == "") {
        document.getElementById("add-word").style.display = "none";
        div.innerHTML = "";

        document.getElementById("add-gesture").innerText = gestName;

        var plusImage = document.getElementById("plus_sign");
        plusImage.src = "Images/retrain.svg";
        plusImage.classList.add("rotateIn");
        var doneTrainingBtn = document.getElementById("done_training");
        doneTrainingBtn.style.display = "block";
        div.appendChild(trainBtn);
        div.appendChild(clearBtn);
        div.appendChild(infoText);
        div.appendChild(checkMark);
        gestureCard.style.marginTop = "-10px";
      } else {
        document.getElementById("add-gesture").innerText = "Add Gesture";
        document.getElementById("add-word").style.display = "block";
        gestureCard.style.marginTop = "17px";

      }
    });

    var doneTrainingBtn = document.getElementById("done_training");
    doneTrainingBtn.addEventListener('mousedown', () => {
      div.innerHTML = "";
      document.getElementById("add-word").style.display = "block";
      doneTrainingBtn.style.display = "none";
    });
  };

  intialBtn(i, btnType) {
    // Create training button
    var trainBtn = document.getElementById(btnType);
    //button.innerText = "Add Example"; //"Train " + words[i].toUpperCase()
    //div.appendChild(button);

    // Listen for mouse events when clicking the button
    trainBtn.addEventListener('mousedown', () => {
      return this.training = i;
    });
    trainBtn.addEventListener('mouseup', () => {
      return this.training = -1;
    });

    // Create clear button to remove training examples
    var clearBtn = document.getElementById('clear_' + btnType);


    clearBtn.addEventListener('mousedown', () => {
      console.log("clear training data for this label");
      this.knn.clearClass(i);
      this.infoTexts[i].innerText = " 0 examples";
      this.checkMarks[i].src = "Images\\loader.gif";
    });

    // Create info text
    var infoText = document.getElementById('counter_' + btnType);
    var checkMark = document.getElementById('checkmark_' + btnType);

    var cardArea = document.getElementById("trained_cards");
    var gestureCard = document.createElement("div");
    gestureCard.className = "trained-gestures";
    var gestName = "";
    if (btnType == "startButton") {
      gestName = "Start";
    } else {
      gestName = "Stop";
    }
    var gestureName = document.createElement("h5");
    gestureName.innerText = gestName;
    //add image
    //add accuracy
    gestureCard.appendChild(gestureName);
    cardArea.appendChild(gestureCard);

    infoText.innerText = " 0 examples";
    checkMark.src = 'Images\\loader.gif';
    this.infoTexts.push(infoText);
    this.checkMarks.push(checkMark);
    this.gestureCards.push(gestureCard);
    var div = document.getElementById("trainingDisplay");

    gestureCard.addEventListener('mousedown', () => { //inital  btn
      if (gestureCard.style.marginTop == "17px" || gestureCard.style.marginTop == "") {
        document.getElementById("add-word").style.display = "none";
        div.innerHTML = "";

        document.getElementById("add-gesture").innerText = gestName;

        var plusImage = document.getElementById("plus_sign");
        plusImage.src = "Images/retrain.svg";
        plusImage.classList.add("rotateIn");
        var doneTrainingBtn = document.getElementById("done_training");
        doneTrainingBtn.style.display = "block";
        trainBtn.className = "trainBtn";
        trainBtn.innerText = "Train";


        div.appendChild(trainBtn);
        div.appendChild(clearBtn);
        div.appendChild(infoText);
        div.appendChild(checkMark);
        gestureCard.style.marginTop = "-10px";
      } else {
        document.getElementById("add-gesture").innerText = "Add Gesture";
        document.getElementById("add-word").style.display = "block";
        gestureCard.style.marginTop = "17px";
      }
    });

    var doneTrainingBtn = document.getElementById("done_training");
    doneTrainingBtn.addEventListener('mousedown', () => {
      div.innerHTML = "";
      document.getElementById("add-word").style.display = "block";
      doneTrainingBtn.style.display = "none";
    });
  }

  startTraining() {
    if (this.timer) {
      this.stopTraining();
    }
    var promise = this.video.play();

    if (promise !== undefined) {
      promise.then(_ => {
        console.log("Autoplay started")
      }).catch(error => {
        console.log("Autoplay prevented")
      })
    }
    this.timer = requestAnimationFrame(this.train.bind(this));
  }

  stopTraining() {
    this.video.pause();
    cancelAnimationFrame(this.timer);
    console.log("Knn for start: " + this.knn.getClassExampleCount()[0]);
    this.initialKnn = this.knn;
  }

  train() {
    var btn = document.getElementById('nextButton');
    btn.addEventListener('mousedown', () => {
      const exampleCount = this.knn.getClassExampleCount()

      if (Math.max(...exampleCount) > 0) {
        // if wake word has not been trained
        if (exampleCount[0] == 0) {
          return;
        }
        // if the catchall phrase other hasnt been trained
        if (exampleCount[1] == 0) {
          return;
        }
        this.stopTraining();
      }

    });

    if (this.videoPlaying) {
      console.log(this.training);

      // Get image data from video element
      const image = dl.fromPixels(this.video);
      // Train class if one of the buttons is held down
      if (this.training != -1) {
        // Add current image to classifier
        this.knn.addImage(image, this.training);
      }

      const exampleCount = this.knn.getClassExampleCount()

      if (Math.max(...exampleCount) > 0) {
        for (var i = 0; i < words.length; i++) {
          if (exampleCount[i] > 0) {
            this.infoTexts[i].innerText = ' ' + exampleCount[i] + ' examples';
            if (exampleCount[i] == 3 && this.gestureCards[i].childNodes[1] == null) {
              //this.gestureCards[i].removeChild(this.gestureCards[i].childNodes[0]);   
              var gestureImg = document.createElement("canvas");
              gestureImg.className = "trained_image";
              gestureImg.getContext('2d').drawImage(video, 0, 0, 400, 180);

              this.gestureCards[i].appendChild(gestureImg);
            }
            if (exampleCount[i] == 30) {
              this.checkMarks[i].src = "Images//checkmark.svg";
              this.checkMarks[i].classList.add("animated");
              this.checkMarks[i].classList.add("rotateIn");

            }
          }
        }
      }
    }
    this.timer = requestAnimationFrame(this.train.bind(this));

  }

  startPredicting() {
    // stop training
    if (this.timer) {
      this.stopTraining();
    }

    this.setStatusText("Status: Ready to Predict!");

    this.video.play();

    this.pred = requestAnimationFrame(this.predict.bind(this));
  }

  pausePredicting() {
    console.log("pause predicting");
    this.setStatusText("Status: Paused Predicting");
    cancelAnimationFrame(this.pred);
  }

  predict() {
    this.now = Date.now();
    this.elapsed = this.now - this.then;

    if (this.elapsed > this.fpsInterval) {

      this.then = this.now - this.elapsed % this.fpsInterval;

      if (this.videoPlaying) {
        const exampleCount = this.knn.getClassExampleCount();

        const image = dl.fromPixels(this.video);

        if (Math.max(...exampleCount) > 0) {
          this.knn.predictClass(image)
            .then((res) => {
              for (let i = 0; i < words.length; i++) {

                // if matches & is above threshold & isnt same as prev prediction
                // and is not the last class which is a catch all class


                if (res.classIndex == i && res.confidences[i] > predictionThreshold && res.classIndex != this.previousPrediction) { //  && res.classIndex != 1) {

                  this.tts.speak(words[i]);
                  console.log("word: " + words[i]);

                  // set previous prediction so it doesnt get called again
                  this.previousPrediction = res.classIndex;
                }
              }
            }).then(() => image.dispose())
        } else {
          image.dispose();
        }
      }
    }

    this.pred = requestAnimationFrame(this.predict.bind(this));
  }

  setStatusText(status) {
    document.getElementById("status").style.display = "block";
    this.statusText.innerText = status;
  }
}

class TextToSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.pitch = 1.0;
    this.rate = 0.9;

    this.textLine = document.getElementById("text");
    //this.ansText = document.getElementById("answerText");
    //this.loader = document.getElementById("loader");

    this.translationContainer = document.getElementById("translationContainer");
    this.translationText = document.getElementById("translationText");

    this.selectedVoice = 48; // this is Google-US en. Can set voice and language of choice

    this.currentPredictedWords = [];
    this.waitTimeForQuery = 10000;

    this.synth.onvoiceschanged = () => {
      this.populateVoiceList()
    };

  }

  populateVoiceList() {
    if (typeof speechSynthesis === 'undefined') {
      console.log("no synth");
      return;
    }
    this.voices = this.synth.getVoices();

    if (this.voices.indexOf(this.selectedVoice) > 0) {
      console.log(this.voices[this.selectedVoice].name + ':' + this.voices[this.selectedVoice].lang);
    } else {
      //alert("Selected voice for speech did not load or does not exist.\nCheck Internet Connection")
    }
  }

  clearPara(queryDetected) {
    this.translationText.innerText = '';
    //this.ansText.innerText = '';
    if (queryDetected) {
      //this.loader.style.display = "block";
    } else {
      //this.loader.style.display = "none";
      //this.ansText.innerText = "No query detected";
      main.previousPrediction = -1;
    }
    this.currentPredictedWords = [];
  }

  speak(word) {
    var _this10 = this;

    if (word == 'start') {
      console.log("clear para");
      this.clearPara(true);

      setTimeout(() => {
        // if no query detected after start is signed
        if (_this10.currentPredictedWords.length == 1) {
          _this10.clearPara(false);
        }
      }, this.waitTimeForQuery);
    }

    if (word != 'start' && this.currentPredictedWords.length == 0) {
      console.log("first word should be start");
      console.log(word);
      return;
    }

    if (this.currentPredictedWords.includes(word)) {
      // prevent word from being detected repeatedly in phrase
      console.log("word already been detected in current phrase");
      return;
    }

    this.currentPredictedWords.push(word);

    if (word == "start") {
      this.translationText.innerText += ' ';
    } else if (endWords.includes(word)) {
      this.translationText.innerText += '.';
    } else {
      this.translationText.innerText += ' ' + word;
    }

    /* Might use Text to Speech in the future
    var utterThis = new SpeechSynthesisUtterance(word);

    utterThis.onend = function (evt) {
        if (endWords.includes(word)) {
            //if last word is one of end words start listening for transcribing
            console.log("this was the last word");
            main.setStatusText("Status: Waiting for Response");
            //var stt = new SpeechToText();
        }
    };

    utterThis.onerror = function (evt) {
        console.log("Error speaking");
    };

    utterThis.voice = this.voices[this.selectedVoice];

    utterThis.pitch = this.pitch;
    utterThis.rate = this.rate;

    this.synth.speak(utterThis);*/
  }

}


var main = null;

window.addEventListener('load', () => {

  var ua = navigator.userAgent.toLowerCase()

  if (!(ua.indexOf("chrome") != -1 || ua.indexOf("firefox") != -1)) {
    alert("Please visit in the latest Chrome or Firefox")
    return
  }


  main = new Main()

});