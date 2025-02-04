import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as UUIDv4 } from "uuid";
import Peer from "peerjs";
import { peerReducer } from "../Reducers/peerReducer";
import { addPeerAction } from "../Actions/peerAction";

const WS_Server = "http://localhost:5500";

export const socketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  //state variable to store userId
  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();

  const [peers, dispatch] = useReducer(peerReducer, {});
  const fetchFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
  };

  useEffect(() => {
    const userId = UUIDv4();
    const newPeer = new Peer(userId, {
      host: "localhost",
      port: 9000,
      path: "/",
    });
    setUser(newPeer);
    fetchFeed();
    const enterRoom = ({ roomId }: { roomId: String }) => {
      navigate(`/room/${roomId}`);
    };
    socket.on("room-created", enterRoom);
  }, []);

  useEffect(() => {
    if (!user || !stream) return;
    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      console.log(`Calling new peer ${peerId}`);
      call.on("stream", () => {
        dispatch(addPeerAction(peerId, stream));
      });
    });

    user.on("call", (call) => {
      // What new user should do when all users call new user
      console.log("Receiving a call");
      call.answer(stream);
      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream));
      });
    });
    socket.emit("ready");
  }, [user, stream]);

  return (
    <socketContext.Provider value={{ socket, user, stream, peers }}>
      {children}
    </socketContext.Provider>
  );
};
