import tkinter
import cv2
import PIL.Image, PIL.ImageTk
import time
import tkinter.font as tkFont
import numpy as np


class App:
    def __init__(self, window, window_title, video_source=0):
        self.window = window
        self.customFont=tkFont.Font(family="Product Sans",size=14)
        self.window.title(window_title)
        self.window.iconbitmap("Images\\asl_logo_2.ico")#only .ico works
        self.window.configure(background="#ffffff")
        self.video_source = video_source

        self.screenHeight=self.window.winfo_screenheight()
        self.screenWidth=self.window.winfo_screenwidth()

        

        # open video source (by default this will try to open the computer webcam)
        self.vid = MyVideoCapture(self.video_source)
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
 
 
class MyVideoCapture:
    def __init__(self, video_source=0):
        # Open the video source
        self.vid = cv2.VideoCapture(video_source)
        if not self.vid.isOpened():
            raise ValueError("Unable to open video source", video_source)

        # Get video source width and height
        self.width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
        self.height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)


    def get_frame(self):
        if self.vid.isOpened():
            ret, frame = self.vid.read()
            self.fgbg=cv2.bgsegm.createBackgroundSubtractorMOG()
            fgmask=self.fgbg.apply(frame)

            #cv2.imshow('frame',fgmask)

            


            #frame=self.backgroundSubstractMethod1.apply(frame)
            if ret:
                # Return a boolean success flag and the current frame converted to BGR
                return (ret, cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            else:
                return (ret, None)
        else:
            return (ret, None)

    # Release the video source when the object is destroyed
    def __del__(self):
        if self.vid.isOpened():
            self.vid.release()

#root = tkinter.Tk()

#root.wm_title("Hello, world")
 # Create a window and pass it to the Application object
App(tkinter.Tk(), "ASL Translator - Sufiyaan Nadeem")