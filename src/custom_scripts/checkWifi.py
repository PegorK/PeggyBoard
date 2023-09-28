#!/usr/bin/env python3

#==========================================
# Title:  checkWifi.py
# Author: mostly -> https://github.com/iancoleman/python-iwlist
# Date:   7/1/22
# Notes:  This script gets called on boot by wifi-check.service on boot. To get available wifi networks.
# 		  It can also be called when a user wants to update the wifi list.
#==========================================

import os
import json
import re
import subprocess

sysWifi = os.popen('sudo iwlist wlan0 scanning')
availableConnections = sysWifi.read()

cellNumberRe = re.compile(r"^Cell\s+(?P<cellnumber>.+)\s+-\s+Address:\s(?P<mac>.+)$")
regexps = [
    re.compile(r"^ESSID:\"(?P<essid>.*)\"$"),
    re.compile(r"^Protocol:(?P<protocol>.+)$"),
    re.compile(r"^Mode:(?P<mode>.+)$"),
    re.compile(r"^Frequency:(?P<frequency>[\d.]+) (?P<frequency_units>.+) \(Channel (?P<channel>\d+)\)$"),
    re.compile(r"^Encryption key:(?P<encryption>.+)$"),
    re.compile(r"^Quality=(?P<signal_quality>\d+)/(?P<signal_total>\d+)\s+Signal level=(?P<signal_level_dBm>.+) d.+$"),
    re.compile(r"^Signal level=(?P<signal_quality>\d+)/(?P<signal_total>\d+).*$"),
]

# Detect encryption type
wpaRe = re.compile(r"IE:\ WPA\ Version\ 1$")
wpa2Re = re.compile(r"IE:\ IEEE\ 802\.11i/WPA2\ Version\ 1$")

cells = []
lines = availableConnections.split('\n')
for line in lines:
	line = line.strip()
	cellNumber = cellNumberRe.search(line)
	if cellNumber is not None:
		cells.append(cellNumber.groupdict())
		continue
	wpa = wpaRe.search(line)
	if wpa is not None :
		cells[-1].update({'encryption':'wpa'})
	wpa2 = wpa2Re.search(line)
	if wpa2 is not None :
		cells[-1].update({'encryption':'wpa2'}) 
	for expression in regexps:
		result = expression.search(line)
		if result is not None:
			if 'encryption' in result.groupdict() :
				if result.groupdict()['encryption'] == 'on' :
					cells[-1].update({'encryption': 'wep'})
				else :
					cells[-1].update({'encryption': 'off'})
			else :
				cells[-1].update(result.groupdict())
			continue


wifiNames = json.dumps(cells)


f = open("/var/www/custom_scripts/wifiNames.json", "w")
f.write(wifiNames)
f.close()

print("Done")