import { useContext } from "react";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";
import { useRenderCanvas } from "./useRenderCanvas";

export function useZoomCanvas() {
    const { render } = useRenderCanvas();

    const coordsContext = useContext(coordsCTX);

    let startDistance: number;

    function getDistance(e: React.TouchEvent<HTMLCanvasElement>) {
        return Math.sqrt(Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) + Math.sqrt(Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)));
    };

    function mouseZoom(e: React.WheelEvent<HTMLCanvasElement>) {
        if(e.deltaY > 0 && coordsContext.scale > 0.1) {
            coordsContext.scale = Math.round((coordsContext.scale - 0.1) * 100) / 100;
            render();
        } else if(e.deltaY < 0) {
            coordsContext.scale = Math.round((coordsContext.scale + 0.1) * 100) / 100;
            render();
        };
    };

    function startTouchZoom(e: React.TouchEvent<HTMLCanvasElement>) {
        if(e.touches.length === 2) {
            startDistance = getDistance(e);
        };
    };

    function touchZoom(e: React.TouchEvent<HTMLCanvasElement>) {
        if(e.touches.length === 2) {
            const distance = getDistance(e);

            if(distance > startDistance) {
                coordsContext.scale = Math.round((coordsContext.scale + 0.05) * 100) / 100;
            } else if (distance < startDistance && coordsContext.scale > 0.1) {
                coordsContext.scale = Math.round((coordsContext.scale - 0.05) * 100) / 100;
            };

            startDistance = distance;
            render();
        };
    };

    return { mouseZoom, startTouchZoom, touchZoom };
};