import { DrawingCanvas } from "./Components/DrawingCanvas/DrawingCanvas"
import { JoinPage } from "./Components/JoinPage/JoinPage"
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