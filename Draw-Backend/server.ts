import { Server, Socket } from "socket.io";

const io = new Server({
    cors: {
        origin: ["http://localhost:5173", "http://192.168.0.146:5173/"]
    }
});

io.on("connection", (socket) => {
    //Join room function
    socket.on("joinRoom", async (input) => {
        const sockets = await io.in(input.roomName).fetchSockets();

        if(sockets[0]) {
            const password = sockets[0].data.password;

            if(input.password === password) {
                socket.join(input.roomName);

                socket.data.password = password;
                socket.data.roomName = sockets[0].data.roomName;
                socket.data.isHost = false;

                io.to(socket.id).emit("joinedRoom", {
                    roomName: sockets[0].data.roomName,
                    isHost: false
                });
            } else {
                io.to(socket.id).emit("incorrectCreds");
            };
        } else {
            socket.join(input.roomName);

            socket.data.password = input.password;
            socket.data.roomName = input.roomName;
            socket.data.isHost = true;

            io.to(socket.id).emit("joinedRoom", {
                roomName: input.roomName,
                isHost: true
            });
        };
    });

    //Send initial data to client from host --Start
    socket.on("initialDataReqClient", async (roomName: string) => {
        const sockets = await io.in(roomName).fetchSockets();
        const host = sockets.find(socket => socket.data.isHost === true) || sockets[0];

        io.to(host.id).emit("initialDataRequestHost");
    });

    socket.on("sendInitialDataHost", async data => {
        const sockets = await io.in(data.roomName).fetchSockets();

        socket.to(sockets[sockets.length - 1].id).emit("receiveInitialData", {
            drawingInfo: data.drawingInfo,
            redoArr: data.redoArr
        });
    });
    //Send initial data to client from host --End

    //Send current drawing data to clients --Start
    socket.on("sendNewData", data => {
        socket.broadcast.to(data.roomName).emit("receiveNewData", data.newDrawingInfo);
    });
    //Send current drawing data to clients --End

    //Undo/Redo drawings --Start
    socket.on("sendUndo", (roomName: string) => {
        socket.broadcast.to(roomName).emit("receiveUndo");
    });

    socket.on("sendRedo", (roomName: string) => {
        socket.broadcast.to(roomName).emit("receiveRedo");
    });
    //Undo/Redo drawings --End

    socket.on("disconnect", async () => {
        if(socket.data.isHost) {
            const sockets = await io.in(socket.data.roomName).fetchSockets();

            if(!sockets[0]) return;

            sockets[0].data.isHost = true;

            socket.data.password = "";
            socket.data.roomName = "";
            socket.data.isHost = false;

            io.to(sockets[0].id).emit("hostChange");
        };
    });
});

io.listen(8080);