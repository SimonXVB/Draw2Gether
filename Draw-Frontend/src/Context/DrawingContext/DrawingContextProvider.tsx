import { useRef } from "react"
import { drawingCTX, type drawingInterface } from "./drawingCTX"

export function DrawingContextProvider({ children }: { children: React.ReactNode}) {
    const drawingInfoRef = useRef<drawingInterface[]>([]);
    const redoArrRef = useRef<drawingInterface[]>([]);

    const drawingInfo = drawingInfoRef.current;
    const redoArr = redoArrRef.current;

    return (
        <drawingCTX.Provider value={{drawingInfo, redoArr}}>
            {children}
        </drawingCTX.Provider>
    )
};