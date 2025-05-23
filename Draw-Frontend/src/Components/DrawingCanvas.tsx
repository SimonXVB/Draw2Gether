import { useContext, useEffect, useRef, useState } from "react"
import { useRenderCanvas } from "../Hooks/useRenderCanvas";
import { usePanCanvas } from "../Hooks/usePanCanvas";
import { useZoomCanvas } from "../Hooks/useZoomCanvas";
import { useDrawOnCanvas } from "../Hooks/useDrawOnCanvas";
import { Toolbar } from "./Toolbar";
import { selectionCTX } from "../Context/SelectionContext/selectionCTX";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";

export function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const { currentSelection } = useContext(selectionCTX);
    const { scale } = useContext(coordsCTX);

    const { render } = useRenderCanvas();
    const { addPanListeners } = usePanCanvas();
    const { addZoomListeners } = useZoomCanvas();
    const { mouseDrawOnCanvas, touchDrawOnCanvas, stopDrawing } = useDrawOnCanvas();

    function mouseCursor(e: React.MouseEvent) {
        const cursor = cursorRef.current!;

        cursor.style.display = "block";
        cursor.style.width = (currentSelection.size * scale) + "px";
        cursor.style.height = (currentSelection.size * scale) + "px";
        cursor.style.border = "1px solid" + currentSelection.color;

        cursor.style.top = (e.clientY - ((currentSelection.size * scale) / 2)) + "px";
        cursor.style.left = (e.clientX - ((currentSelection.size * scale) / 2)) + "px";
    };

    function addMouseMoveListeners(e: React.MouseEvent<HTMLCanvasElement>) {
        if(isDrawing) {
            mouseDrawOnCanvas(e, canvasRef.current!);
        };
        mouseCursor(e);
    };

    useEffect(() => {
        addPanListeners(canvasRef.current!);
        addZoomListeners(canvasRef.current!);

        render(canvasRef.current!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Toolbar canvas={canvasRef.current!}/>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="outline-2 outline-red-500 cursor-none"
                onMouseDown={e => e.button === 0 && setIsDrawing(true)}
                onMouseUp={() => {stopDrawing(canvasRef.current!); setIsDrawing(false)}}
                onMouseMove={e => addMouseMoveListeners(e)}
                onMouseOut={() => cursorRef.current!.style.display = "none"}

                onTouchStart={e => e.touches.length === 1 && setIsDrawing(true)}
                onTouchEnd={() => {stopDrawing(canvasRef.current!); setIsDrawing(false)}}
                onTouchMove={e => isDrawing && touchDrawOnCanvas(e, canvasRef.current!)}
            ></canvas>
            <div ref={cursorRef} className="fixed hidden rounded-full pointer-events-none z-10"></div>
        </>
    )
};