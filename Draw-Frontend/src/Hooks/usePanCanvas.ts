import { useContext } from "react";
import { useRenderCanvas } from "./useRenderCanvas";
import { transformCTX } from "../Context/TransformContext/transformCTX";

export function usePanCanvas() {
    const { render } = useRenderCanvas();
    const transformContext = useContext(transformCTX);

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
            transformContext.x += e.clientX - prevX;
            transformContext.y += e.clientY - prevY;

            render();

            prevX = e.clientX;
            prevY = e.clientY;
        };
    };

    function touchPan(e: React.TouchEvent<HTMLCanvasElement>) {
        if(isDown) {
            transformContext.x += e.touches[0].clientX - prevX;
            transformContext.y += e.touches[0].clientY - prevY;

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