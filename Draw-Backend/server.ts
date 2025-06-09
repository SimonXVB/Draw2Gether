import { Server } from "socket.io";
import { filterClients } from "./utils";
import { type joinRoomInterface, type roomsInterface, type drawingDataInterface } from "./types";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

const rooms: roomsInterface[] = [];

io.on("connection", socket => {
    //Create room
    socket.on("createRoom", async (input: joinRoomInterface) => {
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

            rooms.push({
                roomName: input.roomName,
                drawingData: [],
                redoData: []
            });

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
    socket.on("joinRoom", async (input: joinRoomInterface) => {
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

                io.to(sockets[0].data.roomName).emit("roomEvent", {
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

    //Get initial data
    socket.on("getInitialData", cb => {
        const room = rooms.find(room => room.roomName === socket.data.roomName)!;

        cb({
            drawingData: room.drawingData,
            redoData: room.redoData
        });
    });

    //Send new drawing data to clients
    socket.on("sendNewData", (data: drawingDataInterface) => {
        const room = rooms.find(room => room.roomName === socket.data.roomName)!;
        room.drawingData.push(data);

        io.to(socket.data.roomName).emit("receiveNewData", room.drawingData);
    });

    //Undo drawing
    socket.on("sendUndo", () => {
        const room = rooms.find(room => room.roomName === socket.data.roomName)!;
        const undoEl = room.drawingData.pop();

        if(!undoEl) return;
        room.redoData.push(undoEl);

        io.to(socket.data.roomName).emit("receiveUndo", {
            drawingData: room.drawingData,
            redoData: room.redoData
        });
    });

    //Redo drawing
    socket.on("sendRedo", () => {
        const room = rooms.find(room => room.roomName === socket.data.roomName)!;
        const redoEl = room.redoData.pop();

        if(!redoEl) return;
        room.drawingData.push(redoEl);

        io.to(room.roomName).emit("receiveRedo", {
            drawingData: room.drawingData,
            redoData: room.redoData
        });
    });

    //Kick user
    socket.on("kickUserHost", async (id: string) => {
        if(!socket.data.isHost) return;

        const sockets = await io.in(socket.data.roomName).fetchSockets();
        const userToKick = sockets.filter(socket => socket.id === id)[0];

        io.to(userToKick.id).emit("kickUserClient");
        userToKick.leave(userToKick.data.roomName);

        const updatedSockets = await io.in(socket.data.roomName).fetchSockets();

        io.to(sockets[0].data.roomName).emit("roomEvent", {
            clients: filterClients(updatedSockets),
            user: socket.data.username,
            event: "kicked"
        });

        userToKick.data.username = "";
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

        if(sockets.length === 0) {
            const i = rooms.findIndex(el => el.roomName === socket.data.roomName);
            rooms.splice(i, 1);
        };

        io.to(socket.data.roomName).emit("roomEvent", {
            clients: filterClients(sockets),
            user: socket.data.username,
            event: "left"
        });

        socket.data.username = "";
        socket.data.password = "";
        socket.data.roomName = "";
        socket.data.isHost = false;
    });

    //Disconnect function
    socket.on("disconnect", async () => {
        const sockets = await io.in(socket.data.roomName).fetchSockets();

        if(socket.data.isHost && sockets.length > 0) {
            sockets[0].data.isHost = true;
            io.to(sockets[0].id).emit("hostChange");
        };

        if(sockets.length === 0) {
            const i = rooms.findIndex(el => el.roomName === socket.data.roomName);
            rooms.splice(i, 1);
        };

        io.to(socket.data.roomName).emit("roomEvent", {
            clients: filterClients(sockets),
            user: socket.data.username,
            event: "disconnected"
        });

        socket.data.username = "";
        socket.data.password = "";
        socket.data.roomName = "";
        socket.data.isHost = false;
    });
});

io.listen(8080);