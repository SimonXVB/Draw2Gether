import { useContext, useEffect } from "react"
import { clientDataCTX } from "../../../Context/ClientDataContext/clientDataCTX";

export function JoinPageNotification() {
    const { clientData, setClientData } = useContext(clientDataCTX);

    useEffect(() => {
        if(clientData.isKicked) {
            setTimeout(() => {
                setClientData(prev => {
                    return {
                        ...prev,
                        isKicked: false
                    }
                });
            }, 5000);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            {(clientData.isKicked || clientData.isDisconnected || clientData.isConnecting) &&
                <div className="fixed bottom-0 left-0 font-bold text-white">
                    {clientData.isKicked && <div className="bg-red-400 px-2 py-1 first:rounded-tr-md">You have been kicked!</div>}
                    {clientData.isConnecting && <div className="bg-yellow-500 px-2 py-1 first:rounded-tr-md">Connecting to server...</div>}
                    {clientData.isDisconnected && <div className="bg-red-400 px-2 py-1 first:rounded-tr-md">Connection to server lost!</div>}
                </div>
            }
        </>
    )
};