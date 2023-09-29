#!/bin/bash

#==========================================
# Title:  connectToWifi.sh
# Author: Pegor Karoglanian
# Date:   7/1/22
# Notes:  This script is called from runRoot.sh when a user trys to configure a wifi connection.
#==========================================

# This frequency list and it's respective assignment below shouldn't
# be necessary for new RPi models.
freqList="2412 2417 2422 2427 2432 2437 2442 2447 2452 2457 2462"

killall wpa_supplicant  > /dev/null 2>&1

sleep 1

sudo rm -rf /etc/wpa_supplicant/wpa_supplicant.conf  > /dev/null 2>&1

sudo echo "country=US"                                               >> /etc/wpa_supplicant/wpa_supplicant.conf
sudo echo "ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev"  >> /etc/wpa_supplicant/wpa_supplicant.conf

sudo echo "network={"                                                >> /etc/wpa_supplicant/wpa_supplicant.conf
sudo echo "        ssid=\"$1\""                                      >> /etc/wpa_supplicant/wpa_supplicant.conf
sudo echo "        bssid="$2""                                       >> /etc/wpa_supplicant/wpa_supplicant.conf
sudo echo "        freq_list="$freqList""                            >> /etc/wpa_supplicant/wpa_supplicant.conf
sudo echo "        psk=\"$3\""                                       >> /etc/wpa_supplicant/wpa_supplicant.conf
sudo echo "        key_mgmt=WPA-PSK"                                 >> /etc/wpa_supplicant/wpa_supplicant.conf
sudo echo "}"                                                        >> /etc/wpa_supplicant/wpa_supplicant.conf


sudo wpa_supplicant -B -c /etc/wpa_supplicant/wpa_supplicant.conf -i wlan0  > /dev/null 2>&1


sleep 30

wpa_status=$(wpa_cli -i wlan0 status | grep wpa_state | cut -d"=" -f2)

if test  "$wpa_status" = "COMPLETED"
then
    systemctl restart email-check.service
    echo "SUCCESS"
else
    sudo systemctl restart wpa_supplicant.service > /dev/null 2>&1
    sudo systemctl restart dhcpcd > /dev/null 2>&1
    logger "Error occured trying to connect to wifi."
    echo "ERROR"
fi

exit 0