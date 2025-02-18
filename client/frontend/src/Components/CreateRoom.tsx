import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { socketContext } from "../context/SocketContext";

interface CreateRoomProps {
  name: string;
  disabled: boolean;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ name, disabled }) => {
  const { socket } = useContext(socketContext);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    socket.emit("create-room", (response: { roomId: string }) => {
      socket.emit("joined-room", { roomId: response.roomId, name });
      navigate(`/room/${response.roomId}`);
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-white text-center">
        Create a Room
      </h2>
      <button
        onClick={handleCreateRoom}
        className={`w-full px-4 py-2 rounded-md text-white text-center transition-colors duration-200 ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={disabled}
      >
        Create Room
      </button>
    </div>
  );
};
export default CreateRoom;
