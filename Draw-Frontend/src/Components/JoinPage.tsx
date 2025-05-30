import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { globalSettingsCTX } from "../Context/GlobalSettingsContext/globalSettingsCTX";

export function JoinPage() {
    const [roomInput, setRoomInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const errorTimeoutRef = useRef<number>(0);

    const { setGlobalSettings } = useContext(globalSettingsCTX);

    function joinRoom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(roomInput === "" || passwordInput === "") return;

        socket.emit("joinRoom", {
            roomName: roomInput,
            password: passwordInput
        });
    };

    function setIsJoined(data: { roomName: string, isHost: boolean }) {
        setGlobalSettings(prev => ({
            ...prev,
            isJoined: true,
            isHost: data.isHost,
            roomName: data.roomName
        }));
    };

    function setCredsError() {
        clearTimeout(errorTimeoutRef.current);
        setError(true);

        errorTimeoutRef.current = setTimeout(() => {
            setError(false);
        }, 5000);
    };

    useEffect(() => {
        socket.on("joinedRoom", setIsJoined);
        socket.on("incorrectCreds", setCredsError);

        return () => {
            socket.off("joinedRoom", setIsJoined);
            socket.off("incorrectCreds", setCredsError);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-5xl font-black mb-8">Join Page</h1>
            <form onSubmit={e => joinRoom(e)}>
                <input type="text" placeholder="Input room name" onChange={e => setRoomInput(e.target.value)}/>
                <input type="text" placeholder="Input password" onChange={e => setPasswordInput(e.target.value)}/>
                <button type="submit">Join Room</button>
            </form>
            {error && <div>Incorrect Password</div>}
        </div>
    );
};