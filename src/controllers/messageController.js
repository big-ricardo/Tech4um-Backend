const { validateToken } = require("../utils/jwt");

module.exports = {
  store(req, res) {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({ error: "Room id is required" });
      }

      const user = validateToken(req.headers.authorization, res);

      if (!user) {
        return res.status(401).json({ error: "Token invalid" });
      }

      const room = req.rooms.getRoom(roomId);

      if (!room) {
        return res.status(400).json({ error: "Room not found" });
      }

      const { message, toUserId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const newMessage = req.rooms.sendMessage(room, user, message, toUserId);

      if (!newMessage) {
        return res.status(400).json({ error: "Error send message" });
      }

      if (toUserId) {
        req.ws.to(req.rooms.getUser(newMessage.to).socketId).emit("message", newMessage);

        return res.json(newMessage);
      }

      req.ws.to(roomId).emit("message", {message: newMessage, roomId});

      return res.json(newMessage);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
