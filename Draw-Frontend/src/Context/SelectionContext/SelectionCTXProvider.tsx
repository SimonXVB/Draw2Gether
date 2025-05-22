import { useState } from "react"
import { selectionCTX, type currentSelectionInterface } from "./selectionCTX"

export function SelectionCTXProvider({children}: {children: React.ReactNode}) {
    const [currentSelection, setCurrentSelection] = useState<currentSelectionInterface>({
        color: "#000000",
        size: 10,
        mode: "draw"
    });

    return (
        <selectionCTX.Provider value={{currentSelection, setCurrentSelection}}>
            {children}
        </selectionCTX.Provider>
    )
};