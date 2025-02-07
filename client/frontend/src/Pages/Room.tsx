import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../context/SocketContext";
import UserFeed from "../Components/UserFeed";

const Room: React.FC = () => {
  const { roomId } = useParams();
  const { socket, user, stream, peers } = useContext(socketContext);
  const [participants, setParticipants] = useState<string[]>([]);
  const [socketConnected, setSocketConnected] = useState(true);

  useEffect(() => {
    if (!user || !roomId || !socket) {
      return;
    }

    console.log("New user with id ", user._id, " has joined room ", roomId);

    const fetchParticipantList = ({
      roomId,
      participants,
    }: {
      roomId: string;
      participants: string[];
    }) => {
      setParticipants(participants); // Update local state with participant list
      console.log("Room participants:", participants);
    };

    // Emit room join event
    socket.emit("joined-room", { roomId, peerId: user._id });

    // Listen for participant updates
    socket.on("get-users", fetchParticipantList);

    // Handle socket disconnection
    const handleDisconnect = () => {
      setSocketConnected(false);
      console.warn("⚠️ Disconnected from server.");
    };

    socket.on("disconnect", handleDisconnect);

    return () => {
      console.log("User with ID", user._id, "is leaving room", roomId);
      socket.emit("leave-room", { roomId, peerId: user._id });
      socket.off("get-users", fetchParticipantList);
      socket.off("disconnect", handleDisconnect);
    };
  }, [roomId, user, socket]);

  return (
    <div className="p-4 bg-gray-100 shadow-lg rounded-lg min-h-screen flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-4">
        Room ID: <span className="text-blue-500">{roomId}</span>
      </h1>

      {socketConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
          {/* Display user's own feed */}
          {stream && (
            <div className="border p-2 rounded-lg bg-white shadow-md">
              <UserFeed stream={stream} name={user?.name || "You"} />
            </div>
          )}

          {/* Display all participants' feeds */}
          {Object.keys(peers).length > 0 ? (
            Object.keys(peers).map((peerId) => (
              <div
                key={peerId}
                className="border p-2 rounded-lg bg-white shadow-md"
              >
                <UserFeed
                  stream={peers[peerId].stream}
                  name={peers[peerId].name || "Participant"}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">
              No other participants yet.
            </p>
          )}
        </div>
      ) : (
        <p className="text-red-500">
          ⚠️ Connection lost. Please refresh or check your internet.
        </p>
      )}
    </div>
  );
};

export default Room;
