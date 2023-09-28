#!/bin/bash

#==========================================
# Title:  connectToWifi.sh
# Author: Pegor Karoglanian
# Date:   8/10/23
# Notes:  This script is called from runRoot.sh when a user tries to update the system
#==========================================

cd /home/pi/PeggyBoard
current_commit=`git rev-parse HEAD`

case $1 in
  version)
    echo $current_commit
    ;;
  update)
    git pull --quiet
    update_commit=`git rev-parse HEAD`
    if [ $update_commit == $current_commit ]
    then
        echo "False"
    else
        echo $update_commit
        cp -r /home/pi/PeggyBoard/src/* /var/www/
    fi
    ;;
  *)
    echo -n "error: command not found"
    ;;
esac