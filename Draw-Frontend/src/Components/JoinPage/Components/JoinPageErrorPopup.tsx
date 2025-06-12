import { useContext, useEffect } from "react"
import { clientDataCTX } from "../../../Context/ClientDataContext/clientDataCTX";

export function JoinPageErrorPopup() {
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
            {(clientData.isKicked || clientData.isDisconnected) &&
                <div className="fixed bottom-0 left-0 font-bold px-2 py-1 rounded-tr-md text-white bg-red-400">
                    {clientData.isKicked && <div>You have been kicked!</div>}
                    {clientData.isDisconnected && <div>Connection to server lost!</div>}
                </div>
            }
        </>
    )
};