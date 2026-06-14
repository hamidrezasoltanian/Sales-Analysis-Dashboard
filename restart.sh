#!/bin/bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js" 2>/dev/null
sleep 2
nohup node server.js > ../backend.log 2>&1 &
sleep 3
echo "Backend restarted"

