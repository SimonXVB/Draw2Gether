import { Server, Socket } from "socket.io";

const io = new Server({
    cors: {
        origin: ["http://localhost:5173", "http://192.168.0.146:5173/"]
    }
});

const connectedClients: string[] = [];

io.on("connection", (socket) => {
    // Send drawing data to newly connected client by fetching relevant data from "host"

/*     if(connectedClients.length > 1) {
        io.to(connectedClients[0]).emit("requestInitialData");
        console.log("initial data req sent");
    }; */

    socket.on("sendInitialData", data => {
        io.to(connectedClients[connectedClients.length - 1]).emit("receiveInitialData", data);
    });

    socket.on("sendNewData", drawingData => {
        socket.broadcast.emit("receiveNewData", drawingData);
    });

    socket.on("undoDrawing", () => {
        socket.broadcast.emit("emitUndo");
    });

    socket.on("redoDrawing", () => {
        socket.broadcast.emit("emitRedo");
    });

    //Join room function
    socket.on("joinRoom", async (input) => {
        const sockets = await io.in(input.roomName).fetchSockets();

        if(sockets.length > 0) {
            const password = sockets[0].data.password;

            if(input.password === password) {
                socket.join(input.roomName);
                socket.data.password = password;

                io.to(socket.id).emit("joinedRoom", {
                    roomName: input.roomName,
                    isJoined: true
                });
            } else {
                console.log("wrong credentials");
            };
        } else {
            socket.join(input.roomName);
            socket.data.password = input.password;

            io.to(socket.id).emit("joinedRoom", {
                roomName: input.roomName,
                isJoined: true
            });
        };
    });

    socket.on("disconnect", () => connectedClients.splice(connectedClients.indexOf(socket.id), 1));
});

io.listen(8080);