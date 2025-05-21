import { useContext } from "react";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";

export function useRenderCanvas() {
    const coordsContext = useContext(coordsCTX);

    function render(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")!;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(coordsContext.scale, 0, 0, coordsContext.scale, coordsContext.x, coordsContext.y);

        ctx.fillStyle = "#1ee825";
        ctx.fillRect(0, 0, 5, 5);

        ctx.fillStyle = "#ff1100";
        ctx.fillRect(100, 100, 200, 200);

        ctx.fillStyle = "#007bff";
        ctx.fillRect(500, 500, 200, 200);
    };

    return { render };
};