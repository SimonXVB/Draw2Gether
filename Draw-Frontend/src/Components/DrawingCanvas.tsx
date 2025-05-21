import { useEffect, useRef } from "react"
import { useRenderCanvas } from "../Hooks/useRenderCanvas";
import { usePanCanvas } from "../Hooks/usePanCanvas";
import { useZoomCanvas } from "../Hooks/useZoomCanvas";

export function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { render } = useRenderCanvas();
    const { addPanListeners } = usePanCanvas();
    const { addZoomListeners } = useZoomCanvas();

    useEffect(() => {
        addPanListeners(canvasRef.current!);
        addZoomListeners(canvasRef.current!);

        render(canvasRef.current!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="outline-2 outline-red-500"></canvas>
    )
};