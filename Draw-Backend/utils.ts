export function filterClients(sockets: any) {
    const arr: { username: string, isHost: boolean, id: string }[] = [];

    sockets.forEach((socket: any) => {
        arr.push({
            username: socket.data.username,
            isHost: socket.data.isHost,
            id: socket.id
        });
    });

    return arr;
};