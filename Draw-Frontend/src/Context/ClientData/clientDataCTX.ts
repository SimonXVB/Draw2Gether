import { createContext, type Dispatch, type SetStateAction } from "react";

export interface clientDataInterface {
    isJoined: boolean,
    isDisconnected: boolean,
    roomName: string,
    username: string,
    clients: string[]
};

interface clientDataCTXInterface {
    clientData: clientDataInterface,
    setClientData: Dispatch<SetStateAction<clientDataInterface>>
};

export const clientDataCTX = createContext<clientDataCTXInterface>({} as clientDataCTXInterface);