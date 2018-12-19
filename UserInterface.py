import cv2 
import numpy as np
from win32api import GetSystemMetrics
#from tkinter import *

from PIL import ImageFont, ImageDraw, Image, ImageTk 
import screeninfo
from utils import image_resize
import webbrowser

class UserInterface(object):
    titleFont=ImageFont.truetype("Fonts/regular_font.TTF",50)
    titleColour="#000000"
    captionFont=ImageFont.truetype("Fonts/italic_font.TTF",30)
    captionColour="#4d4d4d"
    backColour=(111,255,255)
    width=0
    height=0
    mat=0
    welcomeComplete=False
    exitProgram=False
    videoPanel=None
    welcomeText="Welcome to ASL Translator"
    welcomeCaption="Sufiyaan Nadeem"
    welcomeCounter=0
    centerX=0
    centerY=0
    loadCounter=0

    documentationLink="http://sufiyaan.ca/"
    documentationPicture=cv2.imread("Images/documentation.png",-1)
    documentationButton=image_resize(documentationPicture,height=50 )
    #documentationButton=cv2.cvtColor(documentationButton,cv2.COLOR_BGR2GRAY)#cv2.COLOR_BGR2BGRA)
    #documentationButton=cv2.cvtColor(documentationButton,cv2.COLOR_GRAY2BGRA)#cv2.COLOR_BGR2BGRA)

    def __init__(self,videoPanel):
        self.width=videoPanel.width
        self.height=videoPanel.height
        self.centerX=int(self.width/2)
        self.centerY=int(self.height/2)
        self.mat=videoPanel.mat
        self.videoPanel=videoPanel

    def openDocumentation(self):
        webbrowser.open(self.documentationLink)

    #Make more efficient
    def welcomeUI(self):
        #Open Documentation on D press
        if cv2.waitKey(1) & 0xFF == ord('d'):
            self.openDocumentation()

        if cv2.waitKey(1) & 0xFF ==ord('q'):
            print("should close")
            self.exitProgram=True

        if self.loadCounter<len(self.welcomeText)+40:
            self.mat=self.videoPanel.mat
            
            if self.welcomeCounter<len(self.welcomeText):
                self.welcomeCounter+=1
            self.loadCounter+=1

            cv2.rectangle(self.mat,(0,0),(self.width,self.height), self.backColour, -1)
            forPIL=Image.fromarray(self.mat)
            # if the panels are None, initialize them
            draw=ImageDraw.Draw(forPIL)
            draw.text((self.centerX-12*self.welcomeCounter, self.centerY-100), self.welcomeText[0:self.welcomeCounter], font=self.titleFont,fill=self.titleColour)
            
            #draw.text((self.centerX-115, self.centerY+20-2*self.welcomeCounter), self.welcomeCaption, font=self.captionFont,fill=self.captionColour)
            if self.loadCounter>=len(self.welcomeText):
                draw.text((self.centerX-115, self.centerY-30), self.welcomeCaption, font=self.captionFont,fill=self.captionColour)

            self.mat=cv2.cvtColor(np.array(forPIL), cv2.COLOR_RGB2BGR)
            
          
            #self.mat.addimage(documentationButton)
            #cv2.rectangle(self.mat,(self.centerX-116,self.centerY+11),(self.centerX+114,self.centerY+60),self.backColour, -1)
            
            #Overlay Button Frame Set up
            self.mat=cv2.cvtColor(self.mat,cv2.COLOR_BGR2BGRA)
            frame_h,frame_w,frame_c=self.mat.shape
            overlay=np.zeros((frame_h,frame_w,4),dtype='uint8')
            #overlay[start_y:end_y,start_x:end_x]=(b,g,r,a)
            overlay[100:250,100:125]=(122,0,0,1)
            
            documentationButtonHeight,documentationButtonWidth,documentationButtonC=self.documentationButton.shape

            for i in range(0,documentationButtonHeight):
                for j in range(0,documentationButtonWidth):
                    if self.documentationButton[i,j][3]!=0:
                        #self.documentationButton[i,j] #RGBA
                        padding=40
                        h_offset=frame_h-documentationButtonHeight-padding
                        w_offset=self.centerX-int(documentationButtonWidth/2)

                        overlay[h_offset+i,w_offset+j]=self.documentationButton[i,j]
            #Overlay Button
            #cv2.imshow('Documentation',overlay)
            
            #cv.AddWeighted(src1, alpha, src2, beta, gamma, dst) 
            cv2.addWeighted(overlay,1,self.mat,1,0,self.mat)
            #cv2.add(overlay,self.mat)

            
            
            self.mat=cv2.cvtColor(self.mat,cv2.COLOR_BGRA2BGR)
            self.videoPanel.mat=self.mat
        else:
            self.welcomeComplete=True
        

            
    
