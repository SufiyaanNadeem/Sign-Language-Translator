import * as tf from '@tensorflow/tfjs';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

// Create the classifier.
const classifier = knnClassifier.create();

// Load mobilenet.
const mobilenet = await mobilenetModule.load();

// Add MobileNet activations to the model repeatedly for all classes.
const img0 = tf.fromPixels(document.getElementById('class0'));
const logits0 = mobilenet.infer(img0, 'conv_preds');
classifier.addExample(logits0, 0);

const img1 = tf.fromPixels(document.getElementById('class1'));
const logits1 = mobilenet.infer(img1, 'conv_preds');
classifier.addExample(logits1, 1);

// Make a prediction.
const x = tf.fromPixels(document.getElementById('test'));
const xlogits = mobilenet.infer(x, 'conv_preds');
console.log('Predictions:');
console.log(classifier.predictClass(xlogits));