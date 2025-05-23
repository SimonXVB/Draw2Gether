import { useContext } from "react";
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";
import { useRenderCanvas } from "./useRenderCanvas";

export function useUndoRedo() {
    const { drawingInfo, redoArr } = useContext(drawingCTX);
    const { render } = useRenderCanvas();

    function undo(canvas: HTMLCanvasElement) {
        const undoEl = drawingInfo.pop();

        if(undoEl === undefined) return;

        redoArr.push(undoEl);

        render(canvas);
    };

    function redo(canvas: HTMLCanvasElement) {
        const redoEl = redoArr.pop();

        if(redoEl === undefined) return;

        drawingInfo.push(redoEl);

        render(canvas);
    };

    return { undo, redo };
};