import { useContext } from "react";
import { globalSettingsCTX } from "../Context/GlobalSettingsContext/globalSettingsCTX";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";
import { drawingCTX, type drawingInterface } from "../Context/DrawingContext/drawingCTX";
import { socket } from "../socket";

export function useDrawOnCanvas() {
    const { globalSettings } = useContext(globalSettingsCTX);
    const coordsContext = useContext(coordsCTX);
    const { drawingInfoRef, canvasRef } = useContext(drawingCTX);

    let isDrawing: boolean = false;
    let currentDrawingInfo: drawingInterface = {} as drawingInterface;

    function startDrawing(e: React.MouseEvent | React.TouchEvent) {
        if((e as React.MouseEvent).button === 0 || (e as React.TouchEvent).touches && (e as React.TouchEvent).touches.length === 1) {
            isDrawing = true;
            currentDrawingInfo = {
                color: globalSettings.mode === "draw" ? globalSettings.color : "#ffffff",
                size: globalSettings.size,
                coords: []
            };
        };
    };

    function mouseDraw(e: React.MouseEvent<HTMLCanvasElement>) {
        if(isDrawing && e.button === 0) {
            const ctx = canvasRef.current!.getContext("2d")!;

            ctx.strokeStyle = globalSettings.mode === "draw" ? globalSettings.color : "#ffffff";
            ctx.lineWidth = globalSettings.size;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.lineTo((e.clientX - coordsContext.x) / coordsContext.scale, (e.clientY - coordsContext.y) / coordsContext.scale);
            ctx.stroke();

            currentDrawingInfo.coords.push({
                x: (e.clientX - coordsContext.x) / coordsContext.scale, 
                y: (e.clientY - coordsContext.y) / coordsContext.scale
            });
        };
    };

    function touchDraw(e: React.TouchEvent<HTMLCanvasElement>) {
        if(isDrawing && e.touches.length === 1) {
            const ctx = canvasRef.current!.getContext("2d")!;

            ctx.strokeStyle = globalSettings.mode === "draw" ? globalSettings.color : "#ffffff";
            ctx.lineWidth = globalSettings.size;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.lineTo((e.touches[0].clientX - coordsContext.x) / coordsContext.scale, (e.touches[0].clientY - coordsContext.y) / coordsContext.scale);
            ctx.stroke();

            currentDrawingInfo.coords.push({
                x: (e.touches[0].clientX - coordsContext.x) / coordsContext.scale, 
                y: (e.touches[0].clientY - coordsContext.y) / coordsContext.scale
            });
        };
    };

    function stopDrawing() {
        if(isDrawing && currentDrawingInfo.coords.length > 0) {
            const ctx = canvasRef.current!.getContext("2d")!;
            ctx.beginPath();

            drawingInfoRef.current.push(currentDrawingInfo);
            socket.emit("sendNewData", currentDrawingInfo);
        };
        isDrawing = false;
    };

    return { startDrawing, mouseDraw, touchDraw, stopDrawing };
};