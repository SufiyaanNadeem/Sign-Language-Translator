import tkinter
import PIL.Image, PIL.ImageTk
import time
import tkinter.font as tkFont
import numpy as np
from VideoCapture import VideoCapture

class App:
    def __init__(self, window, video_source=0):
        self.window = window
        self.customFont=tkFont.Font(family="Product Sans",size=14)
        self.window.title("ASL Translator - Sufiyaan Nadeem")
        self.window.iconbitmap("Images\\asl_logo_2.ico")#only .ico works
        self.window.configure(background="#ffffff")
        self.video_source = video_source

        self.screenHeight=self.window.winfo_screenheight()
        self.screenWidth=self.window.winfo_screenwidth()

        

        # open video source (by default this will try to open the computer webcam)
        self.vid = VideoCapture(self.video_source)
        #self.windowX=self.screenWidth/2-self.vid.width/2
        #self.windowY=self.screenHeight/2-self.vid.height/2

        # Create a canvas that can fit the above video source size
        self.canvas = tkinter.Canvas(window, width = self.vid.width, height = self.vid.height)
        self.canvas.pack()

        # Button that lets the user take a snapshot
        #self.btn_snapshot=tkinter.Button(window, text="Snapshot", width=50, command=self.snapshot,font=self.customFont)
        #self.btn_snapshot.pack(anchor=tkinter.CENTER, expand=True)

        self.loadimage = tkinter.PhotoImage(file="Images\documentation.png")
        self.roundedbutton =tkinter.Button(window, image=self.loadimage,command=self.snapshot)
        self.roundedbutton["bg"] = "white"
        self.roundedbutton["border"] = "0"
        self.roundedbutton.pack(side="top")
        #self.window.geometry("%dx%d+%d+%d"%(self.screenWidth,self.screenHeight,self.windowX,self.windowY))
        self.window.geometry("%dx%d+%d+%d"%(self.screenWidth,self.screenHeight,0,0))

        # After it is called once, the update method will be automatically called every delay milliseconds
        self.delay = 15
        self.update()

        self.window.mainloop()
 
    def snapshot(self):
        # Get a frame from the video source
         ret, frame = self.vid.get_frame()
 
         if ret:
             cv2.imwrite("frame-" + time.strftime("%d-%m-%Y-%H-%M-%S") + ".jpg", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
 
    def update(self):
        # Get a frame from the video source
        ret, frame = self.vid.get_frame()

        if ret:
            self.photo = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame))
            self.canvas.create_image(0, 0, image = self.photo, anchor = tkinter.NW)

        self.window.after(self.delay, self.update)
 
 