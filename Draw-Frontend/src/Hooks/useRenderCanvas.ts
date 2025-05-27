import { useContext } from "react";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";

export function useRenderCanvas() {
    const coordsContext = useContext(coordsCTX);
    const { drawingInfo } = useContext(drawingCTX);

    function render(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")!;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(coordsContext.scale, 0, 0, coordsContext.scale, coordsContext.x, coordsContext.y);

        ctx.fillStyle = "#1ee825";
        ctx.fillRect(-10, -10, 20, 20);

        ctx.lineWidth = 20;
        ctx.fillStyle = "#000000";
        ctx.strokeRect(-3500, -3500, 7000, 7000);

        drawingInfo.forEach(drawing => {
            ctx.strokeStyle = drawing.color;
            ctx.lineWidth = drawing.size;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            drawing.coords.forEach(coord => {                          
                ctx.lineTo(coord.x, coord.y);
            });

            ctx.stroke();
            ctx.beginPath();
        });
    };

    return { render };
};