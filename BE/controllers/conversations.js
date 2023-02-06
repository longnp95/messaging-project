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
    await apiData(res, 500, 'Where params ?', data);
  }

  const conversation = await Conversation.findOne({
    where: {
      id: id
    },
    include: {
      all: true,
      nested: true
    }
  });

  if (!conversation) {
    const data = {};
    await apiData(res, 500, 'THis conversation doesn\'t exists!', data);
  } else {
    return conversation;
  }
});

exports.getAllConversation = (async (req, res, next) => {
  const conversations = await Conversation.findAll({
    order: [
      ['updatedAt', 'DESC'],
    ]
  });

  const data = {
    conversations: conversations
  };
  await apiData(res, 200, 'OK', data);
});

exports.getConversation = (async (req, res, next) => {
  const conversationId = req.query.conversationId;

  const conversation = await checkConversation(res, conversationId);

  if (conversation) {
    const data = {
      conversation: conversation
    };
    await apiData(res, 200, 'OK', data);
  } else {
    const data = {};
    await apiData(res, 500, 'Fail', data);
  }
});

exports.postDeleteConversation = (async (req, res, next) => {
  const conversationId = req.query.conversationId;

  if (!conversationId) {
    const data = {};
    await apiData(res, 500, 'Where your params ?', data);
  }

  const conversation = await checkConversation(res, id);

  if (conversation) {
    await Group_Member.destroy({
      where: {
        conversationId: conversationId
      }
    });

    await Chat.destroy({
      where: {
        conversationId: conversationId
      }
    });

    conversation.destroy();

    await apiData(res, 200, 'Delete this conversation successfully!', data);
  } else {
    const data = {};
    await apiData(res, 500, 'Fail', data);
  }
});