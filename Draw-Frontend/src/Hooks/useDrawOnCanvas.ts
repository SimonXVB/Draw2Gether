import { useContext } from "react";
import { globalSettingsCTX } from "../Context/GlobalSettingsContext/globalSettingsCTX";
import { transformCTX } from "../Context/TransformContext/transformCTX";
import { drawingCTX, type drawingInterface } from "../Context/DrawingContext/drawingCTX";
import { socket } from "../socket";

export function useDrawOnCanvas() {
    const { drawingDataRef, canvasRef } = useContext(drawingCTX);
    const { globalSettings } = useContext(globalSettingsCTX);
    const transformContext = useContext(transformCTX);

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

            const x = (e.clientX - transformContext.x) / transformContext.scale;
            const y = (e.clientY - transformContext.y) / transformContext.scale;

            if(x <= -(3500 - globalSettings.size / 2) || y <= -(3500 - globalSettings.size / 2) || x >= 3500 - (globalSettings.size / 2) || y >= 3500 - (globalSettings.size / 2)) {
                stopDrawing();
                startDrawing(e);
                return;
            };

            console.log("draw")

            ctx.lineTo(x, y);
            ctx.stroke();

            currentDrawingInfo.coords.push({
                x: x, 
                y: y
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

            const x = (e.touches[0].clientX - transformContext.x) / transformContext.scale;
            const y = (e.touches[0].clientY - transformContext.y) / transformContext.scale;

            if(x <= -(3500 - globalSettings.size / 2) || y <= -(3500 - globalSettings.size / 2) || x >= 3500 - (globalSettings.size / 2) || y >= 3500 - (globalSettings.size / 2)) {
                stopDrawing();
                startDrawing(e);
                return;
            };

            ctx.lineTo(x, y);
            ctx.stroke();

            currentDrawingInfo.coords.push({
                x: x, 
                y: y
            });
        };
    };

    function stopDrawing() {
        if(isDrawing && currentDrawingInfo.coords.length > 0) {
            const ctx = canvasRef.current!.getContext("2d")!;
            ctx.beginPath();

            drawingDataRef.current.push(currentDrawingInfo);
            socket.emit("sendNewData", currentDrawingInfo);
        };
        isDrawing = false;
    };

    return { startDrawing, mouseDraw, touchDraw, stopDrawing };
};