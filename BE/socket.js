const jwt = require('jsonwebtoken');
let io;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer);

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }

    return io;
  },

  checkToken: (token) => {
    try {
      var data = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

      return true;
    } catch (err) {
      if (err) {
        return false;
      }
    }
  }
}