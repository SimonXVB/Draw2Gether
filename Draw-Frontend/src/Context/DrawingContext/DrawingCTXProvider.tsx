import { useRef } from "react"
import { drawingCTX, type drawingInterface } from "./drawingCTX"

export function DrawingCTXProvider({ children }: { children: React.ReactNode}) {
    const drawingInfoRef = useRef<drawingInterface[]>([]);
    const redoArrRef = useRef<drawingInterface[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <drawingCTX.Provider value={{drawingInfoRef, redoArrRef, canvasRef}}>
            {children}
        </drawingCTX.Provider>
    )
};