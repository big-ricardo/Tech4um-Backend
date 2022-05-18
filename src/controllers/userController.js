const { validateToken, createToken } = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  store(req, res) {
    try {
      const { user } = req.body;

      if (!user) {
        return res.status(400).json({ error: "User is required" });
      }

      if (!user.email || !user.name) {
        return res
          .status(400)
          .json({ error: "User name and email are required" });
      }

      const token = createToken({ ...user, id: uuidv4() });

      return res.json({ token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  index(req, res) {
    try {
      const { roomId } = req.params;

      validateToken(req.headers.authorization, res);

      if (!roomId) {
        return res.status(400).json({ error: "Room id is required" });
      }

      const room = req.rooms.getRoom(roomId);

      if (!room) {
        return res.status(400).json({ error: "Room not found" });
      }

      const users = req.rooms.getRoomUsers(roomId);

      return res.json({ users });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
