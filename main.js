/* 
Main.js manages the training, classification, and output of sign language gestures. 

- The Main class is responsible for altering page elements on the user interface such as buttons,
video elements, etc. It is also handles the training, prediction, and video call features.
- The PredictionOutput class converts the predicted text passed by Main into text, image, and audio
output. This class is also responsible for turning a caller's words into speech in video call mode.

Credits:
The kNN Classifier used for this project was created by Google TensorFlow. 
The kNN classifier requires the computation of random numbers that is not readily available on JavaScript.
To accomplish this, the work of Johannes Baagøe on "implementations of Randomness in Javascript" was used.
Additionally, usage of TensorFlow was learned from Abishek Singh's "alexa-sign-language-translator".

Author: Sufiyaan Nadeem
*/

// Importing the k-Nearest Neighbors Algorithm
import {
  KNNImageClassifier
} from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';

// Webcam Image size. Must be 227.
const IMAGE_SIZE = 227;
// K value for KNN. 10 means that we will take votes from 10 data points to classify each tensor.
const TOPK = 10;
// Percent confidence above which prediction needs to be to return a prediction.
const confidenceThreshold = 0.98

// Initial Gestures that need to be trained.
// The start gesture is for signalling when to start prediction
// The stop gesture is for signalling when to stop prediction
var words = ["start", "stop"];

/*
The Main class is responsible for the training and prediction of words.
It controls the webcam, user interface, as well as initiates the output of predicted words.
*/
class Main {
  constructor() {
    // Initialize variables for display as well as prediction purposes
    this.exampleCountDisplay = [];
    this.checkMarks = [];
    this.gestureCards = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;
    this.previousPrediction = -1;
    this.currentPredictedWords = [];

    // Variables to restrict prediction rate
    this.now;
    this.then = Date.now();
    this.startTime = this.then;
    this.fps = 5; //framerate - number of prediction per second
    this.fpsInterval = 1000 / this.fps;
    this.elapsed = 0;

    // Initalizing kNN model to none.
    this.knn = null;
    /* Initalizing previous kNN model that we trained when training of the current model
    is stopped or prediction has begun. */
    this.previousKnn = this.knn;

    // Storing all elements that from the User Interface that need to be altered into variables.
    this.welcomeContainer = document.getElementById("welcomeContainer");
    this.proceedBtn = document.getElementById("proceedButton");
    this.proceedBtn.style.display = "block";
    this.proceedBtn.classList.add("animated");
    this.proceedBtn.classList.add("flash");
    this.proceedBtn.addEventListener('click', () => {
      this.welcomeContainer.classList.add("slideOutUp");
    })

    this.stageTitle = document.getElementById("stage");
    this.stageInstruction = document.getElementById("steps");
    this.predButton = document.getElementById("predictButton");
    this.backToTrainButton = document.getElementById("backButton");
    this.nextButton = document.getElementById('nextButton');

    this.statusContainer = document.getElementById("status");
    this.statusText = document.getElementById("status-text");

    this.translationHolder = document.getElementById("translationHolder");
    this.translationText = document.getElementById("translationText");
    this.translatedCard = document.getElementById("translatedCard");

    this.initialTrainingHolder = document.getElementById('initialTrainingHolder');

    this.videoContainer = document.getElementById("videoHolder");
    this.video = document.getElementById("video");

    this.trainingContainer = document.getElementById("trainingHolder");
    this.addGestureTitle = document.getElementById("add-gesture");
    this.plusImage = document.getElementById("plus_sign");
    this.addWordForm = document.getElementById("add-word");
    this.newWordInput = document.getElementById("new-word");
    this.doneRetrain = document.getElementById("doneRetrain");
    this.trainingCommands = document.getElementById("trainingCommands");

    this.videoCallBtn = document.getElementById("videoCallBtn");
    this.videoCall = document.getElementById("videoCall");

    this.trainedCardsHolder = document.getElementById("trainedCardsHolder");

    // Start Translator function is called
    this.initializeTranslator();

    // Instantiate Prediction Output
    this.predictionOutput = new PredictionOutput();
  }

  /*This function starts the webcam and initial training process. It also loads the kNN
  classifier*/
  initializeTranslator() {
    this.startWebcam();
    this.initialTraining();
    this.loadKNN();
  }

