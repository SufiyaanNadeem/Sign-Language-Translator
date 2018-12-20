"""
This class manages video filtering and display

Author: Sufiyaan Nadeem
Sources: 
https://solarianprogrammer.com/2018/04/21/python-opencv-show-video-tkinter-window/
https://docs.opencv.org/3.0-beta/modules/video/doc/motion_analysis_and_object_tracking.html?highlight=createbackgroundsubtractormog
"""
import cv2

class VideoCapture:

    """
    Sets up Video Capturing using OpenCV and defines filters that can be used in other methods

    :param video_source The Video Source number of the desired camera
    """
    def __init__(self, video_source=0):
        # Open the video source
        self.vid = cv2.VideoCapture(video_source)
        if not self.vid.isOpened():
            raise ValueError("Unable to open video source", video_source)

        # Get video source width and height
        self.width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
        self.height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)

        #Type of filter than can be applied later on
        self.fgbg=cv2.bgsegm.createBackgroundSubtractorMOG()

    """
    Reads the current frame, applies filters, and returns a frame
    that Tkinter can display in RGB. 
    * Currently also used to display filter results as I'm working towards background subtraction
    """
    def get_frame(self):
        if self.vid.isOpened():
            ret, frame = self.vid.read()
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.GaussianBlur(gray, (21, 21), 0)
            self.fgmask=self.fgbg.apply(gray)
            
            self.fgmask= cv2.cvtColor(self.fgmask, cv2.COLOR_GRAY2RGB)
            #cv2.imshow('frame',fgmask)
            cv2.imshow("frame",self.fgmask)
            #frame=self.backgroundSubstractMethod1.apply(frame)
            if ret:
                # Return a boolean success flag and the current frame converted to BGR
                return (ret, frame)#cv2.cvtColor(self.fgmask, cv2.COLOR_GRAY2GRAY))
            else:
                return (ret, None)
        else:
            return (ret, None)

    # Release the video source when the object is destroyed
    def __del__(self):
        if self.vid.isOpened():
            self.vid.release()