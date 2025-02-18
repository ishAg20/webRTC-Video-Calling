import { useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { socketContext } from "../context/SocketContext";

interface JoinRoomProps {
  name: string;
  disabled: boolean;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ name, disabled }) => {
  const { socket } = useContext(socketContext);
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!roomId.trim() || disabled) return;

      if (!socket || !socket.connected) {
        setError("⚠️ Connection error. Please try again.");
        return;
      }

      setLoading(true);
      setError(null);

      socket.emit("check-room", roomId, (response: { exists: boolean }) => {
        setLoading(false);
        if (!response) {
          setError("❌ No response from server. Try again.");
          return;
        }

        if (response.exists) {
          socket.emit("joined-room", { roomId, name });
          navigate(`/room/${roomId}`);
        } else {
          setError("❌ Room does not exist. Please enter a valid Room ID.");
        }
      });
    },
    [roomId, name, disabled, socket, navigate]
  );

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-white text-center">
        Join a Room
      </h2>
      <form onSubmit={handleJoinRoom} className="w-full space-y-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
            setError(null);
          }}
          required
          className="w-full px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded-md text-white text-center transition-colors duration-200 ${
            disabled || loading || !roomId.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={disabled || loading || !roomId.trim()}
        >
          {loading ? "Checking..." : "Join Room"}
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-4 text-center text-sm w-full">{error}</p>
      )}
    </div>
  );
};

export default JoinRoom;
