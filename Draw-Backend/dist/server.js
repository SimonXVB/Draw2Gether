"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const utils_1 = require("./utils");
const io = new socket_io_1.Server({
    cors: {
        origin: process.env.ORIGIN
    }
});
const rooms = [];
io.on("connection", socket => {
    //Create room
    socket.on("createRoom", (input) => __awaiter(void 0, void 0, void 0, function* () {
        if (input.roomName === "" || input.password === "" || input.username === "") {
            io.to(socket.id).emit("joinError", "empty");
            return;
        }
        ;
        if (input.roomName.length > 25 || input.password.length > 25 || input.username.length > 25) {
            io.to(socket.id).emit("joinError", "length");
            return;
        }
        ;
        const sockets = yield io.in(input.roomName).fetchSockets();
        if (!sockets[0]) {
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
        }
        else {
            io.to(socket.id).emit("joinError", "roomExists");
        }
        ;
    }));
    //Join room
    socket.on("joinRoom", (input) => __awaiter(void 0, void 0, void 0, function* () {
        if (input.roomName === "" || input.password === "" || input.username === "") {
            io.to(socket.id).emit("joinError", "empty");
            return;
        }
        ;
        if (input.roomName.length > 25 || input.password.length > 25 || input.username.length > 25) {
            io.to(socket.id).emit("joinError", "length");
            return;
        }
        ;
        const sockets = yield io.in(input.roomName).fetchSockets();
        if (sockets[0]) {
            const password = sockets[0].data.password;
            if (input.password === password) {
                socket.join(input.roomName);
                socket.data.password = password;
                socket.data.roomName = sockets[0].data.roomName;
                socket.data.username = input.username;
                socket.data.isHost = false;
                const updatedSockets = yield io.in(input.roomName).fetchSockets();
                io.to(socket.id).emit("joinedRoom", {
                    roomName: sockets[0].data.roomName,
                    username: input.username,
                    password: sockets[0].data.password,
                    isHost: false,
                    clients: (0, utils_1.filterClients)(updatedSockets)
                });
                io.to(sockets[0].data.roomName).emit("roomEvent", {
                    clients: (0, utils_1.filterClients)(updatedSockets),
                    user: input.username,
                    event: "joined"
                });
            }
            else {
                io.to(socket.id).emit("joinError", "password");
            }
            ;
        }
        else {
            io.to(socket.id).emit("joinError", "roomNotExists");
        }
        ;
    }));
    //Get initial data
    socket.on("getInitialData", cb => {
        const room = rooms.find(room => room.roomName === socket.data.roomName);
        if (!room)
            return;
        cb({
            drawingData: room.drawingData,
            redoData: room.redoData
        });
    });
    //Send new drawing data to clients
    socket.on("sendNewData", (data) => {
        const room = rooms.find(room => room.roomName === socket.data.roomName);
        if (!room)
            return;
        room.drawingData.push(data);
        io.to(socket.data.roomName).emit("receiveNewData", {
            drawingData: room.drawingData,
            redoData: room.redoData
        });
    });
    //Undo drawing
    socket.on("sendUndo", () => {
        const room = rooms.find(room => room.roomName === socket.data.roomName);
        if (!room)
            return;
        const undoEl = room.drawingData.pop();
        if (!undoEl)
            return;
        room.redoData.push(undoEl);
        io.to(socket.data.roomName).emit("receiveUndo", {
            drawingData: room.drawingData,
            redoData: room.redoData
        });
    });
    //Redo drawing
    socket.on("sendRedo", () => {
        const room = rooms.find(room => room.roomName === socket.data.roomName);
        if (!room)
            return;
        const redoEl = room.redoData.pop();
        if (!redoEl)
            return;
        room.drawingData.push(redoEl);
        io.to(room.roomName).emit("receiveRedo", {
            drawingData: room.drawingData,
            redoData: room.redoData
        });
    });
    //Kick user
    socket.on("kickUserHost", (id) => __awaiter(void 0, void 0, void 0, function* () {
        if (!socket.data.isHost)
            return;
        const sockets = yield io.in(socket.data.roomName).fetchSockets();
        const userToKick = sockets.filter(socket => socket.id === id)[0];
        io.to(userToKick.id).emit("kickUserClient");
        userToKick.leave(userToKick.data.roomName);
        const updatedSockets = yield io.in(socket.data.roomName).fetchSockets();
        io.to(sockets[0].data.roomName).emit("roomEvent", {
            clients: (0, utils_1.filterClients)(updatedSockets),
            user: userToKick.data.username,
            event: "kicked"
        });
        userToKick.data.username = "";
        userToKick.data.password = "";
        userToKick.data.roomName = "";
        userToKick.data.isHost = false;
    }));
    //Leave room
    socket.on("leaveRoom", () => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(socket.data.roomName);
        const sockets = yield io.in(socket.data.roomName).fetchSockets();
        if (socket.data.isHost && sockets.length > 0) {
            sockets[0].data.isHost = true;
            io.to(sockets[0].id).emit("hostChange");
        }
        ;
        if (sockets.length === 0) {
            const i = rooms.findIndex(el => el.roomName === socket.data.roomName);
            rooms.splice(i, 1);
        }
        ;
        io.to(socket.data.roomName).emit("roomEvent", {
            clients: (0, utils_1.filterClients)(sockets),
            user: socket.data.username,
            event: "left"
        });
        socket.data.username = "";
        socket.data.password = "";
        socket.data.roomName = "";
        socket.data.isHost = false;
    }));
    //Disconnect function
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        const sockets = yield io.in(socket.data.roomName).fetchSockets();
        if (socket.data.isHost && sockets.length > 0) {
            sockets[0].data.isHost = true;
            io.to(sockets[0].id).emit("hostChange");
        }
        ;
        if (sockets.length === 0) {
            const i = rooms.findIndex(el => el.roomName === socket.data.roomName);
            rooms.splice(i, 1);
        }
        ;
        io.to(socket.data.roomName).emit("roomEvent", {
            clients: (0, utils_1.filterClients)(sockets),
            user: socket.data.username,
            event: "disconnected"
        });
        socket.data.username = "";
        socket.data.password = "";
        socket.data.roomName = "";
        socket.data.isHost = false;
    }));
});
io.listen(8080);
