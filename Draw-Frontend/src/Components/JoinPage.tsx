import { useContext, useEffect, useRef, useState } from "react";
import { clientDataCTX } from "../Context/ClientData/clientDataCTX";
import { JoinPageErrorPopup } from "./Individuals/JoinPageErrorPopup";
import { socket } from "../socket";

export function JoinPage() {
    const { setClientData, clientData } = useContext(clientDataCTX);
    const errorTimeoutRef = useRef<number>(0);

    const [usernameInput, setUsernameInput] = useState<string>(clientData.username);
    const [roomInput, setRoomInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");

    const [error, setError] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"join" | "create">("join");

    function joinRoom(e: React.FormEvent<HTMLFormElement>, type: "joinRoom" | "createRoom") {
        e.preventDefault();

        socket.emit(type, {
            roomName: roomInput,
            password: passwordInput,
            username: usernameInput
        });
    };

    function setClientJoinedData(data: { roomName: string, username: string, password: string, isHost: boolean, clients: [] }) {
        setClientData(prev => ({
            ...prev,
            isJoined: true,
            isHost: data.isHost,
            roomName: data.roomName,
            username: data.username,
            password: data.password,
            clients: data.clients
        }));
    };

    function JoinPageDisconnect() {
        setClientData(prev => {
            return {
                ...prev,
                isDisconnected: true
            }
        });
    };

    function setJoinError(error: string) {
        clearTimeout(errorTimeoutRef.current);
        setError(error);

        errorTimeoutRef.current = setTimeout(() => {
            setError("");
        }, 5000);
    };

    useEffect(() => {
        socket.on("joinError", setJoinError);
        socket.on("joinedRoom", setClientJoinedData);
        socket.on("connect_error", JoinPageDisconnect);

        return () => {
            socket.off("joinError", setJoinError);
            socket.off("joinedRoom", setClientJoinedData);
            socket.off("connect_error", JoinPageDisconnect);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-8">
            <h1 className="text-5xl font-black flex">
                <span className={`text-blue-400 flip-container ${activeTab === "create" && "flip"}`}>
                    <div className="front">Draw</div>
                    <div className="back">Create</div>
                </span>
                <span>2</span>
                <span className="text-red-400">Gether</span>
            </h1>
            <div>
                <form onSubmit={e => activeTab === "join" ? joinRoom(e, "joinRoom") : joinRoom(e, "createRoom")} className={`mb-4 text-white font-bold rounded-md p-10 transition-all duration-300 shadow-xl shadow-gray-400 ${activeTab === "join" ? "bg-blue-400" : "bg-red-400"}`}>
                    <div className="mb-8">
                        <div className="text-2xl">Username</div>
                        <input onChange={e => setUsernameInput(e.target.value)} defaultValue={usernameInput} className="px-1 border-2 border-white rounded-md"/>
                    </div>
                    <div className="mb-2">
                        <div>Room Name</div>
                        <input onChange={e => setRoomInput(e.target.value)} className="px-1 border-2 border-white rounded-md"/>
                    </div>
                    <div>
                        <div>Password</div>
                        <input onChange={e => setPasswordInput(e.target.value)} className="px-1 border-2 border-white rounded-md"/>
                    </div>
                    <button type="submit" className={`mt-4 font-black w-full rounded-md py-1 bg-white cursor-pointer hover:bg-gray-100 hover:scale-110 transition-all duration-300 ${activeTab === "join" ? "text-blue-400" : "text-red-400"}`}>{activeTab === "join" ? "Join Room" : "Create Room"}</button>
                </form>
                <div className={`${error ? "opacity-100" : "opacity-0"} text-center font-black text-red-400 h-6`}>
                    {error === "empty" && "One or more fields are empty."}
                    {error === "password" && "Incorrect Password"}
                    {error === "roomNotExists" && "A room with this name doesn't exist."}
                    {error === "roomExists" && "A room with this name already exists."}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <h1 className={`text-2xl font-black transition-all duration-300 ${activeTab === "join" && "scale-125 text-blue-400"}`}>Join</h1>
                <div id="toggleSwitchContainer">
                    <label htmlFor="check">
                        <input type="checkbox" name="check" id="check" onClick={(e) => setActiveTab(e.currentTarget.checked ? "create" : "join")}/>
                        <div id="toggle"></div>
                    </label>
                </div>
                <h1 className={`text-2xl font-black transition-all duration-300 ${activeTab === "create" && "scale-125 text-red-400"}`}>Create</h1>
            </div>
            <JoinPageErrorPopup/>
        </div>
    );
};