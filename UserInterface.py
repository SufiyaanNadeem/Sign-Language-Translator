import cv2 
import numpy as np
from win32api import GetSystemMetrics
from PIL import ImageFont, ImageDraw, Image  
import screeninfo
#from Tkinter import *


class UserInterface(object):
    titleFont=ImageFont.truetype("Fonts/regular_font.TTF",50)
    titleColour="#000000"
    captionFont=ImageFont.truetype("Fonts/italic_font.TTF",30)
    captionColour="#4d4d4d"
    backColour=(255,255,255)
    width=0
    height=0
    mat=0
    welcomeComplete=False
    videoPanel=None
    welcomeText="Welcome to ASL Translator"
    welcomeCaption="Sufiyaan Nadeem"
    welcomeCounter=0
    centerX=0
    centerY=0
    loadCounter=0

    def __init__(self,videoPanel):
        self.width=videoPanel.width
        self.height=videoPanel.height
        self.centerX=int(self.width/2)
        self.centerY=int(self.height/2)
        self.mat=videoPanel.mat
        self.videoPanel=videoPanel
    def callback():
        print("click!")

    #Make more efficient
    def welcomeUI(self):
        if self.loadCounter<len(self.welcomeText)+10:
            if self.welcomeCounter<len(self.welcomeText):
                self.welcomeCounter+=1
            self.loadCounter+=1
            # b = Button(master, text="OK", command=self.callback)
            # b.pack()
            self.mat=self.videoPanel.mat
            cv2.rectangle(self.mat,(0,0),(self.width,self.height), self.backColour, -1)
            forPIL=Image.fromarray(self.mat)
            draw=ImageDraw.Draw(forPIL)
            draw.text((self.centerX-12*self.welcomeCounter, self.centerY-100), self.welcomeText[0:self.welcomeCounter], font=self.titleFont,fill=self.titleColour)
            draw.text((self.centerX-115, self.centerY+20-2*self.welcomeCounter), self.welcomeCaption, font=self.captionFont,fill=self.captionColour)
            self.mat=cv2.cvtColor(np.array(forPIL), cv2.COLOR_RGB2BGR)
            cv2.rectangle(self.mat,(self.centerX-116,self.centerY+11),(self.centerX+114,self.centerY+60),self.backColour, -1)
            self.videoPanel.mat=self.mat
        else:
            UserInterface.welcomeComplete=True