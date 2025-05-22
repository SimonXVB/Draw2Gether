import { coordsCTX, type coordsCTXInterface } from "./coordsCTX";

export function CoordsCTXProvider({ children }: { children: React.ReactNode }) {
    const canvasCoords: coordsCTXInterface = {
        x: 0,
        y: 0,
        scale: 1
    };

    return (
        <coordsCTX.Provider value={canvasCoords}>
            {children}
        </coordsCTX.Provider>
    )
};