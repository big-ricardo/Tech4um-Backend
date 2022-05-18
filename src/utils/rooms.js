module.exports = {
  init() {
    const state = {
      rooms: {
        "a4f25db6-6ead-4553-a28b-a7dbf95fb0e8": {
          id: "a4f25db6-6ead-4553-a28b-a7dbf95fb0e8",
          name: "atendimento humanizado",
          description: "atendimento humanizado com a tech4humans",
          by: {
            name: "Ricardo",
            email: "luis.ricardo@tech4h.com.br",
            id: "0f6cbcae-bc95-4f06-b02d-0c6598c088dc",
          },
          users: [],
          messages: [],
          privateMessages: [],
        },
      },
      users: {},
    };

    function getRoom(roomId) {
      return state.rooms[roomId];
    }

    function getRooms() {
      return Object.values(state.rooms);
    }

    function createRoom(room) {
      state.rooms[room.id] = {
        ...room,
        users: [],
        messages: [],
        privateMessages: [],
      };
    }

    function deleteRoom(roomId) {
      delete state.rooms[roomId];
    }

    function getRoomUsers(roomId) {
      const room = getRoom(roomId);

      if (!room) {
        return [];
      }

      return room.users;
    }

    function addUser(userId, socketId) {
      state.users[userId] = {
        id: userId,
        socketId,
      };

      return state.users[userId];
    }

    function removeUser(userId) {
      delete state.users[userId];
    }

    function getUser(userId) {
      return state.users[userId];
    }

    function getRoomUser(roomId, userId) {
      const users = getRoomUsers(roomId);
      return users.find((user) => user.id === userId);
    }

    function addUserToRoom(roomId, user) {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      room.users.push(user);
    }

    function removeUserFromRoom(roomId, userId) {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const userIndex = room.users.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        return;
      }

      room.users.splice(userIndex, 1);
    }

    function sendMessage(room, user, message, userToId = null) {
      const newMessage = {
        user,
        message,
        to: userToId,
        timestamp: new Date(),
      };

      if (userToId) {
        room.privateMessages.push(newMessage);

        return newMessage;
      }

      room.messages.push(newMessage);

      return newMessage;
    }

    function getRoomMessages(roomId, userId) {
      const room = getRoom(roomId);

      if (!room) {
        return [];
      }

      const messages = [...room.messages];

      if (room.privateMessages.length && userId) {
        messages.push(
          ...room.privateMessages.filter((message) => message.to === userId)
        );
      }

      return messages.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
    }

    return {
      getRoom,
      getRooms,
      createRoom,
      deleteRoom,
      getRoomUsers,
      getRoomUser,
      addUserToRoom,
      removeUserFromRoom,
      sendMessage,
      getRoomMessages,
      addUser,
      removeUser,
      getUser,
    };
  },
};
