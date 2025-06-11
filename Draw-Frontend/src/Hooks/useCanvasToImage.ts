import { useContext } from "react";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";

export function useCanvasToImage() {
    const { drawingDataRef } = useContext(drawingCTX);

    function canvasToImage() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        canvas.width = 7000;
        canvas.height = 7000;

        drawingDataRef.current.forEach(drawing => {
            ctx.strokeStyle = drawing.color;
            ctx.lineWidth = drawing.size;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            drawing.coords.forEach(coord => {
                ctx.lineTo(coord.x + 3500, coord.y + 3500);
            });

            ctx.stroke();
            ctx.beginPath();
        });

        const img = canvas.toDataURL("image/png");

        const a = document.createElement("a");
        a.href = img
        a.download = "img";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return { canvasToImage };
};