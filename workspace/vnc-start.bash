USER=root vncserver :1 -geometry 800x600 -depth 24
websockify -D --web=/usr/share/novnc/ 6080 localhost:5901
npm run tauri dev