import { useState } from "react"
import { clientDataCTX, type clientDataInterface } from "./clientDataCTX"

export function ClientDataCTXProvider({children}: {children: React.ReactNode}) {
    const [clientData, setClientData] = useState<clientDataInterface>({
        isJoined: false,
        isDisconnected: false,
        isHost: false,
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