"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterClients = filterClients;
function filterClients(sockets) {
    const arr = [];
    sockets.forEach((socket) => {
        arr.push({
            username: socket.data.username,
            isHost: socket.data.isHost,
            id: socket.id
        });
    });
    return arr;
}
;
