from VideoPanel import VideoPanel
import cv2 
from PIL import ImageFont, ImageDraw, Image  
import numpy as np

def overlayWelcomeUI(mat,welcomeCharacterCount):
    #cv2.rectangle(mat,(0,0),(10,10),(0,255,0),3)
    #cv2.fillConvexPoly(mat, points, color[, lineType[, shift]])
    font=ImageFont.truetype("Fonts/bold_font.TTF",80)
    cv2.rectangle(mat,(0,0),(1400,800), (0,0,0), -1)
    forPIL=Image.fromarray(mat)
    draw=ImageDraw.Draw(forPIL)
    draw.text((0, 0), "Hello", font=font)
    mat=cv2.cvtColor(np.array(forPIL), cv2.COLOR_RGB2BGR)  

if __name__ == '__main__': 
    videoPanel=VideoPanel()

    #welcomeTime=30
    welcomeText="Welcome to ASL Translator"
    welcomeCharacterCount=0
    
    while(True):
        videoPanel.captureVid()
        
        
        if welcomeCharacterCount<len(welcomeText)+10:
            welcomeCharacterCount+=1
            overlayWelcomeUI(videoPanel.mat,welcomeCharacterCount)
        
        videoPanel.showVid()
        #Exit on Q press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    