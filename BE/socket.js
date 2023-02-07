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
  },

  joinRoomByToken: (socket, token) => {
    if (socket && token) {
      var data = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      var userId = data.userId;
      var role = data.role;
  
      if (role == 'user') {
        User.findOne({
          where: {
            id: userId
          },
          include: Conversation
        })
          .then(user => {
            if (user) {
              if (user.status == 1) {
                const conversations = user.conversations;
  
                conversations.forEach(conversation => {
                  socket.join("conversation" + conversation.id);
                });
              } else {
                socket.send(JSON.stringify({
                  action: 'joinRoom',
                  error: 'This Account is block!'
                }));
              }
            } else {
              socket.send(JSON.stringify({
                action: 'joinRoom',
                error: 'This Account Doesn\'t exists'
              }));
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        socket.send(JSON.stringify({
          action: 'joinRoom',
          error: 'Don\'t have perrmission in this page'
        }));
      }
    } else {
      throw new Error('Don\'t have socket or token!');
    }
  }
}