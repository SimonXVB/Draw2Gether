import { useContext, useRef } from "react";
import { useRenderCanvas } from "./useRenderCanvas";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";

export function usePanCanvas() {
    const { render } = useRenderCanvas();
    const coordsContext = useContext(coordsCTX);

    const prevX = useRef<number>(0);
    const prevY = useRef<number>(0);

    function mousePanCanvas(e: MouseEvent, canvas: HTMLCanvasElement) {
        coordsContext.x += e.clientX - prevX.current;
        coordsContext.y += e.clientY - prevY.current;

        render(canvas);

        prevX.current = e.clientX;
        prevY.current = e.clientY;
    };

    function touchPanCanvas(e: TouchEvent, canvas: HTMLCanvasElement) {
        coordsContext.x += e.touches[0].clientX - prevX.current;
        coordsContext.y += e.touches[0].clientY - prevY.current;

        render(canvas);

        prevX.current = e.touches[0].clientX;
        prevY.current = e.touches[0].clientY;
    };

    function addPanListeners(canvas: HTMLCanvasElement) {
        let isDown = false;

        // Mouse Event Listeners
        canvas.addEventListener("mousedown", e => {
            prevX.current = e.clientX;
            prevY.current = e.clientY;

            if(e.button === 1) {
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
            prevX.current = e.touches[0].clientX;
            prevY.current = e.touches[0].clientY;

            if(e.touches.length === 2) {
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