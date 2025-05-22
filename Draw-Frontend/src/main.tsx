import { DrawingCanvas } from "./Components/DrawingCanvas"
import { CoordsCTXProvider } from "./Context/CoordsContext/CoordsCTXProvider"
import { SelectionCTXProvider } from "./Context/SelectionContext/SelectionCTXProvider"

export function Main() {
    return (
        <CoordsCTXProvider>
        <SelectionCTXProvider>
            <DrawingCanvas/>
        </SelectionCTXProvider>
        </CoordsCTXProvider>
    )
};