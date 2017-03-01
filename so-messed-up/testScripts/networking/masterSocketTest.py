#!/usr/bin/env python
from socket import *
import sys

def main(argv):
  validargs = ["take_picture", "camera_on", "camera_off"]
  if(len(argv) == 2 and argv[1] in validargs): #check arguments before opening socket
    if(argv[1] == "take_picture"): #send first opcode
      print "sending opcode 1"
      opcode = "1"
    elif(argv[1] == "camera_on"): #senc second opcode
      print "sending opcode 2"
      opcode = "2"
    elif(argv[1] == "camera_off"):
      print "sending opcode 3"
      opcode = "3"
    cs = socket(AF_INET, SOCK_DGRAM)
    cs.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    cs.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)
    #cs.sendto(opcode, ('192.168.0.7', 5000))
    cs.sendto(opcode, ('', 4005))
    print "sent"
    data, address = cs.recvfrom(1024)
    print "recieved"
    print data
  else:
    print("Usage: %s <%s>" % (argv[0], '|'.join(validargs)))

if __name__ == "__main__":
  main(sys.argv)
