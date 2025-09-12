import { createContext, type Dispatch, type SetStateAction } from "react";

interface ClientsInterface {
    username: string,
    isHost: boolean,
    id: string
};

export interface ClientDataInterface {
    isJoined: boolean,
    isDisconnected: boolean,
    isConnecting: boolean,
    isHost: boolean,
    isKicked: boolean,
    roomName: string,
    username: string,
    password: string,
    clients: ClientsInterface[]
};

interface ClientDataCTXInterface {
    clientData: ClientDataInterface,
    setClientData: Dispatch<SetStateAction<ClientDataInterface>>
};

export const clientDataCTX = createContext<ClientDataCTXInterface>({} as ClientDataCTXInterface);