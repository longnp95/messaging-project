const io = require('../socket');
const Chat = require('../models/chat');
const Conversation = require('../models/conversation');
const Group_Member = require('../models/group_member');

const apiData = (async (res, status, message, data) => {
  return res.status(200).json({
    error: {
      status: status,
      message: message
    },
    data: data
  });
});

const checkConversation = (async (res, id) => {
  if (!id) {
    const data = {};
    return await apiData(res, 500, 'Where params ?', data);
  }

  const conversation = await Conversation.findOne({
    where: {
      id: id
    }
  });

  if (!conversation) {
    console.log('no conversation');
    const data = {};
    return await apiData(res, 500, 'THis conversation doesn\'t exists!', data);
  } else {
    console.log('conversation existed');
    return conversation;
  }
});

exports.getAllConversation = (async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      order: [
        ['updatedAt', 'DESC'],
      ]
    });

    const data = {
      conversations: conversations
    };
    return await apiData(res, 200, 'OK', data);
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
});

exports.getConversation = (async (req, res, next) => {
  try {
    const conversationId = req.query.conversationId;

    const conversation = await checkConversation(res, conversationId);

    if (!conversation) {
      return conversation;
    }

    const data = {
      conversation: conversation
    };

    return await apiData(res, 200, 'OK', data);
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }

});

exports.postDeleteConversation = (async (req, res, next) => {
  const conversationId = req.query.conversationId;
  if (!conversationId) {
    const data = {};
    return await apiData(res, 500, 'Where your params ?', data);
  }

  try {
    const conversation = await checkConversation(res, conversationId);

    await Group_Member.destroy({
      where: {
        conversationId: conversation.id
      }
    });
    console.log('deleted');

    await Chat.destroy({
      where: {
        conversationId: conversation.id
      }
    });

    conversation.destroy();

    const data = {};

    io.getIO().to("conversation" + conversation.id).emit("conversation", {
      action: 'delete',
      data: {
        message: "Conversation has been deleted!",
        conversationId: conversationId
      }
    });
    io.getIO().socketsLeave("conversation" + conversation.id);

    await apiData(res, 200, 'Delete this conversation successfully!', data);
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
});

exports.postUpdateMaxMember = (async (req, res, next) => {
  const conversationId = req.query.conversationId;
  const maxMember = req.body.maxMember;

  if (!conversationId) {
    const data = {};

    return await apiData(res, 500, 'Where your params!', data);
  }

  if (!maxMember) {
    const data = {};

    return await apiData(res, 500, 'Where your body!', data);
  }
  
  try {
    const conversation = await checkConversation(res, conversationId);

    if (!conversation) {
      return conversation;
    }

    if (maxMember < conversation.max_member) {
      const members = await Group_Member.findAll({
        conversationId: conversationId
      });

      for (var i = (maxMember - 1); i < conversation.max_member; i++) {
        var message = username + " was kicked!";
        var userId = members[i].userId;
        var username = members[i].username;

        await Group_Member.destroy({
          conversationId: conversationId,
          userId: userId
        });

        io.getIO().to(["user" + userId, "conversation" + conversation.id]).emit("conversation", {
          action: "updateMaxMember",
          message: message
        });
        io.getIO().in("user" + userId).socketsLeave("conversation" + conversation.id);
      }
    }

    conversation.update({
      max_member: maxMember
    });
    conversation.save();

    const data = {};

    await apiData(res, 200, "Update max member successfully!", data);
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
});