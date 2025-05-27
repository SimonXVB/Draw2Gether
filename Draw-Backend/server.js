"use strict";
const { Server } = require("socket.io");
const io = new Server({
    cors: {
        origin: ["http://localhost:5173", "http://192.168.0.146:5173/"]
    }
});
io.on("connection", (socket) => {
    socket.on("pushDrawingInfo", (drawingInfo) => {
        socket.broadcast.emit("resDrawingInfo", drawingInfo);
    });
});
io.listen(8080);
