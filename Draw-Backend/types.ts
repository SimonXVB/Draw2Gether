export interface joinRoomInterface {
    roomName: string,
    password: string,
    username: string
};

export interface roomsInterface {
    roomName: string,
    drawingData: drawingDataInterface[],
    redoData: drawingDataInterface[]
};

export interface drawingDataInterface {
    color: string,
    size: number,
    coords: []
};