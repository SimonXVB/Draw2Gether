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
    drawingInfo: drawingInterface[],
    redoArr: drawingInterface[]
};

export const drawingCTX = createContext<drawingCTXInterface>({} as drawingCTXInterface);