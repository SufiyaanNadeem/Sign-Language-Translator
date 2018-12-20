"""
This class is used to test with various OpenCV filters to subtract the background from each video frame

Author: Sufiyaan Nadeem
"""
import cv2

class BackgroundSubtract:
    #Loading different filters to test with
    backsubMOG1=cv2.bgsegm.createBackgroundSubtractorMOG()

    def subtractBack(self,frame):
        #gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        #gray = cv2.GaussianBlur(gray, (21, 21), 0)
        backSubtracted=self.backsubMOG1.apply(frame)
        #self.fgmask= cv2.cvtColor(self.fgmask, cv2.COLOR_GRAY2RGB)
        #cv2.imshow('frame',fgmask)
        cv2.imshow("Background Subtract",backSubtracted)
        return backSubtracted

    def gaussianBlur(self,frame):
        gaussianBlurred = cv2.GaussianBlur(frame, (21, 21), 0)
        #self.fgmask=self.backsubMOG1.apply(frame)
        cv2.imshow("Gaussian Blur",gaussianBlurred)
        return gaussianBlurred
    
    def mask(self,originalFrame,filteredFrame):
        frame = originalFrame
        mask = filteredFrame

        maskedFrame = cv2.bitwise_and(frame,frame,mask = mask)
        cv2.imshow("Masked Frame",maskedFrame)