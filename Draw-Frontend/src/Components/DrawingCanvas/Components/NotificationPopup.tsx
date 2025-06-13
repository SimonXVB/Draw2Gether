import { useEffect, useRef } from "react";
import { type roomEventInterface } from "../DrawingCanvas";

export function NotificationPopup({ roomEvent } :  {roomEvent: React.RefObject<roomEventInterface>}) {
    const timeoutRef = useRef<number>(0);
    const notiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(notiRef.current) {
            clearTimeout(timeoutRef.current);
            notiRef.current.style.left = "0%";

            timeoutRef.current = setTimeout(() => {
                if(notiRef.current) {
                    notiRef.current!.style.left = "-100%";

                    notiRef.current!.ontransitionend = () => {
                        roomEvent.current = {} as roomEventInterface;
                    };
                } else {
                    roomEvent.current = {} as roomEventInterface;
                };
            }, 5000);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomEvent.current.event]);

    return (
        <>
            {roomEvent.current.event &&
                <div ref={notiRef} className="absolute bottom-0 -left-full z-10 font-bold bg-red-400 px-2 py-1 rounded-tr-md text-white transition-all duration-300">
                    {roomEvent.current.event === "joined" && <div>{roomEvent.current.user} has joined the room!</div>}
                    {roomEvent.current.event === "left" && <div>{roomEvent.current.user} has left the room!</div>}
                    {roomEvent.current.event === "kicked" && <div>{roomEvent.current.user} has been kicked!</div>}
                    {roomEvent.current.event === "disconnected" && <div>{roomEvent.current.user} has been disconnected!</div>}
                </div>
            }
        </>
    )
};