import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

const rooms: Record<string, string[]> = {}; // map stores roomId and all peers that have joined a room

const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = UUIDv4(); // unique roomID for multiple connections to exchange data
    socket.join(roomId); // socket connection enters a new room
    socket.emit("room-created", { roomId }); // emit event from server side
    console.log("Room created with id : ", roomId);
  };

  const joinedRoom = ({ roomId, peerId }: IRoomParams) => {
    if (!rooms[roomId]) {
      rooms[roomId] = []; // Initialize the room if it doesn't exist
    }
    console.log(
      "New user has joined room ",
      roomId,
      " with peer id as  ",
      peerId,
    );
    rooms[roomId].push(peerId);
    socket.join(roomId); // make the user join the room
    socket
      .to(roomId)
      .emit("get-users", { roomId, participants: rooms[roomId] });
    socket.emit("get-users", { roomId, participants: rooms[roomId] });
  };
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
};

export default roomHandler;
