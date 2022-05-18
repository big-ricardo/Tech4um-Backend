const express = require("express");
const routes = require("./router.js");
const cors = require("cors");
const httpServer = express();
const server = require("http").Server(httpServer);
const ws = require("socket.io")(server);
const createRooms = require("./utils/rooms");
const { validateToken } = require("./utils/jwt.js");
require("dotenv").config();

const rooms = createRooms.init();

ws.on("connection", (socket) => {
  let { token } = socket.handshake.auth;

  if (!token) {
    token = socket.handshake.headers.auth;
  }

  if (!token) {
    socket.disconnect();
    return;
  }

  const user = validateToken(token, socket.handshake.headers);

  if (!user) {
    return;
  }

  rooms.addUser(user.id, socket.id);

  socket.on("join", (roomId) => {
    rooms.addUserToRoom(roomId, user);
    socket.join(roomId);
    socket.emit("joined", rooms.getRoomUser(roomId, user.id));
    console.log(" > User joined", user.name, "in room", roomId);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    rooms.removeUserFromRoom(roomId, user);
    socket.emit("left", rooms.getRoomUser(roomId, user.id));
    console.log(" > User left", user.name, "in room", roomId);
  });

  socket.on("disconnect", () => {
    rooms.removeUserFromRoom(roomId, userId);
    rooms.removeUser(userId);

    if (rooms.getRoomUsers(roomId).length === 0) {
      rooms.removeRoom(roomId);
    }
    socket.leave(roomId);

    socket.to(roomId).emit("left", user);

    console.log(" > User left", user.name);
  });
});

httpServer.use((req, _, next) => {
  req.ws = ws;
  req.rooms = rooms;

  return next();
});

httpServer.use(cors());
httpServer.use(express.json());
httpServer.use(routes);
httpServer.use(function (_, res, _) {
  res.status(404).json({ error: "Not found" });
});

server.listen(process.env.PORT || 3333, (err) => {
  if (err) {
    console.log("Server error", err);
  } else {
    console.log(" > Server started on port 3333");
  }
});
