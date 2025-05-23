import { useContext } from "react";
import { useRenderCanvas } from "./useRenderCanvas";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";

export function usePanCanvas() {
    const { render } = useRenderCanvas();
    const coordsContext = useContext(coordsCTX);

    let prevX = 0;
    let prevY = 0;

    function mousePanCanvas(e: MouseEvent, canvas: HTMLCanvasElement) {
        coordsContext.x += e.clientX - prevX;
        coordsContext.y += e.clientY - prevY;

        render(canvas);

        prevX = e.clientX;
        prevY = e.clientY;
    };

    function touchPanCanvas(e: TouchEvent, canvas: HTMLCanvasElement) {
        coordsContext.x += e.touches[0].clientX - prevX;
        coordsContext.y += e.touches[0].clientY - prevY;

        render(canvas);

        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
    };

    function addPanListeners(canvas: HTMLCanvasElement) {
        let isDown = false;

        // Mouse Event Listeners
        canvas.addEventListener("mousedown", e => {
            if(e.button === 1) {
                prevX = e.clientX;
                prevY = e.clientY;
                
                isDown = true;
            };
        });

        canvas.addEventListener("mousemove", e => {
            if(isDown) {
                mousePanCanvas(e, canvas);
            };
        });

        canvas.addEventListener("mouseup", () => {
            isDown = false;
        });
        // Mouse Event Listeners

        //Touch Event Listeners
        canvas.addEventListener("touchstart", e => {
            if(e.touches.length === 2) {
                prevX = e.touches[0].clientX;
                prevY = e.touches[0].clientY;

                isDown = true;
            };
        });

        canvas.addEventListener("touchmove", e => {
            if(isDown) {
                touchPanCanvas(e, canvas);
            };
        });

        canvas.addEventListener("touchend", () => {
            isDown = false;
        });
        //Touch Event Listeners
    };

    return { addPanListeners };
};