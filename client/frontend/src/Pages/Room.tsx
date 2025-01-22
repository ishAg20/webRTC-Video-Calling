import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../context/SocketContext";

const Room: React.FC = () => {
  const { roomId } = useParams();
  const { socket } = useContext(socketContext);
  useEffect(() => {
    //emitting this event so that if anyone is added, the server knows that new people have been added to this room
    socket.emit("joined-room", { roomId });
  }, [roomId]);
  return (
    <>
      <div>room : {roomId}</div>
    </>
  );
};
export default Room;
