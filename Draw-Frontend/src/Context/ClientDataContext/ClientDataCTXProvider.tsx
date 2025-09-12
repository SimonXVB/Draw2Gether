import { useState } from "react"
import { clientDataCTX, type ClientDataInterface } from "./clientDataCTX"

export function ClientDataCTXProvider({children}: {children: React.ReactNode}) {
    const [clientData, setClientData] = useState<ClientDataInterface>({
        isJoined: false,
        isDisconnected: false,
        isConnecting: true,
        isHost: false,
        isKicked: false,
        roomName: "",
        username: "",
        password: "",
        clients: []
    });

    return (
        <clientDataCTX.Provider value={{clientData, setClientData}}>
            {children}
        </clientDataCTX.Provider>
    )
};