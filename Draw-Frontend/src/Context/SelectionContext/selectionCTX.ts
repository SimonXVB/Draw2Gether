import { createContext, type Dispatch, type SetStateAction } from "react";

type modeType = "draw" | "erase"

export interface currentSelectionInterface {
    color: string,
    size: number,
    mode: modeType
};

interface currentSelectionCTXInterface {
    currentSelection: currentSelectionInterface,
    setCurrentSelection: Dispatch<SetStateAction<currentSelectionInterface>>
};

export const selectionCTX = createContext<currentSelectionCTXInterface>({} as currentSelectionCTXInterface);