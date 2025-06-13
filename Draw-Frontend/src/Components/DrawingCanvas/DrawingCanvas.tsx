import { useContext, useEffect, useRef, useState } from "react"
import { useRenderCanvas } from "../../Hooks/useRenderCanvas";
import { usePanCanvas } from "../../Hooks/usePanCanvas";
import { useZoomCanvas } from "../../Hooks/useZoomCanvas";
import { useDrawOnCanvas } from "../../Hooks/useDrawOnCanvas";
import { useUndoRedo } from "../../Hooks/useUndoRedo";
import { Toolbar } from "../Toolbar/Toolbar";
import { MenuModal } from "../MenuModal/MenuModal";
import { NotificationPopup } from "./Components/NotificationPopup";
import { drawingCTX, type drawingInterface } from "../../Context/DrawingContext/drawingCTX";
import { clientDataCTX } from "../../Context/ClientDataContext/clientDataCTX";
import { socket } from "../../socket";

export interface roomEventInterface {
    event: string,
    user: string
};

export function DrawingCanvas() {
    const initialEmitRef = useRef<boolean>(true);
    const roomEvent = useRef<roomEventInterface>({
        event: "",
        user: ""
    });

    const [menuOpen, setMenuOpen] = useState(false);

    const { drawingDataRef, redoDataRef, canvasRef } = useContext(drawingCTX);
    const { setClientData } = useContext(clientDataCTX);

    const { render } = useRenderCanvas();
    const { startMousePan, startTouchPan, mousePan, touchPan, stopPan } = usePanCanvas();
    const { mouseZoom, startTouchZoom, touchZoom } = useZoomCanvas();
    const { startDrawing, mouseDraw, touchDraw, stopDrawing } = useDrawOnCanvas();
    const { keyboardUndo, keyboardRedo } = useUndoRedo();

    //Socket.io functions
    function getInitialData() {
        socket.emit("getInitialData", (data: { drawingData: drawingInterface[], redoData: drawingInterface[] }) => {
            drawingDataRef.current = data.drawingData;
            redoDataRef.current = data.redoData;
            render();
        });
    };

    function setNewData(data: { drawingData: drawingInterface[], redoData: drawingInterface[] }) {
        drawingDataRef.current = data.drawingData;
        redoDataRef.current = data.redoData;
        render();
    };

    function setNewHost() {
        setClientData(prev => {
            return {
                ...prev,
                isHost: true
            }
        });
    };

    function updataRoom(data: { clients: [], user: string, event: string }) {
        setClientData(prev => {
            return {
                ...prev,
                clients: data.clients
            }
        });

        roomEvent.current = {
            event: data.event,
            user: data.user
        };
    };

    function roomDisconnect() {
        drawingDataRef.current = [];
        redoDataRef.current = [];
        
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
        drawingDataRef.current = [];
        redoDataRef.current = [];

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
        if(initialEmitRef.current === true) {
            getInitialData();
        };

        socket.on("receiveNewData", setNewData);
        socket.on("receiveUndo", setNewData);
        socket.on("receiveRedo", setNewData);
        socket.on("roomEvent", updataRoom);
        socket.on("hostChange", setNewHost);
        socket.on("disconnect", roomDisconnect);
        socket.on("kickUserClient", kickUserClient);

        return () => {
            initialEmitRef.current = false;

            socket.off("receiveNewData", setNewData);
            socket.off("receiveUndo", setNewData);
            socket.off("receiveRedo", setNewData);
            socket.off("roomEvent", updataRoom);
            socket.off("hostChange", setNewHost);
            socket.off("disconnect", roomDisconnect);
            socket.off("kickUserClient", kickUserClient);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Toolbar setMenuOpen={setMenuOpen}/>
            <canvas ref={ref => {canvasRef.current = ref}} width={window.innerWidth} height={window.innerHeight} tabIndex={1} className="fixed bottom-0 outline-2 outline-red-400"
                onMouseDown={e => {startMousePan(e); startDrawing(e)}}
                onMouseMove={e => {mousePan(e); mouseDraw(e)}}
                onMouseUp={() => {stopPan(); stopDrawing()}}
                onMouseLeave={() => {stopPan(); stopDrawing()}}
                onWheel={e => mouseZoom(e)}

                onKeyDown={e => {if(!menuOpen) {keyboardUndo(e); keyboardRedo(e)}}}

                onTouchStart={e => {startTouchPan(e); startTouchZoom(e); startDrawing(e)}}
                onTouchMove={e => {touchPan(e); touchZoom(e); touchDraw(e)}}
                onTouchEnd={() => {stopPan(); stopDrawing()}}
            ></canvas>
            <MenuModal setMenuOpen={setMenuOpen} menuOpen={menuOpen}/>
            <NotificationPopup roomEvent={roomEvent}/>
        </>
    )
};