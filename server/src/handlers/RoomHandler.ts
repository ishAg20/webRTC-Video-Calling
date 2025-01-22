import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";

const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = UUIDv4(); // unique roomID for multiple connections to exchange data
    socket.join(roomId); // socket connection enters a new room
    socket.emit("room-created", { roomId }); // emit event from server side
    console.log("Room created with id : ", roomId);
  };

  const joinedRoom = ({ roomId }: { roomId: string }) => {
    console.log("New user has joined room ", roomId);
  };
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
};

export default roomHandler;
