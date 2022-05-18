const express = require("express");
const router = express.Router();

const userController = require("./controllers/userController");
const messageController = require("./controllers/messageController");
const roomsController = require("./controllers/roomsController");

router.get("/", (_, res) => {
  return res.json({ message: `Muito Bem!Tudo funcionando!!!` });
});

router.post("/login", userController.store);

router.get("/room/:roomId/users", userController.index);

router.post("/room/:roomId/message", messageController.store);

router.get("/room/:roomId", roomsController.show);
router.post("/room", roomsController.store);
router.delete("/room/:roomId", roomsController.delete);

router.get("/rooms", roomsController.index);

module.exports = router;
