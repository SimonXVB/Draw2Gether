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
            <div className="fixed bottom-0 left-0 font-bold bg-red-400 px-2 py-1 rounded-tr-md text-white">
                {clientData.isKicked && <div>You have been kicked!</div>}
                {clientData.isDisconnected && <div>Connection to server lost!</div>}
            </div>
        }
        </>
    )
};