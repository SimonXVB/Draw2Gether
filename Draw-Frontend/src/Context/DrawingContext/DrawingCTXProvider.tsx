import { useRef } from "react"
import { drawingCTX, type drawingInterface } from "./drawingCTX"

export function DrawingCTXProvider({ children }: { children: React.ReactNode}) {
    const drawingInfoRef = useRef<drawingInterface[]>([]);
    const redoArrRef = useRef<drawingInterface[]>([]);

    return (
        <drawingCTX.Provider value={{drawingInfoRef, redoArrRef}}>
            {children}
        </drawingCTX.Provider>
    )
};