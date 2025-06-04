import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { type serverEventInterface } from "../DrawingCanvas";

export function NotificationPopup({ setServerEvent, serverEvent } : { setServerEvent: Dispatch<SetStateAction<serverEventInterface>>, serverEvent: serverEventInterface}) {
    const timeoutRef = useRef<number>(0);
    const notiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(notiRef.current) {
            clearTimeout(timeoutRef.current);
            notiRef.current.style.left = "0%";

            timeoutRef.current = setTimeout(() => {
                notiRef.current!.style.left = "-100%";

                console.log("sfds")

                notiRef.current!.ontransitionend = () => {
                    setServerEvent({} as serverEventInterface);
                };
            }, 5000);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverEvent]);

    return (
        <>
            {serverEvent.event && 
                <div ref={notiRef} className="fixed bottom-0 -left-full font-bold bg-red-400 px-2 py-1 rounded-tr-md text-white transition-all duration-300">
                    {serverEvent.event === "joined" && <div>{serverEvent.user} has joined the room!</div>}
                    {serverEvent.event === "left" && <div>{serverEvent.user} has left the room!</div>}
                    {serverEvent.event === "kicked" && <div>{serverEvent.user} has been kicked!</div>}
                </div>
            }
        </>
    )
};