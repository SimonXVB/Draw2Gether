import { useContext } from "react";
import { selectionCTX } from "../Context/SelectionContext/selectionCTX";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";

export function useDrawOnCanvas() {
    const { currentSelection } = useContext(selectionCTX);
    const { scale, x, y } = useContext(coordsCTX);

    function mouseDrawOnCanvas(e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) {        
        const ctx = canvas.getContext("2d")!;

        if(currentSelection.mode === "draw") {
            ctx.strokeStyle = currentSelection.color;
        } else if(currentSelection.mode === "erase") {
            ctx.strokeStyle = "#ffffff";
        };

        ctx.lineWidth = currentSelection.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.lineTo((e.clientX - x) / scale, (e.clientY - y) / scale);
        ctx.stroke();
    };

    function touchDrawOnCanvas(e: React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")!;

        if(currentSelection.mode === "draw") {
            ctx.strokeStyle = currentSelection.color;
        } else if(currentSelection.mode === "erase") {
            ctx.strokeStyle = "#ffffff";
        };

        ctx.lineWidth = currentSelection.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.lineTo((e.touches[0].clientX - x) / scale, (e.touches[0].clientY - y) / scale);
        ctx.stroke();
    };

    function stopDrawing(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");

        ctx!.beginPath();
        ctx!.stroke();
    };

    return { mouseDrawOnCanvas, touchDrawOnCanvas, stopDrawing };
};