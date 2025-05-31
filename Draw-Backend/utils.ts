export function filterClients(sockets: any) {
    const arr: { username: string, isHost: boolean }[] = [];

    sockets.forEach((socket: any) => {
        arr.push(socket.data.username,);
    });

    return arr;
};