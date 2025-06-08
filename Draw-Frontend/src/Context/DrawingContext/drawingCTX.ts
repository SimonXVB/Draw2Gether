import { createContext } from "react";

interface drawingCoords {
    x: number,
    y: number
};

export interface drawingInterface {
    color: string,
    size: number,
    coords: drawingCoords[]
};

interface drawingCTXInterface {
    drawingInfoRef: React.RefObject<drawingInterface[]>,
    redoArrRef: React.RefObject<drawingInterface[]>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
};

export const drawingCTX = createContext<drawingCTXInterface>({} as drawingCTXInterface);