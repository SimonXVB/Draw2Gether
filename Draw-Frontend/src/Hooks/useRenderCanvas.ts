import { useContext } from "react";
import { transformCTX } from "../Context/TransformContext/transformCTX";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";

export function useRenderCanvas() {
    const transformContext = useContext(transformCTX);
    const { drawingDataRef, canvasRef } = useContext(drawingCTX);

    function render() {
        const ctx = canvasRef.current!.getContext("2d")!;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.setTransform(transformContext.scale, 0, 0, transformContext.scale, transformContext.x, transformContext.y);

        drawingDataRef.current.forEach(drawing => {
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

        ctx.lineWidth = 25;
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(-3500, -3500, 7000, 7000);
    };

    function zoomCanvas(scale: number) {
        if(scale < 0.1) return;

        const oldX = transformContext.x;
        const oldY = transformContext.y;

        const halfX = canvasRef.current!.width / 2;
        const halfY = canvasRef.current!.height / 2;
        const previousScale = transformContext.scale;

        const newX = halfX - (halfX - oldX) * (scale / previousScale);
        const newY = halfY - (halfY - oldY) * (scale / previousScale);

        transformContext.x = newX;
        transformContext.y = newY;
        transformContext.scale = scale;

        render();
    };

    function jumpToOrigin() {
        transformContext.x = canvasRef.current!.width / 2;
        transformContext.y = canvasRef.current!.height / 2;

        render();
    };

    return { render, zoomCanvas, jumpToOrigin };
};