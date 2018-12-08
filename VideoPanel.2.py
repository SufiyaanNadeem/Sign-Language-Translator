# Program To Read video 
# and Extract Frames 
import cv2 
import numpy as np
from win32api import GetSystemMetrics
from PIL import ImageFont, ImageDraw, Image  
import screeninfo

class VideoPanel(object):
	width= GetSystemMetrics(0)
	height= GetSystemMetrics(1)
	windowName= "ASL Translator - Sufiyaan Nadeem"
	screen_id=0
	screen= screeninfo.get_monitors()[screen_id]
	cap = cv2.VideoCapture(0)
	mat=0
	
	def __init__(self):
		print("asdasd")
		cv2.namedWindow(self.windowName, cv2.WINDOW_AUTOSIZE)
		cv2.moveWindow(self.windowName, self.screen.x - 1, self.screen.y - 1)
		cv2.setWindowProperty(self.windowName, cv2.WINDOW_FULLSCREEN, cv2.WINDOW_FULLSCREEN);
	
	def captureVid(self):
		cap = cv2.VideoCapture(0)
		ret, frame = cap.read()
		frame = cv2.cvtColor(frame, 0)
		mat=cv2.resize(frame,(self.width,self.height),interpolation =cv2.INTER_AREA)
		self.mat=mat
		cv2.imshow(self.windowName, self.mat)

	def showVid(self):
		cv2.imshow(self.windowName, self.mat)

	def anotherVid(self):
		'''if welcomeAnimationCounter<len(title)-1:
			welcomeAnimationCounter+=1
			welcomeText+=title[welcomeAnimationCounter]
		# Capture frame-by-frame'''
		ret, frame = cap.read()
		frame=cv2.resize(frame,(width,height),interpolation =cv2.INTER_AREA)
		
		# Our operations on the frame come here
		mat = cv2.cvtColor(frame, 0)
		#resize = cv2.resize(mat, (width, height)) 
		'''cv2.putText(frame,'Hello World!', 
			bottomLeftCornerOfText, 
			font, 
			fontScale,
			fontColor,
			lineType)'''
		latoFont=ImageFont.truetype("Fonts/LATO-REGULAR.TTF",80)
		matRGB = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
		forPIL=Image.fromarray(matRGB)
		
		draw=ImageDraw.Draw(forPIL)
		draw.text((0, 0), welcomeText, font=latoFont)  
		cv2_im_processed = cv2.cvtColor(np.array(forPIL), cv2.COLOR_RGB2BGR)
		cv2.imshow(window_name, cv2_im_processed)
		#cv2.setWindowProperty(welcomeText, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
		#cv2.moveWindow(welcomeText, width - 1, height - 1)
		#cv2.setWindowProperty(welcomeText, cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
		#cv2.moveWindow('frame',1000,0)
		#cv2.setWindowProperty('frame',cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
		# checks whether frames were extracted 
		#frame.set(3,1920)
		#frame.set(4,1080)
		# Display the resulting frame
		#cv2.imshow(welcomeText,frame)
		#cv2.imshow('frame',img)

	
def welcome():
	return

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
	title = 'Welcome'
	screen_id =0
	screen = screeninfo.get_monitors()[screen_id]
	img = cv2.imread('letterD.png',0)
	welcomeAnimationCounter=-1
	welcomeText=""
	window_name="ASL Translator - Sufiyaan Nadeem"
	welcome()
	cv2.namedWindow(window_name, cv2.WINDOW_AUTOSIZE)
	cv2.moveWindow(window_name, screen.x - 1, screen.y - 1)
	#cv2.moveWindow(welcomeText, 0, 0);
	cv2.setWindowProperty(window_name, cv2.WINDOW_FULLSCREEN, cv2.WINDOW_FULLSCREEN);
	while success: 
		if welcomeAnimationCounter<len(title)-1:
			welcomeAnimationCounter+=1
			welcomeText+=title[welcomeAnimationCounter]
		# Capture frame-by-frame
		ret, frame = cap.read()
		frame=cv2.resize(frame,(width,height),interpolation =cv2.INTER_AREA)
		
		# Our operations on the frame come here
		mat = cv2.cvtColor(frame, 0)
		#resize = cv2.resize(mat, (width, height)) 
		'''cv2.putText(frame,'Hello World!', 
			bottomLeftCornerOfText, 
			font, 
			fontScale,
			fontColor,
			lineType)'''
		latoFont=ImageFont.truetype("Fonts/LATO-REGULAR.TTF",80)
		matRGB = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
		forPIL=Image.fromarray(matRGB)
		
		draw=ImageDraw.Draw(forPIL)
		draw.text((0, 0), welcomeText, font=latoFont)  
		cv2_im_processed = cv2.cvtColor(np.array(forPIL), cv2.COLOR_RGB2BGR)  
   
		
		#cv2.setWindowProperty(welcomeText, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
		#cv2.moveWindow(welcomeText, width - 1, height - 1)
		#cv2.setWindowProperty(welcomeText, cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
		#cv2.moveWindow('frame',1000,0)
		#cv2.setWindowProperty('frame',cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
		# checks whether frames were extracted 
		#frame.set(3,1920)
		#frame.set(4,1080)
		# Display the resulting frame
		#cv2.imshow(welcomeText,frame)
		#cv2.imshow('frame',img)

		cv2.imshow(window_name, cv2_im_processed)
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break

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
