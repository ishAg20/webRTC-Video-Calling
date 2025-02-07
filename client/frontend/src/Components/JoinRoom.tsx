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
      console.log("⚡ Attempting to join room:", roomId);
      if (!socket || !socket.connected) {
        setError("⚠️ Connection error. Please try again.");
        return;
      }

      setLoading(true);
      setError(null); // Clear any previous error

      console.log("📡 Emitting 'check-room' event to server...");

      // Check if the room exists before joining
      socket.emit("check-room", roomId, (response: { exists: boolean }) => {
        setLoading(false);
        if (!response) {
          setError("❌ No response from server. Try again.");
          console.error("❌ No response received for 'check-room' event.");
          return;
        }

        console.log("🔍 Server response:", response);
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
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Join a Room</h2>
      <form onSubmit={handleJoinRoom} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
            setError(null); // Clear error when user types
          }}
          required
          className="px-4 py-2 border border-gray-300 rounded-md text-white"
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white ${
            disabled || loading || !roomId.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={disabled || loading || !roomId.trim()}
        >
          {loading ? "Checking..." : "Join Room"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default JoinRoom;
