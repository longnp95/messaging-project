const io = require('../socket');
const User = require('../models/user');
const Group_Member = require('../models/group_member');
const Conversation = require('../models/conversation');
const Role = require('../models/role');
const Type = require('../models/type');
const Chat = require('../models/chat');

const apiData = (async (res, status, message, data) => {
  return res.status(200).json({
    error: {
      status: status,
      message: message
    },
    data: data
  });
});

const checkStatusAccount = (async (res, id, table) => {
  if (id) {
    const data = await table.findOne({
      where: {
        id: id
      },
      include: Conversation
    });

    if (!data) {
      const returnData = {};

      await apiData(res, 500, 'This account doesn\'t exists', returnData);
    } else if (data.status == 1) {
      return data;
    } else {
      const returnData = {};

      await apiData(res, 500, 'This account is block', returnData);
    }
  } else {
    const returnData = {};

    await apiData(res, 500, 'Where your params ?', returnData);
  }
});

exports.getConversationsByUserId = (async (req, res, next) => {
  const userId = req.query.userId;

  const user = await checkStatusAccount(res, userId, User);

  if (!user) {
    return user;
  }

  const data = {
    conversations: user.conversations
  };

  await apiData(res, 200, 'OK', data);
});

exports.postCreateConversation = (async (req, res, next) => {
  const body = req.body;
  const conversationName = body.conversationName;//string
  const conversationAvatarUrl = body.conversationAvatarUrl;//string
  const typeConversation = body.typeConversation;//int

  const userId = req.query.userId;

  if (!(conversationName && typeConversation && userId)) {
    const data = {};

    return await apiData(res, 500, 'Where your field ?', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  let last_message = '';

  if (typeConversation == 2) {
    last_message = 'Group was created by ' + user.firstName + user.lastName;
  } else if (typeConversation == 3) {
    last_message = 'Channel was created by ' + user.firstName + user.lastName;
  }

  const conversation = await Conversation.create({
    name: conversationName,
    avatar: conversationAvatarUrl,
    typeId: typeConversation,
    last_message: last_message
  });

  if (!conversation) {
    return await apiData(res, 500, 'Create a group fail!', data);
  }

  const groupMember = await Group_Member.create({
    roleId: 1,
    userId: user.id,
    conversationId: conversation.id
  });

  if (!groupMember) {
    return await apiData(res, 500, 'Create a group fail!', data);
  }

  if (group.typeId != 1) {
    const newMessage = await Chat.create({
      message: last_message,
      status: 1,
      conversationId: conversation.id
    });
  }

  io.getIO().to(["user" + user.id, "conversation" + conversation.id]).emit('conversation', {
    action: 'create',
    data: {
      conversation: conversation,
    }
  });

  res.status(200).json({
    error: {
      status: 200,
      message: 'Create a group successfully!'
    },
    data: {
      conversation: conversation,
    }
  });
});

exports.postUpdateConversation = (async (req, res, next) => {
  const body = req.body;
  const conversationId = body.conversationId;
  const conversationName = body.conversationName;
  const typeConversation = body.typeConversation;//int
  const conversationAvatarUrl = body.conversationAvatarUrl;

  const userId = req.query.userId;

  if (!(userId && conversationId && conversationName)) {
    const data = {};

    return await apiData(res, 500, 'Where your field ?', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!conversation) {
    const data = {};

    return await apiData(res, 500, 'This conversation doesn\'t exists!', data);
  }
  const last_message = 'Converastion was updated by ' + user.firstName + user.lastName;

  conversation.update({
    name: conversationName,
    avatar: conversationAvatarUrl,
    typeId: typeConversation,
    last_message: last_message
  });
  conversation.save();

  const newMessage = await Chat.create({
    message: last_message,
    status: 1,
    conversationId: conversation.id
  });

  io.getIO().to("conversation" + conversation.id).emit('conversation', {
    action: 'update',
    data: {
      conversation: conversation,
    }
  });

  const data = {
    conversation: conversation
  };

  return await apiData(res, 200, 'Edit group successfully!', data);
});

exports.postSetRole = (async (req, res, next) => {
  const userId = req.query.userId;
  const body = req.body;
  const conversationId = body.conversationId;
  const memberId = body.memberId;
  const roleId = body.roleId;

  if (!(userId && conversationId && memberId && roleId)) {
    const data = {};

    return await apiData(res, 500, 'Where your feild ?!', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  if (!user) {
    return user;
  }

  const member = await checkStatusAccount(res, memberId, User);

  if (!member) {
    return member;
  }

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!conversation) {
    const data = {};

    return await apiData(res, 500, 'This group doesn\'t exists!', data);
  }

  const userInGroup = await Group_Member.findOne({
    where: {
      userId: userId,
      conversationId: conversationId
    }
  });

  const memberInGroup = await Group_Member.findOne({
    where: {
      userId: memberId,
      conversationId: conversationId
    }
  });

  if (!userInGroup) {
    const data = {};

    return await apiData(res, 500, 'You are don\'t have permission in ' + conversation.name + '!', data);
  }

  if (!memberInGroup) {
    const data = {};

    return await apiData(res, 500, 'This account doesn\'t exists in ' + conversation.name + '!', data);
  }

  if (userInGroup.roleId < memberInGroup.roleId) {
    memberInGroup.update({
      roleId: roleId
    });
    memberInGroup.save();

    const data = {
      memberInGroup: memberInGroup,
    };

    io.getIO().emit('group', {
      action: 'setRole',
      data: data
    });

    return await apiData(res, 200, 'Set Role successfully!', data);
  } else {
    const data = {};

    return await apiData(res, 500, 'You cannot set role for this account!', data);
  }
});

exports.getRoles = (async (req, res, next) => {
  const roles = await Role.findAll();
  const data = {
    roles: roles
  };

  return await apiData(res, 200, 'You cannot set role for this account!', data);
});

exports.getMembersInGroup = (async (req, res, next) => {
  const conversationId = req.query.conversationId;

  if (!conversationId) {
    const data = {};

    return await apiData(res, 500, 'Where params ?', data);
  }

  const group = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!group) {
    const data = {};

    return await apiData(res, 500, 'This group doesn\'t exists!', data);
  }

  const members = await Group_Member.findAll({
    where: {
      conversationId: conversationId
    }
  });

  const data = {
    members: members
  };

  return await apiData(res, 200, 'OK', data);
});

exports.postAddMemberInGroup = (async (req, res, next) => {
  const userId = req.query.userId;
  const conversationId = req.query.conversationId;
  const memberId = req.body.memberId;

  if (!(conversationId && userId)) {
    const data = {};

    return await apiData(res, 500, 'Where params ?', data);
  }

  if (!(memberId)) {
    const data = {};

    return await apiData(res, 500, 'Where body ?', data);
  }

  const group = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!group) {
    const data = {};

    return await apiData(res, 500, 'This group doesn\'t exists!', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  if (!user) {
    return user;
  }

  const member = await checkStatusAccount(res, memberId, User);

  if (!member) {
    return member;
  }

  if (group.typeId != 1) {
    var message = user.firstName + user.lastName + ' added ' + +' to the group' + member.firstName + member.lastName;
    
    group.update({
      last_message: message
    });
    group.save();

    const newMessage = await Chat.create({
      message: message,
      status: 1,
      conversationId: group.id
    });
  }

  const memberInGroup = await Group_Member.findOne({
    where: {
      conversationId: group.id,
      userId: member.id
    }
  });

  if (memberInGroup) {
    const data = {};

    return await apiData(res, 500, 'This user is exists in group!', data);
  }

  const newMember = await Group_Member.create({
    conversationId: conversationId,
    userId: memberId,
    roleId: 2
  });

  if (!newMember) {
    const data = {};

    return await apiData(res, 500, 'Add member in group fail!', data);
  }

  const data = {
    member: member
  };

  io.getIO().to("conversation" + conversationId).emit('group', {
    action: 'addMember',
    data: data
  });

  await apiData(res, 200, 'Add member in group successfully!', data);
});

exports.getMessageByConversationId = (async (req, res, next) => {
  const conversationId = req.query.conversationId;

  if (!(conversationId)) {
    const data = {};

    return await apiData(res, 500, 'Where your params ?', data);
  }

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    },
    include: {
      model: Chat,
      include: {
        model: User
      }
    }
  });

  if (!conversation) {
    const data = {};

    return await apiData(res, 500, 'Please create conversaion!', data);
  } else {
    const data = {
      chats: conversation.chats
    };

    return await apiData(res, 200, 'OK', data);
  }
});

exports.postSendMessage = (async (req, res, next) => {
  const userId = req.query.userId;
  const conversationId = req.query.conversationId;
  const message = req.body.message;

  if (!(message && conversationId)) {
    const data = {};

    return await apiData(res, 500, 'Where your params ?', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  if (!user) {
    return user;
  }

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!conversation) {
    const data = {};

    return await apiData(res, 500, 'Please create conversaion!', data);
  }

  conversation.update({
    last_message: message
  });
  conversation.save();

  const newMessage = await Chat.create({
    message: message,
    status: 1,
    userId: user.id,
    conversationId: conversation.id
  });

  if (newMessage) {
    const data = {
      chat: newMessage
    };

    io.getIO().to("conversation" + conversation.id).emit("conversation", {
      action: "sendMessage",
      data: data
    });

    await apiData(res, 200, 'Send message successfully!', data);
  } else {
    const data = {};

    return await apiData(res, 500, 'Send message faild!', data);
  }
});