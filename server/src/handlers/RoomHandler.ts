import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

const rooms: Record<string, string[]> = {}; // map stores roomId and all peers that have joined a room
const peerSocketMap: Map<string, string> = new Map(); // Map of peerId to socketId

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
      " with peer id as ",
      peerId,
    );
    rooms[roomId].push(peerId);
    peerSocketMap.set(peerId, socket.id);
    socket.join(roomId); // make the user join the room

    socket.on("ready", () => {
      // emit a ready event from frontend, when someone joins the room, and from server emit an event to all clients that new peer is added
      socket.to(roomId).emit("user-joined", { peerId });
    });
    socket
      .to(roomId)
      .emit("get-users", { roomId, participants: rooms[roomId] });
    socket.emit("get-users", { roomId, participants: rooms[roomId] });
  };

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    if (!rooms[roomId]) {
      return;
    }

    // Remove user from room's participant list
    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);

    console.log(`User with ID ${peerId} left room ${roomId}`);
    peerSocketMap.delete(peerId);
    // Emit updated participants list to all clients in the room
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    } else {
      socket
        .to(roomId)
        .emit("get-users", { roomId, participants: rooms[roomId] });
    }
    socket.leave(roomId);
  };

  const disconnect = () => {
    console.log(`User disconnected: ${socket.id}`);
    // Loop through all rooms and remove the user from any room they are part of
    for (const [peerId, socketId] of peerSocketMap.entries()) {
      if (socketId === socket.id) {
        for (const roomId of Object.keys(rooms)) {
          if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
            if (rooms[roomId].length === 0) {
              delete rooms[roomId];
            } else {
              socket.to(roomId).emit("get-users", {
                participants: rooms[roomId],
                roomId,
              });
            }
          }
        }
        peerSocketMap.delete(peerId);
        break;
      }
    }
  };
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);
  socket.on("leave-room", leaveRoom);
  socket.on("disconnect", disconnect);
};

export default roomHandler;
