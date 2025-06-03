import { useContext, useEffect } from "react"
import { clientDataCTX } from "../../Context/ClientData/clientDataCTX";

export function ErrorPopup() {
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
        {(clientData.isKicked || clientData.isDisconnected) &&
            <div className="fixed top-0 left-0 font-bold bg-red-400 px-2 py-1 m-2 rounded-md text-white shadow-xl shadow-gray-400">
                {clientData.isKicked && <div>You have been kicked!</div>}
                {clientData.isDisconnected && <div>You have been disconnected!</div>}
            </div>
        }
        </>
    )
};