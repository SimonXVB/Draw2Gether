import { useContext, type Dispatch, type SetStateAction } from "react"
import { clientDataCTX } from "../Context/ClientDataContext/clientDataCTX"
import { drawingCTX } from "../Context/DrawingContext/drawingCTX";
import { useCanvasToImage } from "../Hooks/useCanvasToImage";
import { socket } from "../socket";

export function MenuModal({ setMenuOpen, menuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>>, menuOpen: boolean }) {
    const { setClientData, clientData } = useContext(clientDataCTX);
    const { drawingDataRef, redoDataRef } = useContext(drawingCTX);

    const { canvasToImage } = useCanvasToImage();

    function leaveRoom() {
        drawingDataRef.current = [];
        redoDataRef.current = [];

        setClientData(prev => {
            return {
                ...prev,
                roomName: "",
                password: "",
                isJoined: false,
                isHost: false,
                clients: []
            };
        });

        socket.emit("leaveRoom");
    };

    function kickUser(userToKickID: string) {
        socket.emit("kickUserHost", userToKickID);
    };

    return (
        <>
        {menuOpen &&
            <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-gray-400/50" onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}>
                <div className="bg-white max-h-[80vh] max-w-[500px] p-6 mx-2 rounded-xl overflow-auto shadow-lg shadow-gray-500">
                    <h1 className="text-4xl font-black text-center mb-4">
                        <span className="text-blue-400">Draw</span>
                        <span>2</span>
                        <span className="text-red-400">Gether</span>
                    </h1>
                    <div className="bg-blue-400 text-white rounded-md text-3xl flex flex-col mb-6 p-3">
                        <h1 className="p-2 flex items-center">
                            <span className="font-bold pr-3">Room:</span>
                            <span className="font-medium text-xl overflow-auto no-scrollbar w-full text-right">{clientData.roomName}</span>
                            <button className="ml-3 cursor-pointer hover:scale-125 active:scale-100 duration-100 transition-all" onClick={() =>  navigator.clipboard.writeText(clientData.roomName)} title="Copy to Clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                                    <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                                    <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
                                </svg>
                            </button>
                        </h1>
                        <div className="border-2 border-white"></div>
                        <h1 className="font-bold p-2 flex items-center">
                            <span className="pr-3">Password:</span>
                            <input className="font-medium text-xl w-full text-right cursor-text" type="password" disabled value={clientData.password} readOnly></input>
                            <button className="ml-3 cursor-pointer hover:scale-125 active:scale-100 duration-100 transition-all" onClick={() =>  navigator.clipboard.writeText(clientData.password)} title="Copy to Clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                                    <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                                    <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
                                </svg>
                            </button>
                        </h1>
                    </div>
                    {clientData.clients.filter(client => client.isHost === true).map(client => (
                        <div key={client.id} className="bg-blue-400 text-white rounded-md text-xl flex justify-between mb-6 p-3">
                            <h2 className="font-bold">Host:</h2>
                            <div>{client.username}{clientData.isHost && " (You)"}</div>
                        </div>
                    ))}
                    <ul className="bg-blue-400 text-white rounded-md text-xl mb-6 p-3">
                        <h2 className="font-bold">Users:</h2>
                        {clientData.clients.filter(client => client.isHost === false).map(client => (
                            <li key={client.id} className="flex justify-between list-disc list-inside">
                                <p>{client.username}</p>
                                {clientData.isHost && 
                                    <button className="cursor-pointer hover:scale-125 active:scale-100 duration-100 transition-all" title={`Kick ${client.username}`} onClick={() => kickUser(client.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 16 16">
                                            <path d="M8.538 1.02a.5.5 0 1 0-.076.998 6 6 0 1 1-6.445 6.444.5.5 0 0 0-.997.076A7 7 0 1 0 8.538 1.02"/>
                                            <path d="M7.096 7.828a.5.5 0 0 0 .707-.707L2.707 2.025h2.768a.5.5 0 1 0 0-1H1.5a.5.5 0 0 0-.5.5V5.5a.5.5 0 0 0 1 0V2.732z"/>
                                        </svg>
                                    </button>
                                }
                            </li>
                        ))}
                    </ul>
                    <button onClick={canvasToImage} className="bg-blue-400 w-full rounded-md p-3 text-white font-bold cursor-pointer hover:bg-blue-400/80 hover:scale-105 transition-all duration-300 mb-2">Download as PNG</button>
                    <button onClick={leaveRoom} className="bg-red-400 w-full rounded-md p-3 text-white font-bold cursor-pointer hover:bg-red-400/80 hover:scale-105 transition-all duration-300">Leave Room</button>
                </div>
            </div>
        }
        </>
    )
};