import { createContext } from "react";

export interface coordsCTXInterface {
    x: number,
    y: number,
    scale: number,
    isZooming: boolean
};

export const coordsCTX = createContext<coordsCTXInterface>({} as coordsCTXInterface);