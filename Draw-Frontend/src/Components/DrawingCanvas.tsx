import { useContext, useEffect, useRef, useState } from "react"
import { useRenderCanvas } from "../Hooks/useRenderCanvas";
import { usePanCanvas } from "../Hooks/usePanCanvas";
import { useZoomCanvas } from "../Hooks/useZoomCanvas";
import { useDrawOnCanvas } from "../Hooks/useDrawOnCanvas";
import { Toolbar } from "./Toolbar";
import { MenuModal } from "./Individuals/MenuModal";
import { NotificationPopup } from "./Individuals/NotificationPopup";
import { drawingCTX, type drawingInterface } from "../Context/DrawingContext/drawingCTX";
import { clientDataCTX } from "../Context/ClientData/clientDataCTX";
import { socket } from "../socket";

export interface serverEventInterface {
    event: string,
    user: string
};

export function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const initialEmitRef = useRef<boolean>(true);
    
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [roomEvent, setRoomEvent] = useState<serverEventInterface>({} as serverEventInterface);

    const { drawingInfoRef, redoArrRef } = useContext(drawingCTX);
    const { setClientData } = useContext(clientDataCTX);

    const { render } = useRenderCanvas();
    const { addPanListeners } = usePanCanvas();
    const { addZoomListeners } = useZoomCanvas();
    const { mouseDrawOnCanvas, touchDrawOnCanvas, stopDrawing } = useDrawOnCanvas();

    function setStopDrawing() {
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

    function setHost() {
        setClientData(prev => {
            return {
                ...prev,
                isHost: true
            }
        });
    };

    function setNewClients(data: { clients: [], user: string, event: string }) {
        setClientData(prev => {
            return {
                ...prev,
                clients: data.clients
            }
        });

        setRoomEvent({
            event: data.event,
            user: data.user
        });
    };

    function RoomDisconnect() {
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

    function kickUserClient() {
        drawingInfoRef.current = [];
        redoArrRef.current = [];

        setClientData(prev => {
            return {
                ...prev,
                roomName: "",
                password: "",
                isJoined: false,
                isHost: false,
                isKicked: true,
                clients: []
            };
        });
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
        socket.on("disconnect", RoomDisconnect);
        socket.on("roomEvent", setNewClients);
        socket.on("kickUserClient", kickUserClient);
        socket.on("hostChange", setHost);

        return () => {
            initialEmitRef.current = false;

            socket.off("initialDataRequestHost", sendInitialDataHost);
            socket.off("receiveInitialData", setInitialData);
            socket.off("receiveNewData", setNewData);
            socket.off("disconnect", RoomDisconnect);
            socket.off("roomEvent", setNewClients);
            socket.off("kickUserClient", kickUserClient);
            socket.off("hostChange", setHost);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Toolbar canvas={canvasRef} setMenuOpen={setMenuOpen}/>
            <canvas ref={ref => {canvasRef.current = ref}} width={window.innerWidth} height={window.innerHeight} className="outline-2 outline-red-500"
                onMouseDown={e => e.button === 0 && setIsDrawing(true)}
                onMouseUp={setStopDrawing}
                onMouseMove={e => isDrawing && mouseDrawOnCanvas(e, canvasRef.current!)}

                onTouchStart={e => e.touches.length === 1 && setIsDrawing(true)}
                onTouchEnd={() => {stopDrawing(canvasRef.current!); setIsDrawing(false)}}
                onTouchMove={e => isDrawing && touchDrawOnCanvas(e, canvasRef.current!)}
            ></canvas>
            <MenuModal setMenuOpen={setMenuOpen} menuOpen={menuOpen}/>
            <NotificationPopup setRoomEvent={setRoomEvent} roomEvent={roomEvent}/>
        </>
    )
};