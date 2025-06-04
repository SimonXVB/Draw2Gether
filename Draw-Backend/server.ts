import { Server } from "socket.io";
import { filterClients } from "./utils";

const io = new Server({
    cors: {
        origin: ["http://localhost:5173", "http://192.168.0.146:5173/"]
    }
});

io.on("connection", (socket) => {
    //Create room
    socket.on("createRoom", async (input) => {
        if(input.roomName === "" || input.password === "" || input.username === "") {
            io.to(socket.id).emit("joinError", "empty");
            return;
        };

        const sockets = await io.in(input.roomName).fetchSockets();

        if(!sockets[0]) {
            socket.join(input.roomName);

            socket.data.password = input.password;
            socket.data.roomName = input.roomName;
            socket.data.username = input.username;
            socket.data.isHost = true;

            io.to(socket.id).emit("joinedRoom", {
                roomName: input.roomName,
                username: input.username,
                password: input.password,
                isHost: true,
                clients: [{
                    username: input.username,
                    isHost: true,
                    id: socket.id
                }]
            });
        } else {
            io.to(socket.id).emit("joinError", "roomExists");
        };
    });

    //Join room
    socket.on("joinRoom", async (input) => {
        if(input.roomName === "" || input.password === "" || input.username === "") {
            io.to(socket.id).emit("joinError", "empty");
            return;
        };

        const sockets = await io.in(input.roomName).fetchSockets();

        if(sockets[0]) {
            const password = sockets[0].data.password;

            if(input.password === password) {
                socket.join(input.roomName);

                socket.data.password = password;
                socket.data.roomName = sockets[0].data.roomName;
                socket.data.username = input.username;
                socket.data.isHost = false;

                const updatedSockets = await io.in(input.roomName).fetchSockets();

                io.to(socket.id).emit("joinedRoom", {
                    roomName: sockets[0].data.roomName,
                    username: input.username,
                    password: sockets[0].data.password,
                    isHost: false,
                    clients: filterClients(updatedSockets)
                });

                io.to(sockets[0].data.roomName).emit("clientJoined", {
                    clients: filterClients(updatedSockets),
                    user: input.username,
                    event: "joined"
                });
            } else {
                io.to(socket.id).emit("joinError", "password");
            };
        } else {
            io.to(socket.id).emit("joinError", "roomNotExists");
        };
    });

    //Send initial data to client from host
    socket.on("initialDataReqClient", async () => {
        const sockets = await io.in(socket.data.roomName).fetchSockets();

        io.to(sockets[0].id).emit("initialDataRequestHost");
    });

    socket.on("sendInitialDataHost", async data => {
        const sockets = await io.in(socket.data.roomName).fetchSockets();

        socket.to(sockets[sockets.length - 1].id).emit("receiveInitialData", {
            drawingInfo: data.drawingInfo,
            redoArr: data.redoArr
        });
    });

    //Send current drawing data to clients
    socket.on("sendNewData", data => {
        socket.broadcast.to(socket.data.roomName).emit("receiveNewData", data.newDrawingInfo);
    });

    //Undo/Redo drawing
    socket.on("sendUndo", () => {
        socket.broadcast.to(socket.data.roomName).emit("receiveUndo");
    });

    socket.on("sendRedo", () => {
        socket.broadcast.to(socket.data.roomName).emit("receiveRedo");
    });

    //Kick user
    socket.on("kickUserHost", async (id: string) => {
        if(!socket.data.isHost) return;

        const sockets = await io.in(socket.data.roomName).fetchSockets();
        const userToKick = sockets.filter(socket => socket.id === id)[0];

        io.to(userToKick.id).emit("kickUserClient");
        io.to(sockets[0].data.roomName).emit("userKicked", {
            clients: filterClients(sockets),
            user: socket.data.username,
            event: "kicked"
        });

        userToKick.data.password = "";
        userToKick.data.roomName = "";
        userToKick.data.isHost = false;
    });

    //Leave room
    socket.on("leaveRoom", async () => {
        socket.leave(socket.data.roomName);

        const sockets = await io.in(socket.data.roomName).fetchSockets();

        if(socket.data.isHost && sockets.length > 0) {
            sockets[0].data.isHost = true;
            io.to(sockets[0].id).emit("hostChange");
        };

        io.to(socket.data.roomName).emit("clientLeave", {
            clients: filterClients(sockets),
            user: socket.data.username,
            event: "left"
        });

        socket.data.password = "";
        socket.data.roomName = "";
        socket.data.isHost = false;
    });

    //General disconnect function
    socket.on("disconnect", async () => {
        const sockets = await io.in(socket.data.roomName).fetchSockets();

        if(socket.data.isHost && sockets.length > 0) {
            sockets[0].data.isHost = true;
            io.to(sockets[0].id).emit("hostChange");
        };

        io.to(socket.data.roomName).emit("clientLeave", {
            clients: filterClients(sockets),
            user: socket.data.username,
            event: "left"
        });

        socket.data.password = "";
        socket.data.roomName = "";
        socket.data.isHost = false;
    });
});

io.listen(8080);