import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../context/SocketContext";
import UserFeed from "../Components/UserFeed";

const Room: React.FC = () => {
  const { roomId } = useParams();
  const { socket, user, stream } = useContext(socketContext);
  const [participants, setParticipants] = useState<string[]>([]);

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
        setParticipants(participants); // Update local state with participant list
        console.log("Room participants");
        console.log(roomId, participants);
      };
      socket.emit("joined-room", { roomId, peerId: user._id });
      socket.on("get-users", fetchParticipantList);
      return () => {
        console.log("User with ID", user._id, "is leaving room", roomId);
        socket.emit("leave-room", { roomId, peerId: user._id });
        socket.off("get-users", fetchParticipantList);
      };
    }
  }, [roomId, user, socket]);
  return (
    <>
      <div>
        <h1>Room ID : {roomId}</h1>
        <h2>Participants:</h2>
        <ul>
          {participants.map((participant) => (
            <li key={participant}>{participant}</li>
          ))}
        </ul>
        <UserFeed stream={stream} />
      </div>
    </>
  );
};
export default Room;
