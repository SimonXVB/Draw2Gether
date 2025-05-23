import { DrawingCanvas } from "./Components/DrawingCanvas"
import { CoordsCTXProvider } from "./Context/CoordsContext/CoordsCTXProvider"
import { SelectionCTXProvider } from "./Context/SelectionContext/SelectionCTXProvider"
import { DrawingContextProvider } from "./Context/DrawingContext/DrawingContextProvider"

export function Main() {
    return (
        <DrawingContextProvider>
        <CoordsCTXProvider>
        <SelectionCTXProvider>
            <DrawingCanvas/>
        </SelectionCTXProvider>
        </CoordsCTXProvider>
        </DrawingContextProvider>
    )
};