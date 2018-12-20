"""
This file is responsible for training the AI to predict the hand gesture from an image.
It uses a data set of over 2000 images to learn how to classify English Letters
* I will comment more thoroughly when I fully understand how it works!

Author: Sufiyaan Nadeem
Sources: 
https://www.tensorflow.org/tutorials/images/image_recognition
https://towardsdatascience.com/train-image-recognition-ai-with-5-lines-of-code-8ed0bdd8d9ba
"""
from imageai.Prediction.Custom import ModelTraining

model_trainer = ModelTraining()
model_trainer.setModelTypeAsResNet()
model_trainer.setDataDirectory("Machine Learning Data")
model_trainer.trainModel(num_objects=26, num_experiments=20, enhance_data=True, batch_size=10, show_network_summary=True)