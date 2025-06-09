import { useRef } from "react"
import { drawingCTX, type drawingInterface } from "./drawingCTX"

export function DrawingCTXProvider({ children }: { children: React.ReactNode}) {
    const drawingDataRef = useRef<drawingInterface[]>([]);
    const redoDataRef = useRef<drawingInterface[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <drawingCTX.Provider value={{drawingDataRef, redoDataRef, canvasRef}}>
            {children}
        </drawingCTX.Provider>
    )
};