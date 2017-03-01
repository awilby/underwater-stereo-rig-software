#!/usr/bin/env python
#slave code
from socket import *
import subprocess

def parseData(data, address, sock):
  try:
    opcode = int(data.strip())
    print("Received Op Code: %d" % (opcode))
    if(opcode == 1):
      print("TAKING PICTURE")
      sock.sendto("PICTURE\n", address)
    elif(opcode == 2):
      print("CAMERA TURNED ON")
    elif(opcode == 3):
      print("CAMERA TURNED OFF")
    else:
      print("ERROR: Not supported opcode recieved !!")
      return False #Non-supported opcode
    return True
  except:
    print("ERROR: Recieved non-numeric data !!")
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
