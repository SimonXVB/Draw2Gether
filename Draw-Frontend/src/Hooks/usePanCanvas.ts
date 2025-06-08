import { useContext } from "react";
import { useRenderCanvas } from "./useRenderCanvas";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";

export function usePanCanvas() {
    const { render } = useRenderCanvas();
    const coordsContext = useContext(coordsCTX);

    let prevX = 0;
    let prevY = 0;
    let isDown = false;

    function startMousePan(e: React.MouseEvent<HTMLCanvasElement>) {
        if(e.button === 1) {
            prevX = e.clientX;
            prevY = e.clientY;
            
            isDown = true;
        };
    };

    function startTouchPan(e: React.TouchEvent<HTMLCanvasElement>) {
        if(e.touches.length === 2) {
            prevX = e.touches[0].clientX;
            prevY = e.touches[0].clientY;

            isDown = true;
        };
    };

    function mousePan(e: React.MouseEvent<HTMLCanvasElement>) {
        if(isDown) {
            coordsContext.x += e.clientX - prevX;
            coordsContext.y += e.clientY - prevY;

            render();

            prevX = e.clientX;
            prevY = e.clientY;
        };
    };

    function touchPan(e: React.TouchEvent<HTMLCanvasElement>) {
        if(isDown) {
            coordsContext.x += e.touches[0].clientX - prevX;
            coordsContext.y += e.touches[0].clientY - prevY;

            render();

            prevX = e.touches[0].clientX;
            prevY = e.touches[0].clientY;
        };
    };

    function stopPan() {
        isDown = false;
    };

    return { startMousePan, startTouchPan, mousePan, touchPan, stopPan };
};