import { useContext } from "react";
import { socketContext } from "../context/SocketContext";

const CreateRoom: React.FC = () => {
  const { socket } = useContext(socketContext);
  const initRoom = () => {
    socket.emit("create-room");
  };
  return (
    <>
      <button className="btn btn-secondary" onClick={initRoom}>
        Start a new meeting
      </button>
    </>
  );
};
export default CreateRoom;
