#!/bin/bash

#==========================================
# Title:  runRoot.sh
# Author: Pegor Karoglanian
# Date:   8/10/23
# Notes:  This script has root permissions.
#         It is used to call other scripts as root!
#==========================================

case $1 in

  updateWifiList)
    python3 /var/www/custom_scripts/checkWifi.py
    ;;
  loginWifi)
    /var/www/custom_scripts/connectToWifi.sh "$2" "$3" "$4"
    ;;
  getWifi)
    iwconfig wlan0 | sed -n 's/.*Access Point: \([0-9\:A-F]\{17\}\).*/\1/p'
    ;;
  getIp)
    ifconfig wlan0 | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'
    ;;
  checkOnline)
    wget -q --spider -T 5 http://google.com
    if [ $? -eq 0 ]; then
      echo "True"
    else
      echo "False"
    fi
    ;;
  doLed)
    python3 /var/www/custom_scripts/doLed.py $2 $3
    ;;
  doUpdate)
    /var/www/custom_scripts/updateScript.sh update
    ;;
  getVersion)
    /var/www/custom_scripts/updateScript.sh version
    ;;
  systemReboot)
    shutdown -r now
    ;;
  systemShutdown)
    shutdown -h now
    ;;
  *)
    echo -n "error: command not found"
    ;;
esac

exit 0