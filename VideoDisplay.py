class VideoDisplay:
    def __init__(self,video_source=0):
        self.vid=cv2.VideoCapture(video_source)
        self.width= GetSystemMetrics(0)
	    self.height= GetSystemMetrics(1)