"""
This class uses the Bing Spell Check API to fix the punctuation of a sentence.

Author: Sufiyaan Nadeem
Sources: 
https://docs.microsoft.com/en-us/azure/cognitive-services/bing-spell-check/quickstarts/python
"""
import http.client, urllib.parse, json
import json

class SentenceCorrector():
    key = '37e795a270344ab18f0e960f702d0305' #Bing Spell Check API Key
    host = 'api.cognitive.microsoft.com'
    path = '/bing/v7.0/spellcheck?'
    params = 'mkt=en-us&mode=proof'
    headers = {'Ocp-Apim-Subscription-Key': key,
'Content-Type': 'application/x-www-form-urlencoded'}
    conn=http.client.HTTPSConnection(host)

    """
    Process a string of letters and returns a sentence with appropriate spaces 
    and punctuation as an output.

    :param sentence The sentence that needs to be corrected 
    """
    def correctSentence(self,sentence):
        data = {'text': sentence}
        body = urllib.parse.urlencode (data)
        self.conn.request ("POST", self.path + self.params, body, self.headers)
        response = self.conn.getresponse ()
        data=json.loads(response.read())
        print (data["flaggedTokens"][0]["suggestions"][0]["suggestion"])

SentenceCorrector=SentenceCorrector()
SentenceCorrector.correctSentence("hellohowareyoudoingtoday?")# test sentence, similar to what the hand gesture code will output
