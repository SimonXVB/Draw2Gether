import { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { globalSettingsCTX, type globalSettingsInterface } from "../Context/GlobalSettingsContext/globalSettingsCTX";

export function JoinPage() {
    const [roomInput, setRoomInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");

    const { setGlobalSettings } = useContext(globalSettingsCTX);

    function joinRoom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(roomInput === "" || passwordInput === "") return;

        socket.emit("joinRoom", {
            roomName: roomInput,
            password: passwordInput
        });
    };

    function setIsJoined(data: globalSettingsInterface) {
        setGlobalSettings(prev => ({
            ...prev,
            isJoined: data.isJoined
        }));
    };

    useEffect(() => {
        socket.on("joinedRoom", setIsJoined);

        return () => {
            socket.off("joinedRoom", setIsJoined);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h1>Join Page</h1>
            <form onSubmit={e => joinRoom(e)}>
                <input type="text" placeholder="Input room name" onChange={e => setRoomInput(e.target.value)}/>
                <input type="text" placeholder="Input password" onChange={e => setPasswordInput(e.target.value)}/>
                <button type="submit">Join Room</button>
            </form>
        </>
    );
};