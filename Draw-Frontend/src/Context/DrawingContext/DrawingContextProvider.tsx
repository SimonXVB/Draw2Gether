import { useRef } from "react"
import { drawingCTX, type drawingInterface } from "./drawingCTX"

export function DrawingContextProvider({ children }: { children: React.ReactNode}) {
    const drawingInfo = useRef<drawingInterface[]>([]);

    return (
        <drawingCTX.Provider value={drawingInfo.current}>
            {children}
        </drawingCTX.Provider>
    )
};