  //This function sets up the webcam
  startWebcam() {
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

  /*This function initializes the training for Start and Stop Gestures. It also 
  sets a click listener for the next button.*/
  initialTraining() {
    // if next button on initial training page is pressed, setup the custom gesture training UI.
    this.nextButton.addEventListener('click', () => {
      const exampleCount = this.knn.getClassExampleCount();
      if (Math.max(...exampleCount) > 0) {
        // if start gesture has not been trained
        if (exampleCount[0] == 0) {
          alert('You haven\'t added examples for the Start Gesture');
          return;
        }

        // if stop gesture has not been trained
        if (exampleCount[1] == 0) {
          alert('You haven\'t added examples for the Stop Gesture.\n\nCapture yourself in idle states e.g hands by your side, empty background etc.');
          return;
        }

        this.nextButton.style.display = "none";
        this.stageTitle.innerText = "Continue Training";
        this.stageInstruction.innerText = "Add Gesture Name and Train.";

        //Start custom gesture training process
        this.setupTrainingUI();
      }
    });

    //Create initial training buttons
    this.initialGestures(0, "startButton");
    this.initialGestures(1, "stopButton");
  }

  //This function loads the kNN classifier
  loadKNN() {
    this.knn = new KNNImageClassifier(words.length, TOPK);

    // Load knn model
    this.knn.load().then(() => this.initializeTraining());
  }

  /*This creates the training and clear buttons for the initial Start and Stop gesture. 
  It also creates the Gesture Card.*/
  initialGestures(i, btnType) {
    // Get specified training button
    var trainBtn = document.getElementById(btnType);

    // Call training function for this gesture on click
    trainBtn.addEventListener('click', () => {
      this.train(i);
    });

    // Clear button to remove training examples on click
    var clearBtn = document.getElementById('clear_' + btnType);
    clearBtn.addEventListener('click', () => {
      this.knn.clearClass(i);
      this.exampleCountDisplay[i].innerText = " 0 examples";
      this.gestureCards[i].removeChild(this.gestureCards[i].childNodes[1]);
      this.checkMarks[i].src = "Images\\loader.gif";
    });

    // Variables for training information for the user
    var exampleCountDisplay = document.getElementById('counter_' + btnType);
    var checkMark = document.getElementById('checkmark_' + btnType);

    // Create Gesture Card
    var gestureCard = document.createElement("div");
    gestureCard.className = "trained-gestures";

    var gestName = "";
    if (i == 0) {
      gestName = "Start";
    } else {
      gestName = "Stop";
    }
    var gestureName = document.createElement("h5");
    gestureName.innerText = gestName;
    gestureCard.appendChild(gestureName);
    this.trainedCardsHolder.appendChild(gestureCard);

    exampleCountDisplay.innerText = " 0 examples";
    checkMark.src = 'Images\\loader.gif';
    this.exampleCountDisplay.push(exampleCountDisplay);
    this.checkMarks.push(checkMark);
    this.gestureCards.push(gestureCard);
  }

  /*This function sets up the custom gesture training UI.*/
  setupTrainingUI() {
    const exampleCount = this.knn.getClassExampleCount();
    // check if training is complete
    if (Math.max(...exampleCount) > 0) {
      // if start gesture has not been trained
      if (exampleCount[0] == 0) {
        alert('You haven\'t added examples for the wake word');
        return;
      }

      // if stop gesture has not been trained
      if (exampleCount[1] == 0) {
        alert('You haven\'t added examples for the Stop Gesture.\n\nCapture yourself in idle states e.g hands by your side, empty background etc.');
        return;
      }

      // Remove Initial Training Screen
      this.initialTrainingHolder.style.display = "none";

      // Add the Custom Gesture Training UI
      this.trainingContainer.style.display = "block";
      this.trainedCardsHolder.style.display = "block";

      // Add Gesture on Submission of new gesture form
      this.addWordForm.addEventListener('submit', (e) => {
        this.trainingCommands.innerHTML = "";

        e.preventDefault(); // preventing default submission action
        var word = this.newWordInput.value.trim(); // returns new word without whitespace

        // if a new word is entered, add it to the gesture classes and start training
        if (word && !words.includes(word)) {
          //Add word to words array
          words.push(word);

          // Create train and clear buttons for new gesture and set reset form
          this.createTrainingBtns(words.indexOf(word));
          this.newWordInput.value = '';

          // Increase the amount of classes and array length in the kNN model
          this.knn.numClasses += 1;
          this.knn.classLogitsMatrices.push(null);
          this.knn.classExampleCount.push(0);

          // Start training the word and create the translate button
          this.initializeTraining();
          this.createTranslateBtn();
        } else {
          alert("Duplicate word or no word entered");
        }
        return;
      });
    } else {
      alert('You haven\'t added any examples yet.\n\nAdd a Gesture, then perform the sign in front of the webcam.');
    }
  }

  /*This creates the training and clear buttons for the new gesture. It also creates the 
    Gesture Card.*/
  createTrainingBtns(i) { //i is the index of the new word
    // Create Train and Clear Buttons
    var trainBtn = document.createElement('button');
    trainBtn.className = "trainBtn";
    trainBtn.innerText = "Train";
    this.trainingCommands.appendChild(trainBtn);

    var clearBtn = document.createElement('button');
    clearBtn.className = "clearButton";
    clearBtn.innerText = "Clear";
    this.trainingCommands.appendChild(clearBtn);

    // Change training class from none to specified class if training button is pressed
    trainBtn.addEventListener('mousedown', () => {
      this.train(i);
    });

    // Create clear button to remove training examples on click
    clearBtn.addEventListener('click', () => {
      this.knn.clearClass(i);
      this.exampleCountDisplay[i].innerText = " 0 examples";
      this.gestureCards[i].removeChild(this.gestureCards[i].childNodes[1]);
      this.checkMarks[i].src = 'Images\\loader.gif';
    });

    // Create elements to display training information for the user
    var exampleCountDisplay = document.createElement('h3');
    exampleCountDisplay.style.color = "black";
    this.trainingCommands.appendChild(exampleCountDisplay);

    var checkMark = document.createElement('img');
    checkMark.className = "checkMark";
    this.trainingCommands.appendChild(checkMark);

    //Create Gesture Card
    var gestureCard = document.createElement("div");
    gestureCard.className = "trained-gestures";

    var gestName = words[i];
    var gestureName = document.createElement("h5");
    gestureName.innerText = gestName;
    gestureCard.appendChild(gestureName);
    this.trainedCardsHolder.appendChild(gestureCard);

    exampleCountDisplay.innerText = " 0 examples";
    checkMark.src = 'Images\\loader.gif';
    this.exampleCountDisplay.push(exampleCountDisplay);
    this.checkMarks.push(checkMark);
    this.gestureCards.push(gestureCard);

    // Retrain/Continue Training gesture on click of the gesture card
    gestureCard.addEventListener('click', () => { //create btn
      /* If gesture card was not already pressed display the specific gesture card's
      training buttons to train it*/
      if (gestureCard.style.marginTop == "17px" || gestureCard.style.marginTop == "") {
        this.addWordForm.style.display = "none";
        this.addGestureTitle.innerText = gestName;
        this.plusImage.src = "Images/retrain.svg";
        this.plusImage.classList.add("rotateIn");

        // Display done retraining button and the training buttons for the specific gesture
        this.doneRetrain.style.display = "block";
        this.trainingCommands.innerHTML = "";
        this.trainingCommands.appendChild(trainBtn);
        this.trainingCommands.appendChild(clearBtn);
        this.trainingCommands.appendChild(exampleCountDisplay);
        this.trainingCommands.appendChild(checkMark);
        gestureCard.style.marginTop = "-10px";
      }
      // if gesture card is pressed again, change the add gesture card back to add gesture mode instead of retrain mode
      else {
        this.addGestureTitle.innerText = "Add Gesture";
        this.addWordForm.style.display = "block";
        gestureCard.style.marginTop = "17px";

        this.trainingCommands.innerHTML = "";
        this.addWordForm.style.display = "block";
        this.doneRetrain.style.display = "none";
        this.plusImage.src = "Images/plus_sign.svg";
        this.plusImage.classList.add("rotateInLeft");
      }
    });

    // if done retrain button is pressed again, change the add gesture card back to add gesture mode instead of retrain mode
    this.doneRetrain.addEventListener('click', () => {
      this.addGestureTitle.innerText = "Add Gesture";
      this.addWordForm.style.display = "block";
      gestureCard.style.marginTop = "17px";

      this.trainingCommands.innerHTML = "";
      this.addWordForm.style.display = "block";
      this.plusImage.src = "Images/plus_sign.svg";
      this.plusImage.classList.add("rotateInLeft");
      this.doneRetrain.style.display = "none";
    });
  }

  // This function starts the training process.
  initializeTraining() {
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
  }

  // This function adds examples for the gesture to the kNN model
  train(gestureIndex) {
    console.log(this.videoPlaying);
    if (this.videoPlaying) {
      console.log("entered training");
      // Get image data from video element
      const image = dl.fromPixels(this.video);

      // Add current image to classifier
      this.knn.addImage(image, gestureIndex);

      // Get example count
      const exampleCount = this.knn.getClassExampleCount()[gestureIndex];

      if (exampleCount > 0) {
        //if example count for this particular gesture is more than 0, update it
        this.exampleCountDisplay[gestureIndex].innerText = ' ' + exampleCount + ' examples';

        //if example count for this particular gesture is 1, add a capture of the gesture to gesture cards
        if (exampleCount == 1 && this.gestureCards[gestureIndex].childNodes[1] == null) {
          var gestureImg = document.createElement("canvas");
          gestureImg.className = "trained_image";
          gestureImg.getContext('2d').drawImage(video, 0, 0, 400, 180);
          this.gestureCards[gestureIndex].appendChild(gestureImg);
        }

        // if 30 examples are trained, show check mark to the user 
        if (exampleCount == 30) {
          this.checkMarks[gestureIndex].src = "Images//checkmark.svg";
          this.checkMarks[gestureIndex].classList.add("animated");
          this.checkMarks[gestureIndex].classList.add("rotateIn");
        }
      }
    }
  }

  /*This function creates the button that goes to the Translate Page. It also initializes the UI 
  of the translate page and starts or stops prediction on click.*/
  createTranslateBtn() {
    this.predButton.style.display = "block";
    this.createVideoCallBtn(); // create video call button that displays on translate page
    this.createBackToTrainBtn(); // create back to train button that will go back to training page

    this.predButton.addEventListener('click', () => {
      // Change the styling of video display and start prediction
      console.log("go to translate");
      const exampleCount = this.knn.getClassExampleCount();
      // check if training is complete
      if (Math.max(...exampleCount) > 0) {
        this.video.style.display = "inline-block"; // turn on video from webscam in case it's off

        this.videoCall.style.display = "none"; // turn off video call in case it's on
        this.videoCallBtn.style.display = "block";

        this.backToTrainButton.style.display = "block";

        // Change style of video display
        this.video.className = "videoPredict";
        this.videoContainer.style.display = "inline-block";
        this.videoContainer.style.width = "";
        this.videoContainer.style.height = "";
        this.videoContainer.className = "videoContainerPredict";
        this.videoContainer.style.border = "8px solid black";


        // Update stage and instruction info
        this.stageTitle.innerText = "Translate";
        this.stageInstruction.innerText = "Start Translating with your Start Gesture.";

        // Remove training UI
        this.trainingContainer.style.display = "none";
        this.trainedCardsHolder.style.marginTop = "130px";

        // Display translation holder that contains translated text
        this.translationHolder.style.display = "block";

        this.predButton.style.display = "none";
        // Start Translation
        this.setUpTranslation();
      } else {
        alert('You haven\'t added any examples yet.\n\nPress and hold on the "Add Example" button next to each word while performing the sign in front of the webcam.');
      }
    })
  }

  /*This function stops the training process and allows user's to copy text on the click of
  the translation text.*/
  setUpTranslation() {
    // stop training
    if (this.timer) {
      this.stopTraining();
    }

    // Set status to predict, call copy translated text listener and start prediction
    this.setStatusText("Status: Ready to Predict!", "predict");
    this.video.play();
    this.pred = requestAnimationFrame(this.predict.bind(this));
  }

  /*This function predicts the class of the gesture and returns the predicted text if its above a set threshold.*/
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
                /*if gesture matches this word & is above threshold & isn't same as prev prediction
                and is not stop gesture, return that word to the user*/
                if (res.classIndex == i && res.confidences[i] > confidenceThreshold && res.classIndex != this.previousPrediction) { //  && res.classIndex != 1) {
                  this.setStatusText("Status: Predicting!", "predict");

                  // Send word to Prediction Output so it will display or speak out the word.
                  this.predictionOutput.textOutput(words[i], this.gestureCards[i], res.confidences[i] * 100);

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

    // Recursion on predict method
    this.pred = requestAnimationFrame(this.predict.bind(this));
  }

  /*This function pauses the predict method*/
  pausePredicting() {
    console.log("pause predicting");
    this.setStatusText("Status: Paused Predicting", "predict");
    cancelAnimationFrame(this.pred);
    this.previousKnn = this.knn;
  }

  // if predict button is actually a back to training button, stop translation and recreate training UI
  createBackToTrainBtn() {
    this.backToTrainButton.addEventListener('click', () => {
      main.pausePredicting();

      this.stageTitle.innerText = "Continue Training";
      this.stageInstruction.innerText = "Add Gesture Name and Train.";

      this.predButton.innerText = "Translate";
      this.predButton.style.display = "block";
      this.backToTrainButton.style.display = "none";
      this.statusContainer.style.display = "none";

      // Remove all elements from translation mode
      this.video.className = "videoTrain";
      this.videoContainer.className = "videoContainerTrain";
      this.videoCallBtn.style.display = "none";

      this.translationHolder.style.display = "none";
      this.statusContainer.style.display = "none";

      // Show elements from training mode
      this.trainingContainer.style.display = "block";
      this.trainedCardsHolder.style.marginTop = "0px";
      this.trainedCardsHolder.style.display = "block";
    });
  }

  /*This function stops the training process*/
  stopTraining() {
    this.video.pause();
    cancelAnimationFrame(this.timer);
    console.log("Knn for start: " + this.knn.getClassExampleCount()[0]);
    this.previousKnn = this.knn; // saves current knn model so it can be used later
  }

  /*This function displays the button that start video call.*/
  createVideoCallBtn() {
    // Display video call feed instead of normal webcam feed when video call btn is clicked
    videoCallBtn.addEventListener('click', () => {
      this.stageTitle.innerText = "Video Call";
      this.stageInstruction.innerText = "Translate Gestures to talk to people on Video Call";

      this.video.style.display = "none";
      this.videoContainer.style.borderStyle = "none";
      this.videoContainer.style.overflow = "hidden";
      this.videoContainer.style.width = "630px";
      this.videoContainer.style.height = "355px";

      this.videoCall.style.display = "block";
      this.videoCallBtn.style.display = "none";
      this.backToTrainButton.style.display = "none";
      this.predButton.innerText = "Local Translation";
      this.predButton.style.display = "block";

      this.setStatusText("Status: Video Call Activated");
    })
  }
  /*This function sets the status text*/
  setStatusText(status, type) { //make default type thing
    this.statusContainer.style.display = "block";
    this.statusText.innerText = status;
    if (type == "copy") {
      console.log("copy");
      this.statusContainer.style.backgroundColor = "blue";
    } else {
      this.statusContainer.style.backgroundColor = "black";
    }
  }
}

/*
The PredictionOutput class is responsible for turning the translated gesture into text, gesture card, and speech output.
*/
class PredictionOutput {
  constructor() {
    //Initializing variables for speech synthesis and output
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.pitch = 1.0;
    this.rate = 0.9;

    this.statusContainer = document.getElementById("status");
    this.statusText = document.getElementById("status-text");

    this.translationHolder = document.getElementById("translationHolder");
    this.translationText = document.getElementById("translationText");
    this.translatedCard = document.getElementById("translatedCard");
    this.trainedCardsHolder = document.getElementById("trainedCardsHolder");

    this.selectedVoice = 48; // this is Google-US en. Can set voice and language of choice

    this.currentPredictedWords = [];
    this.waitTimeForQuery = 10000;

    this.synth.onvoiceschanged = () => {
      this.populateVoiceList()
    };

    //Set up copy translation event listener
    this.copyTranslation();
  }

