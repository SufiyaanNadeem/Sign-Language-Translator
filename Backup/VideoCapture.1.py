# Program To Read video 
# and Extract Frames 
import cv2 
import numpy as np
from win32api import GetSystemMetrics
from PIL import ImageFont, ImageDraw, Image  

# Function to extract frames 
def FrameCapture(path): 
	width= GetSystemMetrics(0)
	height= GetSystemMetrics(1)
	#screen = screeninfo.get_monitors()[screen_id]

	# Path to video file 
	#cap = cv2.VideoCapture(path) 
	cap = cv2.VideoCapture(0)
	#cap.set(3,1920)
	#cap.set(4,1080)
	# Used as counter variable 
	count = 0

	#cv2.namedWindow("ASL Translator", cv2.WINDOW_FULLSCREEN)
	#cv2.moveWindow("ASL Translator",0,0)
	#cv2.setWindowProperty("window",cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
	# checks whether frames were extracted 
	success = 1
	#cap.set(3,1920)
	#cap.set(4,1080# Write some Text

	font                   = cv2.FONT_HERSHEY_DUPLEX
	bottomLeftCornerOfText = (10,400)
	fontScale              = 1
	fontColor              = (255,255,255)
	lineType               = 2

	img = cv2.imread('letterD.png',0)

	welcomeText="Welcome to ASL Translator"

	
	while success: 
		# Capture frame-by-frame
		ret, frame = cap.read()
		#frame=cv2.resize(frame,(1000,500),interpolation =cv2.INTER_AREA)
		
		# Our operations on the frame come here
		mat = cv2.cvtColor(frame, 0)
		#resize = cv2.resize(mat, (width, height)) 
		#cv2.putText(frame,'Hello World!', bottomLeftCornerOfText,font, fontScale,fontColor,lineType)
		
		matRGB = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
		
		forPIL=Image.fromarray(matRGB)
		
		draw=ImageDraw.Draw(forPIL)

		latoFont=ImageFont.truetype("LATO-REGULAR.TTF",20)

		# cap object calls read 
		# function extract frames 
		#success, image = cap.read() 

		# Saves the frames with frame-count 
		#cv2.imwrite("frame%d.jpg" % count, image) 

		count += 1

# Driver Code 
if __name__ == '__main__': 

	# Calling the function 
	FrameCapture("sample.mp4") 
