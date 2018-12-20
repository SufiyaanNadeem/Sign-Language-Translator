from imageai.Prediction.Custom import ModelTraining

model_trainer = ModelTraining()
model_trainer.setModelTypeAsResNet()
model_trainer.setDataDirectory("Hand Gestures")
model_trainer.trainModel(num_objects=26, num_experiments=20, enhance_data=True, batch_size=10, show_network_summary=True)