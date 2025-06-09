import { useContext, useEffect, type Dispatch, type SetStateAction } from "react"
import { globalSettingsCTX } from "../Context/GlobalSettingsContext/globalSettingsCTX"
import { useUndoRedo } from "../Hooks/useUndoRedo";
import { type drawingInterface } from "../Context/DrawingContext/drawingCTX";
import { useRenderCanvas } from "../Hooks/useRenderCanvas";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";
import { socket } from "../socket";

export function Toolbar({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const { globalSettings, setGlobalSettings } = useContext(globalSettingsCTX);
    const { drawingDataRef, redoDataRef } = useContext(drawingCTX);

    const { undo, redo } = useUndoRedo();
    const { render } = useRenderCanvas();

    function setColor(e: React.ChangeEvent<HTMLInputElement>) {
        setGlobalSettings(prev => {
            return {
                ...prev,
                color: e.target.value
            }
        });
    };

    function setSize(e: React.ChangeEvent<HTMLInputElement>) {
        setGlobalSettings(prev => {
            return {
                ...prev,
                size: Number(e.target.value)
            }
        });
    };

    function setMode() {
        setGlobalSettings(prev => {
            return {
                ...prev,
                mode: globalSettings.mode === "erase" ? "draw" : "erase"
            }
        });
    };

    function sendUndo() {
        socket.emit("sendUndo");
        undo();
    };

    function sendRedo() {
        socket.emit("sendRedo");
        redo();
    };

    function setNewData(data: { drawingData: drawingInterface[], redoData: drawingInterface[] }) {
        drawingDataRef.current = data.drawingData;
        redoDataRef.current = data.redoData;
        render();
    };

    useEffect(() => {
        socket.on("receiveUndo", setNewData);
        socket.on("receiveRedo", setNewData);

        return () => {
            socket.off("receiveUndo", setNewData);
            socket.off("receiveRedo", setNewData);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed flex justify-center top-0 left-0 w-screen">
            <div className="flex items-center font-bold p-3 bg-red-400 gap-2 rounded-b-md overflow-x-scroll">
                <button className="flex justify-center cursor-pointer bg-red-400 p-3 rounded-md hover:bg-white hover:*:fill-red-400" onClick={() => setMenuOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fff" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                </button>
                <div className="w-0.5 bg-white h-full"></div>
                <input type="color" id="toolbar-color" onChange={e => setColor(e)}/>
                <div className="flex justify-between items-center gap-2 min-w-[300px]">
                    <input type="range" id="toolbar-slider" min={1} max={500} step={1} defaultValue={globalSettings.size} onChange={e => setSize(e)} className="w-[80%] cursor-pointer"/>
                    <span className="text-white">{globalSettings.size}px</span>
                </div>
                <div className="w-0.5 bg-white h-full"></div>
                <button className="flex justify-center cursor-pointer bg-red-400 p-3 rounded-md hover:bg-white hover:*:fill-red-400" onClick={setMode}>
                    {globalSettings.mode === "erase" ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fff" viewBox="0 0 16 16">
                            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fff" viewBox="0 0 16 16">
                            <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04"/>
                        </svg>
                    }
                </button>
                <div className="flex gap-2 *:bg-red-400 *:p-3 *:rounded-md *:w-full *:cursor-pointer *:hover:bg-white">
                    <button onClick={sendUndo} className="hover:*:fill-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fff" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                        </svg>
                    </button>
                    <button onClick={sendRedo} className="hover:*:fill-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fff" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
};