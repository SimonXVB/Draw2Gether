import { useContext, useEffect, useRef, useState } from "react"
import { useRenderCanvas } from "../Hooks/useRenderCanvas";
import { usePanCanvas } from "../Hooks/usePanCanvas";
import { useZoomCanvas } from "../Hooks/useZoomCanvas";
import { useDrawOnCanvas } from "../Hooks/useDrawOnCanvas";
import { Toolbar } from "./Toolbar";
import { globalSettingsCTX } from "../Context/GlobalSettingsContext/globalSettingsCTX";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";
import { drawingCTX, type drawingInterface } from "../Context/DrawingContext/drawingCTX";
import { socket } from "../socket";

export function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const { globalSettings } = useContext(globalSettingsCTX);
    const { scale } = useContext(coordsCTX);
    const { drawingInfoRef } = useContext(drawingCTX);

    const { render } = useRenderCanvas();
    const { addPanListeners } = usePanCanvas();
    const { addZoomListeners } = useZoomCanvas();
    const { mouseDrawOnCanvas, touchDrawOnCanvas, stopDrawing } = useDrawOnCanvas();

    function mouseCursor(e: React.MouseEvent) {
        const cursor = cursorRef.current!;

        cursor.style.display = "block";
        cursor.style.width = (globalSettings.size * scale) + "px";
        cursor.style.height = (globalSettings.size * scale) + "px";
        cursor.style.border = "1px solid" + globalSettings.color;

        cursor.style.top = (e.clientY - ((globalSettings.size * scale) / 2)) + "px";
        cursor.style.left = (e.clientX - ((globalSettings.size * scale) / 2)) + "px";
    };

    function addMouseMoveListeners(e: React.MouseEvent<HTMLCanvasElement>) {
        if(isDrawing) {
            mouseDrawOnCanvas(e, canvasRef.current!);
        };
        mouseCursor(e);
    };

    function stopDraw() {
        if(isDrawing) {
            stopDrawing(canvasRef.current!);
            setIsDrawing(false);
        };
    };

    // Socket.io functions
    function sendInitialData() {
        socket.emit("sendInitialData", drawingInfoRef.current);
        console.log("initial data sent");
    };

    function receiveInitialData(drawingData: drawingInterface[]) {
        drawingInfoRef.current = drawingData
        render(canvasRef.current!);
        console.log("initial data set");
    };

    function receiveNewData(drawingData: drawingInterface) {
        drawingInfoRef.current.push(drawingData);
        render(canvasRef.current!);
        console.log("new data set");
    };

    useEffect(() => {
        addPanListeners(canvasRef.current!);
        addZoomListeners(canvasRef.current!);
    
        socket.on("requestInitialData", sendInitialData);
        socket.on("receiveInitialData", receiveInitialData);
        socket.on("receiveNewData", receiveNewData);

        render(canvasRef.current!);

        return () => {
            socket.off("requestInitialData", sendInitialData);
            socket.off("receiveInitialData", receiveInitialData);
            socket.off("receiveNewData", receiveNewData);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Toolbar canvas={canvasRef}/>
            <canvas ref={node => {canvasRef.current = node}} width={window.innerWidth} height={window.innerHeight} className="outline-2 outline-red-500 cursor-none"
                onMouseDown={e => e.button === 0 && setIsDrawing(true)}
                onMouseUp={stopDraw}
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