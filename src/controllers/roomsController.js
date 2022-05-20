const { validateToken } = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  store(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Room name is required" });
      }

      const user = validateToken(req.headers.authorization, res);

      if (!user) {
        return res.status(401).json({ error: "Token invalid" });
      }

      const id = uuidv4();

      req.rooms.createRoom({ id, name, description, by: user });

      req.ws.emit("new-room", {
        id,
        name,
        description,
        by: user,
        numUsers: 0,
        users: [],
      });

      return res.json({ id });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  index(req, res) {
    try {
      const rooms = req.rooms.getRooms();

      const response = rooms.map((room) => {
        return {
          id: room.id,
          name: room.name,
          description: room.description,
          by: room.by,
          numUsers: room.users.length,
        };
      });

      return res.json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  show(req, res) {
    try {
      const { roomId } = req.params;

      const user = validateToken(req.headers.authorization, res);

      if (!roomId) {
        return res.status(400).json({ error: "Room id is required" });
      }

      const room = req.rooms.getRoom(roomId);

      if (!room) {
        return res.status(400).json({ error: "Room not found" });
      }

      const messages = req.rooms.getRoomMessages(roomId, user.id);
      const users = req.rooms.getRoomUsers(roomId);

      const response = {
        id: room.id,
        name: room.name,
        description: room.description,
        by: room.by,
        messages,
        users,
      };

      return res.json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  delete(req, res) {
    try {
      const { roomId } = req.params;

      const user = validateToken(req.headers.authorization, res);

      if (!user) {
        return res.status(401).json({ error: "Token invalid" });
      }

      if (!roomId) {
        return res.status(400).json({ error: "Room id is required" });
      }

      const room = req.rooms.getRoom(roomId);

      if (!room) {
        return res.status(400).json({ error: "Room not found" });
      }

      if (room.by.id !== user.id) {
        return res.status(401).json({ error: "You are not the owner" });
      }

      req.rooms.deleteRoom(roomId);

      req.ws.emit("delete-room", { id: roomId });

      return res.json({ message: "Room deleted" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
