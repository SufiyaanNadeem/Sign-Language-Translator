from VideoPanel import VideoPanel
from UserInterface import UserInterface

import cv2 
from PIL import ImageFont, ImageDraw, Image  
import numpy as np

def overlayWelcomeUI(videoPanel,welcomeCharacterCount):
    #cv2.rectangle(mat,(0,0),(10,10),(0,255,0),3)
    #cv2.fillConvexPoly(mat, points, color[, lineType[, shift]])
    font=ImageFont.truetype("Fonts/bold_font.TTF",80)
    cv2.rectangle(videoPanel.mat,(0,0),(1400,800), (0,0,0), -1)
    forPIL=Image.fromarray(videoPanel.mat)
    draw=ImageDraw.Draw(forPIL)
    draw.text((0, 0), "Hello", font=font)
    videoPanel.mat=cv2.cvtColor(np.array(forPIL), cv2.COLOR_RGB2BGR)


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
        
        videoPanel.showVid()
        #Exit on Q press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    