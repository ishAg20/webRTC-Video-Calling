import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import serverConfig from "./config/serverConfig";
import roomHandler from "./handlers/RoomHandler";

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("New user connected");
  roomHandler(socket); // pass socket connection to the room handler for room creation and joining an existing room
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(serverConfig.PORT, () => {
  console.log(`Server is listening at port ${serverConfig.PORT}`);
});
