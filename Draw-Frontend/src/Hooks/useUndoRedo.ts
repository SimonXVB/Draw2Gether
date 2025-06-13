import { useContext } from "react";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";
import { useRenderCanvas } from "./useRenderCanvas";
import { socket } from "../socket";

export function useUndoRedo() {
    const { drawingDataRef, redoDataRef } = useContext(drawingCTX);
    const { render } = useRenderCanvas();

    function undo() {
        const undoEl = drawingDataRef.current.pop();
        if(!undoEl) return;

        redoDataRef.current.push(undoEl);
        render();

        socket.emit("sendUndo");
    };

    function redo() {
        const redoEl = redoDataRef.current.pop();
        if(!redoEl) return;
        
        drawingDataRef.current.push(redoEl);
        render();

        socket.emit("sendRedo");
    };

    function keyboardUndo(e: React.KeyboardEvent<HTMLCanvasElement>) {
        if(e.ctrlKey && e.key === "z") {
            undo();
        };
    };

    function keyboardRedo(e: React.KeyboardEvent<HTMLCanvasElement>) {
        if(e.ctrlKey && e.key === "y") {
            redo();
        };
    };

    return { undo, redo, keyboardUndo, keyboardRedo };
};