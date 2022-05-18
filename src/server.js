const express = require("express");
const routes = require("./router.js");
const cors = require("cors");
const httpServer = express();
const server = require("http").Server(httpServer);
const ws = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
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
    console.log(" >No token");
    socket.disconnect();
    return;
  }

  const user = validateToken(token);

  if (!user) {
    console.log(" >Invalid token");
    socket.disconnect();
    return;
  }

  rooms.addUser(user.id, socket.id);

  socket.on("join", (roomId) => {
    rooms.addUserToRoom(roomId, user);
    ws.to(roomId).emit("joined", { user, roomId });
    socket.join(roomId);
    console.log(" > User joined", user.name, "in room", roomId);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    rooms.removeUserFromRoom(roomId, user);
    ws.to(roomId).emit("left", { user, roomId });
    console.log(" > User left", user.name, "in room", roomId);
  });

  socket.on("disconnect", () => {
    rooms.removeUser(user.id);

    console.log(" > User disconnect", user.name);
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
