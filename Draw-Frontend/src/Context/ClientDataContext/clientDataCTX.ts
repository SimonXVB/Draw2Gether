import { createContext, type Dispatch, type SetStateAction } from "react";

interface clientsInterface {
    username: string,
    isHost: boolean,
    id: string
};

export interface clientDataInterface {
    isJoined: boolean,
    isDisconnected: boolean,
    isHost: boolean,
    isKicked: boolean,
    roomName: string,
    username: string,
    password: string,
    clients: clientsInterface[]
};

interface clientDataCTXInterface {
    clientData: clientDataInterface,
    setClientData: Dispatch<SetStateAction<clientDataInterface>>
};

export const clientDataCTX = createContext<clientDataCTXInterface>({} as clientDataCTXInterface);