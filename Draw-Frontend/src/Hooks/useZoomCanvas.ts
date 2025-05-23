import { useContext } from "react";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";
import { useRenderCanvas } from "./useRenderCanvas";

export function useZoomCanvas() {
    const { render } = useRenderCanvas();
    const coordsContext = useContext(coordsCTX);

    function mouseZoomCanvas(e: WheelEvent, canvas: HTMLCanvasElement) {
        if(e.deltaY > 0 && coordsContext.scale > 0.1) {
            coordsContext.scale -= 0.05;
        } else if(e.deltaY < 0) {
            coordsContext.scale += 0.05;
        };

        render(canvas);
    };

    function touchZoomCanvas(action: string, canvas: HTMLCanvasElement) {
        if(action === "minus" && coordsContext.scale > 0.1) {
            coordsContext.scale -= 0.01;
        } else if(action === "plus") {
            coordsContext.scale += 0.01;
        };

        render(canvas);
    };

    function getDistance(e: TouchEvent) {
        return Math.sqrt(Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) + Math.sqrt(Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)));
    };

    function addZoomListeners(canvas: HTMLCanvasElement) {
        canvas.addEventListener("wheel", e => {
            mouseZoomCanvas(e, canvas);
        });

        let startDistance: number;

        canvas.addEventListener("touchstart", e => {
            if(e.touches.length === 2) {
                startDistance = getDistance(e);
            };
        });

        canvas.addEventListener("touchmove", e => {
            if(e.touches.length === 2) {
                const distance = getDistance(e);

                if(distance > startDistance) {
                    touchZoomCanvas("plus", canvas);
                } else if (distance < startDistance) {
                    touchZoomCanvas("minus", canvas);
                };

                startDistance = distance;
            };
        });
    };

    return { addZoomListeners };
};