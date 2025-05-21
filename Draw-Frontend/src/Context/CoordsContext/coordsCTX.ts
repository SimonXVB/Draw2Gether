import { createContext } from "react";

export interface coordsCTXInterface {
    x: number,
    y: number,
    scale: number
};

export const coordsCTX = createContext<coordsCTXInterface>({} as coordsCTXInterface);