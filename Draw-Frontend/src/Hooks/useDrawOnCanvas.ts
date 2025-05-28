import { useContext } from "react";
import { selectionCTX } from "../Context/SelectionContext/selectionCTX";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";
import { drawingCTX, type drawingInterface } from "../Context/DrawingContext/drawingCTX";
import { socket } from "../socket";

export function useDrawOnCanvas() {
    const { currentSelection } = useContext(selectionCTX);
    const { scale, x, y } = useContext(coordsCTX);
    const { drawingInfoRef } = useContext(drawingCTX);

    const currentDrawingInfo: drawingInterface = {
        color: currentSelection.mode === "draw" ? currentSelection.color : "#ffffff",
        size: currentSelection.size,
        coords: []
    };

    function mouseDrawOnCanvas(e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")!;

        ctx.strokeStyle = currentSelection.mode === "draw" ? currentSelection.color : "#ffffff";
        ctx.lineWidth = currentSelection.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.lineTo((e.clientX - x) / scale, (e.clientY - y) / scale);
        ctx.stroke();

        currentDrawingInfo.coords.push({
            x: (e.clientX - x) / scale, 
            y: (e.clientY - y) / scale
        });
    };

    function touchDrawOnCanvas(e: React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")!;

        ctx.strokeStyle = currentSelection.mode === "draw" ? currentSelection.color : "#ffffff";
        ctx.lineWidth = currentSelection.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.lineTo((e.touches[0].clientX - x) / scale, (e.touches[0].clientY - y) / scale);
        ctx.stroke();

        currentDrawingInfo.coords.push({
            x: (e.touches[0].clientX - x) / scale, 
            y: (e.touches[0].clientY - y) / scale
        });
    };

    function stopDrawing(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        drawingInfoRef.current.push(currentDrawingInfo);

        socket.emit("pushDrawingInfo", currentDrawingInfo);
    };

    return { mouseDrawOnCanvas, touchDrawOnCanvas, stopDrawing };
};