  // Checks if speech synthesis is possible and if selected voice is available
  populateVoiceList() {
    if (typeof speechSynthesis === 'undefined') {
      console.log("no synth");
      return;
    }
    this.voices = this.synth.getVoices();

    if (this.voices.indexOf(this.selectedVoice) > 0) {
      console.log(this.voices[this.selectedVoice].name + ':' + this.voices[this.selectedVoice].lang);
    }
  }

  /*This function outputs the word using text and gesture cards*/
  textOutput(word, gestureCard, gestureAccuracy) {
    // If the word is start, clear translated text content
    if (word == 'start') {
      this.clearPara();

      setTimeout(() => {
        // if no query detected after start is signed, clear para
        if (this.currentPredictedWords.length == 1) {
          this.clearPara();
        }
      }, this.waitTimeForQuery);
    }

    // If first word is not start, return
    if (word != 'start' && this.currentPredictedWords.length == 0) {
      return;
    }

    // If word was already said in this query, return
    if (this.currentPredictedWords.includes(word)) {
      return;
    }

    // Add word to predicted words in this query
    this.currentPredictedWords.push(word);

    // Depending on the word, display the text output
    if (word == "start") {
      this.translationText.innerText += ' ';
    } else if (word == "stop") {
      this.translationText.innerText += '.';
    } else {
      this.translationText.innerText += ' ' + word;
    }

    //Clone Gesture Card
    this.translatedCard.innerHTML = " ";
    var clonedCard = document.createElement("div");
    clonedCard.className = "trained-gestures";

    var gestName = gestureCard.childNodes[0].innerText;
    var gestureName = document.createElement("h5");
    gestureName.innerText = gestName;
    clonedCard.appendChild(gestureName);

    var gestureImg = document.createElement("canvas");
    gestureImg.className = "trained_image";
    gestureImg.getContext('2d').drawImage(gestureCard.childNodes[1], 0, 0, 400, 180);
    clonedCard.appendChild(gestureImg);

    var gestAccuracy = document.createElement("h7");
    gestAccuracy.innerText = "Confidence: " + gestureAccuracy + "%";
    clonedCard.appendChild(gestAccuracy);

    this.translatedCard.appendChild(clonedCard);

    // If its not video call mode, speak out the user's word
    if (word != "start" && word != "stop") {
      this.speak(word);
    }
  }

