import { useContext, useState, type Dispatch, type SetStateAction } from "react"
import { globalSettingsCTX } from "../../Context/GlobalSettingsContext/globalSettingsCTX"
import { useUndoRedo } from "../../Hooks/useUndoRedo";
import { useRenderCanvas } from "../../Hooks/useRenderCanvas";
import { transformCTX } from "../../Context/TransformContext/transformCTX";
import { ToolbarButton } from "./Components/ToolbarButton";
import { ToolbarDivider } from "./Components/ToolbarDivder";

export function Toolbar({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [openSize, setOpenSize] = useState(false);

    const { globalSettings, setGlobalSettings } = useContext(globalSettingsCTX);
    const transformContext = useContext(transformCTX);

    const { undo, redo } = useUndoRedo();
    const { zoomCanvas, jumpToOrigin } = useRenderCanvas();

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

    return (
        <>
            <div className="fixed flex justify-center top-0 w-screen z-10">
                <div className="flex items-center font-bold p-3 bg-red-400 gap-2 rounded-b-md overflow-x-scroll no-scrollbar">
                    <ToolbarButton title={"Menu"} onclick={() => setMenuOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                    </ToolbarButton>
                    <ToolbarDivider/>
                    <input type="color" id="toolbar-color" defaultValue={globalSettings.color} onChange={e => setColor(e)} title="Color"/>
                    <div className="relative">
                        <ToolbarButton title={"Size"} onclick={() => setOpenSize(!openSize)} style={`${openSize && "bg-white *:fill-red-400"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                                <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04"/>
                            </svg>
                        </ToolbarButton>
                        {openSize &&
                            <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-400 rounded-md p-2 flex justify-between items-center gap-2 min-w-[300px]">
                                <input type="range" id="toolbar-slider" min={1} max={500} step={1} defaultValue={globalSettings.size} onChange={e => setSize(e)} className="w-[80%] cursor-pointer"/>
                                <span className="text-white">{globalSettings.size}px</span>
                            </div>
                        }
                    </div>
                    <ToolbarButton title={"Erase"} onclick={setMode} style={`${globalSettings.mode ==="erase" && "bg-white *:fill-red-400"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>
                        </svg>
                    </ToolbarButton>
                    <ToolbarDivider/>
                    <ToolbarButton title={"Undo"} onclick={undo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton title={"Redo"} onclick={redo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton title={"Jump to 0,0"} onclick={jumpToOrigin}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707M15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707"/>
                        </svg>
                    </ToolbarButton>
                </div>
            </div>

            <div className="fixed bottom-0 right-0 flex flex-col gap-2 mr-2 mb-2 z-10 *:bg-red-400 *:p-2 *:rounded-md *:cursor-pointer *:outline-2 *:outline-red-400 *:hover:bg-white">
                <button onClick={() => zoomCanvas(transformContext.scale + 0.1)} className="hover:*:fill-red-400" title="Zoom In">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
                <button onClick={() => zoomCanvas(transformContext.scale - 0.1)} className="hover:*:fill-red-400" title="Zoom Out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                    </svg>
                </button>
            </div>
        </>
    )
};