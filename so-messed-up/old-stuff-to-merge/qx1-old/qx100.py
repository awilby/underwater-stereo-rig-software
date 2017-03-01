#!/usr/bin/env python

"""QX1 interfacing code for python"""

import json
import requests
import threading

from gevent import monkey
monkey.patch_all()
from flask import Flask, render_template, Response, jsonify
from gevent import wsgi

#cam_url = 'http://10.0.0.1:10000/sony/camera'
cam_url = "http://192.168.122.1:8080/sony/camera"

class LiveviewThread(threading.Thread):
    running = True
    def __init__(self):
        threading.Thread.__init__(self)
        self.running = True
        self.jpg = None
    def run(self):
        s = start_liveview()
        data = open_stream(s)
        while self.running:
            self.jpg = decode_frame(data)
    def stop_running(self):
        self.running = False
    def get_jpg(self):
        return self.jpg


def get_payload(method, params):
    return {
	"method": method,
	"params": params,
	"id": 1,
	"version": "1.0"
    }

def sony_api_call(action, params):
    payload = get_payload(action, params)
    headers = {'Content-Type': 'application/json'}
    response = requests.post(cam_url, data=json.dumps(payload), headers=headers)
    return response.json()['result']

def get_mode():
    return sony_api_call("getExposureMode", [])

def set_mode(mode):
    return sony_api_call("setExposureMode", [mode])

def get_aperture():
    return sony_api_call("getFNumber", [])[0]

def get_avail_aperture():
    return sony_api_call("getAvailableFNumber", [])

def set_aperture(aperture):
    sony_api_call("setFNumber", [aperture])

def get_shutter():
    return sony_api_call("getShutterSpeed", [])[0]

def get_avail_shutter():
    return sony_api_call("getAvailableShutterSpeed", [])

def set_shutter(shutter):
    sony_api_call("setShutterSpeed", [shutter])

def get_iso():
    return sony_api_call("getIsoSpeedRate", [])

def get_avail_iso():
    return sony_api_call("getAvailableIsoSpeedRate", [])

def set_iso(iso):
    sony_api_call("setIsoSpeedRate", [iso])

def take_picture():
    return str(sony_api_call("actTakePicture", [])[0][0])

def get_event():
    return sony_api_call("getEvent", [False])

def get_picture(url, filename):
    response = requests.get(url)
    chunk_size = 1024
    with open(filename, 'wb') as fd:
	for chunk in response.iter_content(chunk_size):
	    fd.write(chunk)

### LIVEVIEW STUFF
def start_liveview():
    response = sony_api_call("startLiveview", [])
    url = str(response[0])
    return url

def open_stream(url):
    return requests.get(url, stream=True)

def decode_frame(data):

    # decode packet header
    start = ord(data.raw.read(1))
    if(start != 0xFF):
	print 'bad start byte\nexpected 0xFF got %x'%start
	return
    pkt_type = ord(data.raw.read(1))
    if(pkt_type != 0x01):
	print 'not a liveview packet'
	return
    frameno = int(data.raw.read(2).encode('hex'), 16)
    timestamp = int(data.raw.read(4).encode('hex'), 16)

    # decode liveview header
    start = int(data.raw.read(4).encode('hex'), 16)
    if(start != 0x24356879):
	print 'expected 0x24356879 got %x'%start
	return
    jpg_size = int(data.raw.read(3).encode('hex'), 16)
    pad_size = ord(data.raw.read(1))
    # read out the reserved header
    data.raw.read(4)
    fixed_byte = ord(data.raw.read(1))
    if(fixed_byte is not 0x00):
	print 'expected 0x00 got %x'%fixed_byte
	return
    data.raw.read(115)

    # read out the jpg
    jpg_data = data.raw.read(jpg_size)
    data.raw.read(pad_size)

    return jpg_data

# initialization    
app = Flask(__name__)
LVthread = LiveviewThread()
LVthread.start()

@app.route('/')
def index():
    return render_template('index.html')

def gen():
    while True:
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + LVthread.get_jpg() + b'\r\n')

@app.route('/feed')
def feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/takePicture')
def take_picture_cb():
    # FIXME do something with the url
    print take_picture()

@app.route('/setMode/<mode>')
def set_mode_cb(mode=None):
    set_mode(mode)

@app.route('/setAperture/<aperture>')
def set_aperture_cb(aperture=None):
    set_aperture(aperture)

@app.route('/setShutter/<shutter>')
def set_shutter_cb(shutter=None):
    shutter = shutter.replace('.', '/')
    set_shutter(shutter)

@app.route('/setISO/<iso>')
def set_iso_cb(iso=None):
    set_iso(iso)

@app.route('/_data', methods=['GET', 'POST'])
def data_cb():  
    mode = get_mode()
    avail_aperture = get_avail_aperture()
    avail_shutter = get_avail_shutter()
    avail_iso = get_avail_iso()
    return jsonify(mode=mode, aperture=avail_aperture[0], shutter=avail_shutter[0], iso=avail_iso[0], avail_aperture=avail_aperture[1], avail_shutter=avail_shutter[1], avail_iso=avail_iso[1])

# run
#server = wsgi.WSGIServer(('192.168.122.250', 5000), app)
server = wsgi.WSGIServer(('localhost', 5000), app)
server.serve_forever()
