from imageai.Prediction.Custom import CustomImagePrediction
import os

execution_path = os.getcwd()

prediction = CustomImagePrediction()
prediction.setModelTypeAsResNet()
prediction.setModelPath(os.path.join(execution_path,"Hand Gestures\models\model_ex-008_acc-0.861538.h5"))
#print(os.path.join(execution_path,"model_ex-009_acc-0.853846.h5"))
prediction.setJsonPath(os.path.join(execution_path,"Hand Gestures\json\model_class.json"))
prediction.loadModel(num_objects=26)

predictions, probabilities = prediction.predictImage("letterD.png", result_count=3)

for eachPrediction, eachProbability in zip(predictions, probabilities):
   print(eachPrediction , " : " , eachProbability)