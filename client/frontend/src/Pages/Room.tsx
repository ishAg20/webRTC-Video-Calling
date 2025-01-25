import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../context/SocketContext";

const Room: React.FC = () => {
  const { roomId } = useParams();
  const { socket, user } = useContext(socketContext);

  useEffect(() => {
    if (!user || !roomId || !socket) return;
    //emitting this event so that if anyone is added, the server knows that new people have been added to this room
    if (user) {
      console.log("New user with id ", user._id, " has joined room ", roomId);

      const fetchParticipantList = ({
        roomId,
        participants,
      }: {
        roomId: string;
        participants: string[];
      }) => {
        console.log("Room participants");
        console.log(roomId, participants);
      };
      socket.on("get-users", fetchParticipantList);
      socket.emit("joined-room", { roomId, peerId: user._id });
      return () => {
        socket.off("get-users", fetchParticipantList);
      };
    }
  }, [roomId, user, socket]);
  return (
    <>
      <div>Room ID : {roomId}</div>
    </>
  );
};
export default Room;
