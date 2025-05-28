import { useContext } from "react";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";
import { useRenderCanvas } from "./useRenderCanvas";

export function useUndoRedo() {
    const { drawingInfoRef, redoArrRef } = useContext(drawingCTX);
    const { render } = useRenderCanvas();

    function undo(canvas: HTMLCanvasElement) {
        const undoEl = drawingInfoRef.current.pop();

        if(!undoEl) return;

        redoArrRef.current.push(undoEl);

        render(canvas);
    };

    function redo(canvas: HTMLCanvasElement) {
        const redoEl = redoArrRef.current.pop();

        if(!redoEl) return;

        drawingInfoRef.current.push(redoEl);

        render(canvas);
    };

    return { undo, redo };
};