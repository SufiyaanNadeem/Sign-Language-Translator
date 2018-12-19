from VideoPanel import VideoPanel
from UserInterface import UserInterface


from PIL import ImageFont, ImageDraw, Image  
import numpy as np
import tkinter
import cv2 
class Main:
    def __init__(self, window, window_title):
         self.window = window
         self.window.title(window_title)
         self.window.mainloop()
App(tkinter.Tk(),"ASL Translator - Sufiyaan Nadeem")
