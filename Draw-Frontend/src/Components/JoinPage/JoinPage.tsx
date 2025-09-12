import { useContext, useEffect, useRef, useState } from "react";
import { clientDataCTX } from "../../Context/ClientDataContext/clientDataCTX";
import { JoinPageNotification } from "./Components/JoinPageNotification";
import { socket } from "../../socket";

export function JoinPage() {
    const { setClientData, clientData } = useContext(clientDataCTX);
    
    const errorTimeoutRef = useRef<number>(0);

    const [usernameInput, setUsernameInput] = useState<string>(clientData.username);
    const [roomInput, setRoomInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"join" | "create">("join");

    function joinRoom(e: React.FormEvent<HTMLFormElement>, type: "joinRoom" | "createRoom") {
        e.preventDefault();

        socket.emit(type, {
            roomName: roomInput,
            password: passwordInput,
            username: usernameInput
        });

        setStatus("connecting");
    };

    function setClientJoinedData(data: { roomName: string, username: string, password: string, isHost: boolean, clients: [] }) {
        setStatus("");

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

    function setJoinError(error: string) {
        clearTimeout(errorTimeoutRef.current);
        setStatus(error);

        errorTimeoutRef.current = setTimeout(() => {
            setStatus("");
        }, 5000);
    };

    function joinPageDisconnect() {
        setClientData(prev => {
            return {
                ...prev,
                isDisconnected: true,
                isConnecting: false
            }
        });
    };

    function joinPageConnect() {
        setClientData(prev => {
            return {
                ...prev,
                isDisconnected: false,
                isConnecting: false
            }
        });
    };

    useEffect(() => {
        socket.on("joinError", setJoinError);
        socket.on("joinedRoom", setClientJoinedData);
        socket.on("connect_error", joinPageDisconnect);
        socket.on("connect", joinPageConnect);

        return () => {
            socket.off("joinError", setJoinError);
            socket.off("joinedRoom", setClientJoinedData);
            socket.off("connect_error", joinPageDisconnect);
            socket.off("connect", joinPageConnect);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-8">
            <h1 className={`text-5xl font-black flex transition-all duration-300 ${activeTab === "create" && "translate-x-[0.5ch]"}`}>
                <span className={`text-blue-400 flip-container ${activeTab === "create" && "flip"}`}>
                    <div className="front">Draw</div>
                    <div className="back" aria-hidden="true">Create</div>
                </span>
                <span>2</span>
                <span className="text-red-400">Gether</span>
            </h1>
            <div>
                <form onSubmit={e => activeTab === "join" ? joinRoom(e, "joinRoom") : joinRoom(e, "createRoom")} className={`mb-4 text-white font-bold rounded-md p-10 transition-all duration-300 shadow-xl shadow-gray-400 ${activeTab === "join" ? "bg-blue-400" : "bg-red-400"}`}>
                    <div className="mb-6">
                        <div className="text-2xl">Username</div>
                        <input onChange={e => setUsernameInput(e.target.value)} defaultValue={usernameInput} className="px-1 border-2 border-white rounded-md"/>
                        <div className="text-xs text-right">{usernameInput.length}/25</div>
                    </div>
                    <div className="-mb-2">
                        <div>Room Name</div>
                        <input onChange={e => setRoomInput(e.target.value)} className="px-1 border-2 border-white rounded-md"/>
                        <div className="text-xs text-right">{roomInput.length}/25</div>
                    </div>
                    <div>
                        <div>Password</div>
                        <input onChange={e => setPasswordInput(e.target.value)} className="px-1 border-2 border-white rounded-md"/>
                        <div className="text-xs text-right">{passwordInput.length}/25</div>
                    </div>
                    <button type="submit" className={`mt-4 font-black w-full rounded-md py-1 bg-white cursor-pointer hover:bg-gray-100 hover:scale-110 transition-all duration-300 ${activeTab === "join" ? "text-blue-400" : "text-red-400"}`}>{activeTab === "join" ? "Join Room" : "Create Room"}</button>
                </form>
                <div className={`${status ? "opacity-100" : "opacity-0"} text-center font-black text-red-400 h-6`}>
                    {status === "empty" && "One or more fields are empty."}
                    {status === "password" && "Incorrect Password"}
                    {status === "roomNotExists" && "A room with this name doesn't exist."}
                    {status === "roomExists" && "A room with this name already exists."}
                    {status === "length" && "Exceeded character limit"}
                    {status === "connecting" && "Connecting..."}
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
            <JoinPageNotification/>
        </div>
    );
};