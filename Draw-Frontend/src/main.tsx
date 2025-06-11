import { DrawingCanvas } from "./Components/DrawingCanvas"
import { JoinPage } from "./Components/JoinPage"
import { clientDataCTX } from "./Context/ClientDataContext/clientDataCTX";
import { useContext } from "react"

export function Main() {
    const { clientData } = useContext(clientDataCTX);

    return (
        <>
            {!clientData.isJoined && <JoinPage/>}
            {clientData.isJoined && <DrawingCanvas/>}
        </>
    )
};