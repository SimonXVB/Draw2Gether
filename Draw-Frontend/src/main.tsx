import { DrawingCanvas } from "./Components/DrawingCanvas"
import { JoinPage } from "./Components/JoinPage"
import { globalSettingsCTX } from "./Context/GlobalSettingsContext/globalSettingsCTX";
import { useContext } from "react"

export function Main() {
    const { globalSettings } = useContext(globalSettingsCTX);

    return (
        <>
            {!globalSettings.isJoined && <JoinPage/>}
            {globalSettings.isJoined && <DrawingCanvas/>}
        </>
    )
};