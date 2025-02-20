const { v4: UUIDv4 } = require("uuid");

const rooms = {}; // Map stores roomId and all peers that have joined a room
const peerSocketMap = new Map(); // Map of peerId to socketId

const roomHandler = (socket) => {
  const createRoom = () => {
    const roomId = UUIDv4(); // Unique roomID for multiple connections to exchange data
    socket.join(roomId); // Socket connection enters a new room
    socket.emit("room-created", { roomId }); // Emit event from server side
    console.log("Room created with id:", roomId);
  };

  const checkRoom = (roomId, callback) => {
    if (rooms[roomId]) {
      callback({ exists: true });
    } else {
      callback({ exists: false });
    }
  };

  const joinedRoom = ({ roomId, peerId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = []; // Initialize the room if it doesn't exist
    }
    console.log("New user has joined room", roomId, "with peer id as", peerId);
    rooms[roomId].push(peerId);
    peerSocketMap.set(peerId, socket.id);
    socket.join(roomId); // Make the user join the room

    socket.on("ready", () => {
      socket.to(roomId).emit("user-joined", { peerId });
    });
    socket
      .to(roomId)
      .emit("get-users", { roomId, participants: rooms[roomId] });
    socket.emit("get-users", { roomId, participants: rooms[roomId] });
  };

  const leaveRoom = ({ roomId, peerId }) => {
    if (!rooms[roomId]) return;

    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    console.log(`User with ID ${peerId} left room ${roomId}`);
    peerSocketMap.delete(peerId);

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
    for (const [peerId, socketId] of peerSocketMap.entries()) {
      if (socketId === socket.id) {
        for (const roomId of Object.keys(rooms)) {
          if (rooms.hasOwnProperty(roomId)) {
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
  socket.on("check-room", checkRoom);
  socket.on("joined-room", joinedRoom);
  socket.on("leave-room", leaveRoom);
  socket.on("disconnect", disconnect);
};

module.exports = roomHandler;
