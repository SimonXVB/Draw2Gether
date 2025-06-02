import { useContext, useEffect, useRef, useState } from "react"
import { useRenderCanvas } from "../Hooks/useRenderCanvas";
import { usePanCanvas } from "../Hooks/usePanCanvas";
import { useZoomCanvas } from "../Hooks/useZoomCanvas";
import { useDrawOnCanvas } from "../Hooks/useDrawOnCanvas";
import { Toolbar } from "./Toolbar";
import { MenuModal } from "./Individuals/MenuModal";
import { globalSettingsCTX } from "../Context/GlobalSettingsContext/globalSettingsCTX";
import { coordsCTX } from "../Context/CoordsContext/coordsCTX";
import { drawingCTX, type drawingInterface } from "../Context/DrawingContext/drawingCTX";
import { clientDataCTX } from "../Context/ClientData/clientDataCTX";
import { socket } from "../socket";

export function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const initialEmitRef = useRef<boolean>(true);
    
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const { scale } = useContext(coordsCTX);
    const { globalSettings } = useContext(globalSettingsCTX);
    const { drawingInfoRef, redoArrRef } = useContext(drawingCTX);
    const { setClientData } = useContext(clientDataCTX);

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

    //Socket.io functions
    function sendInitialDataHost() {
        socket.emit("sendInitialDataHost", {
            drawingInfo: drawingInfoRef.current,
            redoArr: redoArrRef.current
        });
    };

    function setInitialData(data: { drawingInfo: drawingInterface[], redoArr: drawingInterface[] }) {
        drawingInfoRef.current = data.drawingInfo;
        redoArrRef.current = data.redoArr;

        render(canvasRef.current!);
    };

    function setNewData(newDrawingInfo: drawingInterface) {
        drawingInfoRef.current.push(newDrawingInfo);
        render(canvasRef.current!);
    };

    function setDisconnect() {
        drawingInfoRef.current = [];
        redoArrRef.current = [];
        
        setClientData(prev => {
            return {
                ...prev,
                isJoined: false,
                isDisconnected: true,
                isHost: false,
                roomName: "",
                password: "",
                clients: []
            }
        });
    };

    function setNewClients(clients: []) {
        setClientData(prev => {
            return {
                ...prev,
                clients: clients
            }
        });
    };

    function setHost() {
        setClientData(prev => {
            return {
                ...prev,
                isHost: true
            }
        });
    };

    function leaveRoom() {
        drawingInfoRef.current = [];
        redoArrRef.current = [];

        setClientData(prev => {
            return {
                ...prev,
                roomName: "",
                password: "",
                isJoined: false,
                isHost: false,
                clients: []
            };
        });

        socket.emit("leaveRoom");
    };

    useEffect(() => {
        addPanListeners(canvasRef.current!);
        addZoomListeners(canvasRef.current!);

        if(initialEmitRef.current === true) {
            socket.emit("initialDataReqClient");
        };

        socket.on("initialDataRequestHost", sendInitialDataHost);
        socket.on("receiveInitialData", setInitialData);
        socket.on("receiveNewData", setNewData);
        socket.on("disconnect", setDisconnect);
        socket.on("clientJoined", setNewClients);
        socket.on("clientLeave", setNewClients);
        socket.on("hostChange", setHost);
        socket.on("kickUserClient", leaveRoom);

        return () => {
            initialEmitRef.current = false;

            socket.off("initialDataRequestHost", sendInitialDataHost);
            socket.off("receiveInitialData", setInitialData);
            socket.off("receiveNewData", setNewData);
            socket.off("disconnect", setDisconnect);
            socket.off("clientJoined", setNewClients);
            socket.off("clientLeave", setNewClients);
            socket.off("hostChange", setHost);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Toolbar canvas={canvasRef}/>
            <canvas ref={ref => {canvasRef.current = ref}} width={window.innerWidth} height={window.innerHeight} className="outline-2 outline-red-500 cursor-none"
                onMouseDown={e => e.button === 0 && setIsDrawing(true)}
                onMouseUp={stopDraw}
                onMouseMove={e => addMouseMoveListeners(e)}
                onMouseOut={() => cursorRef.current!.style.display = "none"}

                onTouchStart={e => e.touches.length === 1 && setIsDrawing(true)}
                onTouchEnd={() => {stopDrawing(canvasRef.current!); setIsDrawing(false)}}
                onTouchMove={e => isDrawing && touchDrawOnCanvas(e, canvasRef.current!)}
            ></canvas>
            <div ref={cursorRef} className="fixed hidden rounded-full pointer-events-none z-10"></div>
            <MenuModal/>
        </>
    )
};