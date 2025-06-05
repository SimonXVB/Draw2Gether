import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { type serverEventInterface } from "../DrawingCanvas";

export function NotificationPopup({ setRoomEvent, roomEvent } : { setRoomEvent: Dispatch<SetStateAction<serverEventInterface>>, roomEvent: serverEventInterface}) {
    const timeoutRef = useRef<number>(0);
    const notiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(notiRef.current) {
            clearTimeout(timeoutRef.current);
            notiRef.current.style.left = "0%";

            timeoutRef.current = setTimeout(() => {
                notiRef.current!.style.left = "-100%";

                notiRef.current!.ontransitionend = () => {
                    setRoomEvent({} as serverEventInterface);
                };
            }, 5000);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomEvent]);

    return (
        <>
            {roomEvent.event && 
                <div ref={notiRef} className="fixed bottom-0 -left-full font-bold bg-red-400 px-2 py-1 rounded-tr-md text-white transition-all duration-300">
                    {roomEvent.event === "joined" && <div>{roomEvent.user} has joined the room!</div>}
                    {roomEvent.event === "left" && <div>{roomEvent.user} has left the room!</div>}
                    {roomEvent.event === "kicked" && <div>{roomEvent.user} has been kicked!</div>}
                    {roomEvent.event === "disconnected" && <div>{roomEvent.user} has been disconnected!</div>}
                </div>
            }
        </>
    )
};