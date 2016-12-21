#!/usr/bin/env python

"""SLAVE QX1 interfacing code for python"""

import json
import requests
import threading
import time

from gevent import monkey
monkey.patch_all()
from flask import Flask, render_template, Response, jsonify
from gevent import wsgi

from socket import *
import sys

#cam_url = 'http://10.0.0.1:10000/sony/camera'
cam_url = "http://192.168.122.1:8080/sony/camera"

# class LiveviewThread(threading.Thread):
#     running = True
#     def __init__(self):
#         threading.Thread.__init__(self)
#         self.running = True
#         self.jpg = None
#     def run(self):
#         s = start_liveview()
#         data = open_stream(s)
#         while self.running:
#             time.sleep(5)
#             self.jpg = decode_frame(data)
#     def stop_running(self):
#         self.running = False
#     def get_jpg(self):
#         return self.jpg


def get_payload(method, params):
    return {
	"method": method,
	"params": params,
	"id": 1,
	"version": "1.0"
    }

def sony_api_call(action, params):
    #payload = get_payload(action, params)
    #headers = {'Content-Type': 'application/json'}
    #response = requests.post(cam_url, data=json.dumps(payload), headers=headers)
    #return response.json()['result']
    return true

#def set_exposure_mode(mode):
def set_exposure_mode():
    print "set exposure mode"
    #sony_api_call("setExposureMode", [mode])

#def set_aperture(aperture):
def set_aperture():
    print "set aperture"
    #sony_api_call("setFNumber", [aperture])

#def set_shutter(shutter):
def set_shutter():
    print "set Shutter"
    #sony_api_call("setShutterSpeed", [shutter])

#def set_iso(iso):
def set_iso():
    print "set ISO"
    #sony_api_call("setIsoSpeedRate", [iso])

def take_picture():
    print "take picture"
    #cs.sendto("1", ('', 5000)) #send signal to take picture on other camera
    #return str(sony_api_call("actTakePicture", [])[0][0])

#New Stuff
#

def take_video():
    print "start video"
    #sony_api_call("startMovieRec", [])

def stop_video():
    print "stop video"
    #sony_api_call("stopMovieRec", [])

def videoMode():
    print "video mode"
    #sony_api_call("setShootMode", ["movie"])

def pictureMode():
    print "picture mode"
    #sony_api_call("setShootMode", ["still"])

def setCameraOn():
    print "set camera on"

def setCameraOff():
    print "set camera off"


#
##
###
### Slave Code below
##
#

CONST_TAKE_PICTURE = 0
CONST_SET_EXPOSURE_MODE = 1
CONST_SET_APERATURE = 2
CONST_SET_SHUTTER = 3
CONST_SET_ISO = 4
CONST_START_VIDEO = 5
CONST_STOP_VIDEO = 6
CONST_SET_VIDEO = 7
CONST_SET_PICTURE = 8
CONST_SET_ON = 9
CONST_SET_OFF = 10

def parseData(data, address, sock):
  try:
    opcode = int(data.strip())
    print("Received Request: %d" % (opcode))
    
    if(opcode == CONST_TAKE_PICTURE):
      #sock.sendto("PICTURE\n", address)
      take_picture()
    
    elif(opcode == CONST_SET_EXPOSURE_MODE):
      set_exposure_mode()

    elif(opcode == CONST_SET_APERATURE):
      set_aperture()

    elif(opcode == CONST_SET_SHUTTER):
      set_shutter()

    elif(opcode == CONST_SET_ISO):
      set_iso(iso)

    elif(opcode == CONST_START_VIDEO):
      take_video();

    elif(opcode == CONST_STOP_VIDEO):
      stop_video();

    elif(opcode == CONST_SET_VIDEO):
      videoMode();

    elif(opcode == CONST_SET_PICTURE):
      pictureMode();

    elif(opcode == CONST_SET_ON):
      setCameraOn()
    
    elif(opcode == CONST_SET_OFF):
      setCameraOff()
    
    else:
      print("ERROR: Not supported opcode recieved !!")
      return False #Non-supported opcode
    return True
  
  except:
    print("ERROR: Something went wrong and threw an exception!!")
    return False #Recieved non-numeric data




def main():
  HOST = ''
  PORT = 4005
  sock = socket(AF_INET, SOCK_DGRAM)
  try:
    sock.bind((HOST, PORT))
  except:
    print("Failed to bind address / port")
    sock.close()
  
  print("Listening...")
  while True:
    data, address = sock.recvfrom(1024)

    if(parseData(data, address, sock)):
      sock.sendto("OK\n", address)
    else:
      sock.sendto("ERROR\n", address)
  sock.close()

if __name__ == '__main__':
  main()
