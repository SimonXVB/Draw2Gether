import { useRef } from "react";
import { coordsCTX, type coordsCTXInterface } from "./coordsCTX";

export function CoordsCTXProvider({ children }: { children: React.ReactNode }) {
    const canvasCoords = useRef<coordsCTXInterface>({
        x: 0,
        y: 0,
        scale: 1,
        isZooming: false
    });

    return (
        <coordsCTX.Provider value={canvasCoords.current}>
            {children}
        </coordsCTX.Provider>
    )
};