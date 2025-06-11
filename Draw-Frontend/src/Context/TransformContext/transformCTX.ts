import { createContext } from "react";

export interface transformInterface {
    x: number,
    y: number,
    scale: number
};

export const transformCTX = createContext<transformInterface>({} as transformInterface);