import { Server, Socket } from "socket.io";

const io = new Server({
    cors: {
        origin: ["http://localhost:5173", "http://192.168.0.146:5173/"]
    }
});

const drawingData: any = [];

io.on("connection", (socket) => {
    socket.emit("emitDrawingData", drawingData);

    socket.on("pushDrawingInfo", (drawingInfo: any) => {
        drawingData.push(drawingInfo);
        socket.broadcast.emit("resDrawingInfo" , drawingInfo);
    });

    socket.on("undoDrawing", () => {
        socket.broadcast.emit("emitUndo");
    });

    socket.on("redoDrawing", () => {
        socket.broadcast.emit("emitRedo");
    });
});

io.listen(8080);