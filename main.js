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

import {
  KNNImageClassifier
} from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';


// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;

const predictionThreshold = 0.98

var words = ["start", "stop"]

// words from above array which act as terminal words in a sentence
var endWords = ["stop"]

class LaunchModal {
  constructor() {
    this.modalWindow = document.getElementById('launchModal')

    this.closeBtn = document.getElementById('close-modal')

    this.closeBtn.addEventListener('click', (e) => {
      this.modalWindow.style.display = "none"
    })

    window.addEventListener('click', (e) => {
      if (e.target == this.modalWindow) {
        this.modalWindow.style.display = "none"
      }
    })

    this.modalWindow.style.display = "block"
    this.modalWindow.style.zIndex = 500
  }
}

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

    this.knn = null;
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

    this.proceedBtn.addEventListener('mousedown', function () {
      this.welcomeContainer.classList.add("slideOutUp");
    });

    this.video.addEventListener('mousedown', function () {
      // click on video to pause predicting
      main.pausePredicting();
    });

    document.getElementById("status").style.display = "none";

    this.createTrainingBtn();

    // load text to speech
    //this.tts = new TextToSpeech();
  }

  createPredictBtn() {
    var predButton = document.getElementById("predictButton");
    predButton.style.display = "block";

    predButton.addEventListener('mousedown', function () {
      var exampleCount = this.knn.getClassExampleCount();

      // check if training has been done
      if (Math.max.apply(Math, _toConsumableArray(exampleCount)) > 0) {

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

        this.stageTitle.innerText = "Translate";
        this.textLine.innerText = "Start Translating with your Start Gesture.";


        var trainingContainer = document.getElementById("train-new");
        trainingContainer.style.display = "none";
        var trainedCards = document.getElementById("trained_cards");
        trainedCards.style.display = "none";

        this.translationContainer.style.display = "block";


        var videoContainer = document.getElementById("videoHolder");
        videoContainer.style.width = "650px";
        videoContainer.style.height = "385px";
        videoContainer.style.marginTop = "-35px";


        var video = document.getElementById("video");
        video.style.width = "500px";
        video.style.height = "375px";

        console.log("sign your query");


        this.startPredicting();
      } else {
        alert('You haven\'t added any examples yet.\n\nPress and hold on the "Add Example" button next to each word while performing the sign in front of the webcam.');
      }

    });
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
    }).then(function (stream) {
      this.video.srcObject = stream;
      this.video.width = IMAGE_SIZE;
      this.video.height = IMAGE_SIZE;

      this.video.addEventListener('playing', function () {
        return this.videoPlaying = true;
      });
      this.video.addEventListener('paused', function () {
        return this.videoPlaying = false;
      });
    });
  }

  loadKNN() {
    this.knn = new _deeplearnKnnImageClassifier.KNNImageClassifier(words.length, TOPK);

    // Load knn model
    this.knn.load().then(function () {
      return this.startTraining();
    });
  }
  createButtonList(showBtn) {
    // Create clear button to remove training examples

    var btn = document.getElementById('nextButton');
    btn.addEventListener('mousedown', function () {
      var exampleCount = this.knn.getClassExampleCount();
      if (Math.max.apply(Math, _toConsumableArray(exampleCount)) >= 0) {

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
    console.log("next step");

    var exampleCount = this.knn.getClassExampleCount();

    // check if training has been done
    if (Math.max.apply(Math, _toConsumableArray(exampleCount)) > 0) {

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
      this.addWordForm.addEventListener('submit', function (e) {
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
    trainBtn.addEventListener('mousedown', function () {
      return this.training = i;
    });
    trainBtn.addEventListener('mouseup', function () {
      return this.training = -1;
    });


    clearBtn.addEventListener('mousedown', function () {
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
  }

  intialBtn(i, btnType) {
    // Create training button
    var button = document.getElementById(btnType);

    // Listen for mouse events when clicking the button
    button.addEventListener('mousedown', function () {
      return this.training = i;
    });
    button.addEventListener('mouseup', function () {
      return this.training = -1;
    });

    // Create clear button to remove training examples
    var btn = document.getElementById('clear_' + btnType);


    btn.addEventListener('mousedown', function () {
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
      gestName = "Start Button";
    } else {
      gestName = "Stop Button";
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
  }

  startTraining() {
    if (this.timer) {
      this.stopTraining();
    }
    var promise = this.video.play();

    if (promise !== undefined) {
      promise.then(function (_) {
        console.log("Autoplay started");
      }).catch(function (error) {
        console.log("Autoplay prevented");
      });
    }

    //Below is what calls the train
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
    btn.addEventListener('mousedown', function () {
      var exampleCount = this.knn.getClassExampleCount();
      if (Math.max.apply(Math, _toConsumableArray(exampleCount)) > 0) {
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
      var image = dl.fromPixels(this.video);
      // Train class if one of the buttons is held down
      if (this.training != -1) {
        // Add current image to classifier
        this.knn.addImage(image, this.training);
      }

      var exampleCount = this.knn.getClassExampleCount();
      console.log("Start examples: " + exampleCount[0]);
      if (Math.max.apply(Math, _toConsumableArray(exampleCount)) > 0) {
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
        var exampleCount = this.knn.getClassExampleCount();

        var image = dl.fromPixels(this.video);

        if (Math.max.apply(Math, _toConsumableArray(exampleCount)) > 0) {
          this.knn.predictClass(image).then(function (res) {
            for (var i = 0; i < words.length; i++) {
              console.log(words[i] + " confidence: " + res.confidences[i]);
              // if matches & is above threshold & isnt same as prev prediction
              // and is not the last class which is a catch all class
              if (res.classIndex == i && res.confidences[i] > predictionThreshold && res.classIndex != this.previousPrediction) { //  && res.classIndex != 1) {

                this.tts.speak(words[i]);
                console.log("word: " + words[i]);

                // set previous prediction so it doesnt get called again
                this.previousPrediction = res.classIndex;
              }
            }
          }).then(function () {
            return image.dispose();
          });
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

var main = null;

window.addEventListener('load', () => {

  var ua = navigator.userAgent.toLowerCase()

  if (!(ua.indexOf("chrome") != -1 || ua.indexOf("firefox") != -1)) {
    alert("Please visit in the latest Chrome or Firefox")
    return
  }

  main = new Main()
});