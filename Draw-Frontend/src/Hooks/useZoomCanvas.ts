import { useContext } from "react";
import { transformCTX } from "../Context/TransformContext/transformCTX";
import { useRenderCanvas } from "./useRenderCanvas";

export function useZoomCanvas() {
    const { zoomCanvas } = useRenderCanvas();

    const transformContext = useContext(transformCTX);

    let startDistance: number;

    function getDistance(e: React.TouchEvent<HTMLCanvasElement>) {
        return Math.sqrt(Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) + Math.sqrt(Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)));
    };

    function mouseZoom(e: React.WheelEvent<HTMLCanvasElement>) {
        if(e.deltaY > 0 && transformContext.scale > 0.1) {
            zoomCanvas(Math.round((transformContext.scale - 0.1) * 100) / 100);
        } else if(e.deltaY < 0) {
            zoomCanvas(Math.round((transformContext.scale + 0.1) * 100) / 100);
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
                zoomCanvas(Math.round((transformContext.scale + 0.05) * 100) / 100);
            } else if (distance < startDistance && transformContext.scale > 0.1) {
                zoomCanvas(Math.round((transformContext.scale - 0.05) * 100) / 100);
            };

            startDistance = distance;
        };
    };

    return { mouseZoom, startTouchZoom, touchZoom };
};