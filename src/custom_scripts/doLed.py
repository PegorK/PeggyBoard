#!/usr/bin/env python3

#==========================================
# Title:  doLed.py
# Author: Pegor Karoglanian
# Date:   8/10/23
# Notes:  This script gets called to display the selected climb
#         on the LEDs.
#==========================================

import os
import sys
import board
import neopixel
import time
import json
import base64

def clearBoard():
    for x in range(LEDs):
        ledWall[x] = (0, 0, 0)   

def lightHolds():
    for hold in currentProblem:
        hexColor = int(hold['color'], 16)
        R = (hexColor & 0xFF)
        G = (hexColor & 0xFF00) >> 8
        B = (hexColor & 0xFF0000) >> 16
        ledWall[hold['hold']] = (R, G, B)
        # print(str(hold['hold']) + ": R(" + str(R) + ")  G(" + str(G) + ") B(" + str(B) + ")")

try:
    ledCmd = sys.argv[1]
    currentProblem = sys.argv[2]
    if currentProblem != "0":
        currentProblem = json.loads(base64.b64decode(currentProblem))
except:
    print("Command error!")
    quit()

LEDs = 12
ledWall = neopixel.NeoPixel(board.D18, LEDs)


if ledCmd == "CLEAR":
    clearBoard()
elif ledCmd == "PROBLEM":
    clearBoard()
    lightHolds()
else:
    print("What. You can't be here.")
    #hmm how'd ya get here?!