  /*This functions clears translation text and cards. Sets the previous predicted words to null*/
  clearPara() {
    this.translationText.innerText = '';
    main.previousPrediction = -1;
    this.currentPredictedWords = []; // empty words in this query
    this.translatedCard.innerHTML = " ";
  }

  /*The function below is adapted from https://stackoverflow.com/questions/45071353/javascript-copy-text-string-on-click/53977796#53977796
  It copies the translated text to the user's clipboard*/
  copyTranslation() {
    this.translationHolder.addEventListener('mousedown', () => {
      main.setStatusText("Text Copied!", "copy");
      const el = document.createElement('textarea'); // Create a <textarea> element
      el.value = this.translationText.innerText; // Set its value to the string that you want copied
      el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
      el.style.position = 'absolute';
      el.style.left = '-9999px'; // Move outside the screen to make it invisible
      document.body.appendChild(el); // Append the <textarea> element to the HTML document
      const selected =
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
        ?
        document.getSelection().getRangeAt(0) // Store selection if found
        :
        false; // Mark as false to know no selection existed before
      el.select(); // Select the <textarea> content
      document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
      document.body.removeChild(el); // Remove the <textarea> element
      if (selected) { // If a selection existed before copying
        document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
      }
    });
  }

  /*This function speaks out the user's gestures. In video call mode, it speaks out the other
  user's words.*/
  speak(word) {
    var utterThis = new SpeechSynthesisUtterance(word);

    utterThis.onerror = function (evt) {
      console.log("Error speaking");
    };

    utterThis.voice = this.voices[this.selectedVoice];
    utterThis.pitch = this.pitch;
    utterThis.rate = this.rate;

    this.synth.speak(utterThis);
  }
}

var main = null;

//Initializes the main class on window load
window.addEventListener('load', () => {
  main = new Main()
});