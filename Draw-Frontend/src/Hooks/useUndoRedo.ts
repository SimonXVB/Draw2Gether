import { useContext } from "react";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";
import { useRenderCanvas } from "./useRenderCanvas";

export function useUndoRedo() {
    const { drawingDataRef, redoDataRef } = useContext(drawingCTX);
    const { render } = useRenderCanvas();

    function undo() {
        const undoEl = drawingDataRef.current.pop();

        if(!undoEl) return;

        redoDataRef.current.push(undoEl);

        render();
    };

    function redo() {
        const redoEl = redoDataRef.current.pop();

        if(!redoEl) return;

        drawingDataRef.current.push(redoEl);

        render();
    };

    return { undo, redo };
};