import { useContext } from "react"
import { selectionCTX } from "../Context/SelectionContext/selectionCTX"
import { useUndoRedo } from "../Hooks/useUndoRedo";

export function Toolbar({ canvas }: { canvas: HTMLCanvasElement }) {
    const { setCurrentSelection, currentSelection } = useContext(selectionCTX);

    const { undo, redo } = useUndoRedo();

    function setColor(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSelection(prev => {
            return {
                ...prev,
                color: e.target.value
            }
        });
    };

    function setSize(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSelection(prev => {
            return {
                ...prev,
                size: Number(e.target.value)
            }
        });
    };

    function setMode() {
        setCurrentSelection(prev => {
            return {
                ...prev,
                mode: currentSelection.mode === "erase" ? "draw" : "erase"
            }
        });
    };

    return (
        <div className="fixed flex flex-col top-0 left-0 h-dvh px-3 font-[DynaPuff] bg-red-400/50 backdrop-blur-md w-[300px] gap-2 pt-2">
            <div>
                <p>Color:</p>
                <input type="color" className="w-full cursor-pointer" onChange={e => setColor(e)}/>
            </div>
            <div>
                <div className="flex justify-between">
                    <p>Size:</p>
                    <span>{currentSelection.size}px</span>
                </div>
                <input type="range" min={1} max={100} step={1} defaultValue={currentSelection.size} onChange={e => setSize(e)} className="w-full"/>
            </div>
            <div>
                <div className="flex justify-between">
                    <p>Mode:</p>
                    <p className="first-letter:capitalize">{currentSelection.mode}</p>
                </div>
                <button className="flex justify-center cursor-pointer w-full bg-red-400 outline-2 outline-red-400 py-1 rounded-md hover:bg-white hover:*:fill-red-400" onClick={setMode}>
                    {currentSelection.mode === "erase" ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 16 16">
                            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 16 16">
                            <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04"/>
                        </svg>
                    }
                </button>
            </div>
            <div className="flex gap-2 *:bg-red-400 *:p-2 *:rounded-md *:w-full *:cursor-pointer">
                <button onClick={() => undo(canvas)}>Undo</button>
                <button onClick={() => redo(canvas)}>Redo</button>
            </div>
        </div>
    )
};