from VideoPanel import VideoPanel
from UserInterface import UserInterface

import cv2 
from PIL import ImageFont, ImageDraw, Image  
import numpy as np
from tkinter import *



if __name__ == '__main__': 
    videoPanel=VideoPanel()
    userInterface=UserInterface(videoPanel)
    #welcomeTime=30
    welcomeText="Welcome to ASL Translator"
    welcomeCharacterCount=0
    
    while(True):
        
        videoPanel.captureVid()
        
        if(userInterface.welcomeComplete==False):
            userInterface.welcomeUI()

        print(userInterface.exitProgram)
        #Exit on Q press
        if (cv2.waitKey(1) & 0xFF == ord('q')) | userInterface.exitProgram:
            #print("should close")
            break
        
        videoPanel.showVid()
        