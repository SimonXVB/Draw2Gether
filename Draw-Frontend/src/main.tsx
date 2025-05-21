import { DrawingCanvas } from "./Components/DrawingCanvas"
import { CoordsCTXProvider } from "./Context/CoordsContext/CoordsCTXProvider"

export function Main() {
    return (
        <CoordsCTXProvider>
            <DrawingCanvas/>
        </CoordsCTXProvider>
    )
};