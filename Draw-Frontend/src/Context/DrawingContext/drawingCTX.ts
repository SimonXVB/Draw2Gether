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
    drawingDataRef: React.RefObject<drawingInterface[]>,
    redoDataRef: React.RefObject<drawingInterface[]>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
};

export const drawingCTX = createContext<drawingCTXInterface>({} as drawingCTXInterface);