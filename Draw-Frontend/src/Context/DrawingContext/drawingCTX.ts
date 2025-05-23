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

export const drawingCTX = createContext<drawingInterface[]>([]);