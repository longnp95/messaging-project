const io = require('../socket');
const Conversation = require('../models/conversation');

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

exports.postCreateConversation = (async (req, res, next) => {
  const body = req.body;
  const name = body.name;
  const avatar = body.avatarUrl;
  const typeId = body.typeId;

  if (!(name && avatar && typeId)) {
    const data = {};
    await apiData(res, 500, 'Where your body ?', data);
  }

  const conversation = Conversation.create({
    name: name,
    avatar: avatar,
    typeId: typeId
  });

  if (conversation) {
    const data = {
      conversation: conversation
    };

    io.getIO().emit('conversation', {
      action: 'create',
      data: data
    });
    await apiData(res, 200, 'Create an conversation successfullly!', data);
  } else {
    const data = {};
    await apiData(res, 500, 'Create an conversation fail!', data);
  }
});

exports.postUpdateConversation = (async (req, res, next) => {
  const conversationId = req.query.conversationId;
  const body = req.body;
  const id = body.id;
  const name = body.name;
  const avatar = body.avatarUrl;
  const typeId = body.typeId;

  if (!conversationId) {
    const data = {};
    await apiData(res, 500, 'Where your params ?', data);
  }

  if (!(id && name && avatar && typeId)) {
    const data = {};
    await apiData(res, 500, 'Where your body ?', data);
  }

  const conversation = await checkConversation(res, id);

  if (conversation) {
    await conversation.update({
      name: name,
      avatar: avatar,
      typeId: typeId
    });
    await conversation.save();

    const data = {
      conversation: conversation
    };

    io.getIO().emit('conversation', {
      action: 'update',
      data: data
    });
    await apiData(res, 200, 'Update conversation successfully!', data);
  } else {
    const data = {};
    await apiData(res, 500, 'Update conversation fail!', data);
  }
});