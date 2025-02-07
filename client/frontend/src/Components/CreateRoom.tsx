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
    <div>
      <h2>Create a Room</h2>
      <button
        onClick={handleCreateRoom}
        className="btn btn-primary"
        disabled={disabled}
      >
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
