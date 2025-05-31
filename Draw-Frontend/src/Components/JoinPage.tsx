import { useContext, useEffect, useRef, useState } from "react";
import { clientDataCTX } from "../Context/ClientData/clientDataCTX";
import { socket } from "../socket";

export function JoinPage() {
    const { setClientData, clientData } = useContext(clientDataCTX);

    const [roomInput, setRoomInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [usernameInput, setUsernameInput] = useState<string>(clientData.username);
    const [error, setError] = useState<string>("");

    const errorTimeoutRef = useRef<number>(0);

    function joinRoom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        socket.emit("joinRoom", {
            roomName: roomInput,
            password: passwordInput,
            username: usernameInput
        });
    };

    function setIsJoined(data: { roomName: string, username: string, clients: string[] }) {
        setClientData(prev => ({
            ...prev,
            isJoined: true,
            roomName: data.roomName,
            username: data.username,
            clients: data.clients
        }));
    };

    function setGeneralError(error: string) {
        clearTimeout(errorTimeoutRef.current);
        setError(error);

        errorTimeoutRef.current = setTimeout(() => {
            setError("");
        }, 5000);
    };

    useEffect(() => {
        socket.on("joinError", setGeneralError);
        socket.on("joinedRoom", setIsJoined);

        return () => {
            socket.off("emptyInputs", setGeneralError);
            socket.off("joinedRoom", setIsJoined);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-5xl font-black mb-8">Join Page</h1>
            <form onSubmit={e => joinRoom(e)}>
                <input type="text" placeholder="Input username" onChange={e => setUsernameInput(e.target.value)} defaultValue={clientData.username} className="w-full"/>
                <div>
                    <input type="text" placeholder="Input room name" onChange={e => setRoomInput(e.target.value)}/>
                    <input type="text" placeholder="Input password" onChange={e => setPasswordInput(e.target.value)}/>
                </div>
                <button type="submit">Join Room</button>
            </form>
            {error === "password" && <div>Incorrect Password</div>}
            {error === "empty" && <div>One or more fields are empty</div>}
        </div>
    );
};