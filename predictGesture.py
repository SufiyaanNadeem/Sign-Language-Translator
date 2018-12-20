"""
This file is responsible for using the trained model to predict the hand gesture from an image.
* Currently, it's not very accurate because it's trained for only 6 letters
* I will comment more thoroughly when I fully understand how it works!

Author: Sufiyaan Nadeem
Sources: 
https://www.tensorflow.org/tutorials/images/image_recognition
https://towardsdatascience.com/train-image-recognition-ai-with-5-lines-of-code-8ed0bdd8d9ba
"""
from imageai.Prediction.Custom import CustomImagePrediction
import os

execution_path = os.getcwd()

prediction = CustomImagePrediction()
prediction.setModelTypeAsResNet()
prediction.setModelPath(os.path.join(execution_path,"Machine Learning Data\models\model_ex-008_acc-0.861538.h5"))
prediction.setJsonPath(os.path.join(execution_path,"Machine Learning Data\json\model_class.json"))
prediction.loadModel(num_objects=26)

predictions, probabilities = prediction.predictImage("Test Data\gestureA.png", result_count=3)

for eachPrediction, eachProbability in zip(predictions, probabilities):
   print(eachPrediction , " : " , eachProbability)