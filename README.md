![D2G-Banner](https://github.com/user-attachments/assets/ac4cb9db-898d-4a41-b355-bf412550758e)

# Draw2Gether
Draw2Gether (D2G) is a room-based interactive drawing app.  
Simply create a room and start drawing with your friends.

## Features
- Real-time communication thanks to Socket.io
- Password-protected rooms
- 7000x7000 Canvas
- Change brush size and color
- Undo and Redo drawings
- Pan and Zoom the canvas
- Jump to 0,0 button
- Download canvas as 7000x7000 PNG
- Kick users as "host"
- Works both on Desktop and Mobile devices

## Notes
- When a user creates a room, they are assigned as the inital "host" of the room. As as the host you can kick other users.
- When a "host" leaves a room, the user next in line will be assigned as the new host.
- I might add more "host" related features in future updates, but for the time being I'm quite happy with how the overall project turned out.
- As mentioned before, this app uses Socket.io to enable real-time communication between the server and the different clients.
