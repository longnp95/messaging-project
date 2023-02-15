const io = require('../socket');
const User = require('../models/user');
const Group_Member = require('../models/group_member');
const Conversation = require('../models/conversation');
const Role = require('../models/role');
const Type = require('../models/type');
const Chat = require('../models/chat');
const { Op } = require('sequelize');

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
      attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
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
  try {
    const user = await checkStatusAccount(res, userId, User);

    if (!user) {
      return user;
    }

    const data = {
      conversations: user.conversations
    };

    return await apiData(res, 200, 'OK', data);
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
});

exports.postCreateConversation = (async (req, res, next) => {
  const body = req.body;
  const conversationName = body.conversationName;//string
  const conversationAvatarUrl = body.conversationAvatarUrl;//string
  const typeConversation = body.typeConversation;//int

  const userId = req.query.userId;

  if (!(conversationName && typeConversation)) {
    const data = {};

    return await apiData(res, 500, 'Where your field ?', data);
  }

  try {
    const user = await checkStatusAccount(res, userId, User);

    if (!user) {
      return user;
    }

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
      last_message: last_message,
      max_member: 50
    });

    if (!conversation) {
      return res.status(200).json({
        error: {
          status: 500,
          message: 'Create a group fail!'
        },
        data: {}
      });
    }

    const groupMember = await Group_Member.create({
      roleId: 1,
      userId: user.id,
      conversationId: conversation.id
    });

    if (!groupMember) {
      return res.status(200).json({
        error: {
          status: 500,
          message: 'Create conversation fail!'
        },
        data: {}
      });
    }

    const newMessage = await Chat.create({
      conversationId: conversation.id,
      status: 1,
      message: last_message
    });

    if (!newMessage) {
      const data = {};

      await Conversation.destroy({
        where: conversation.id
      });

      return await apiData(res, 500, 'Create conversation fail!', data);
    }

    const data = {
      conversation: conversation
    };

    io.getIO().in("user" + user.id).socketsJoin(["conversation" + conversation.id]);
    io.getIO().to(["user" + user.id, "conversation" + conversation.id]).emit('conversation', {
      action: 'create',
      data: data
    });

    return await apiData(res, 200, 'Create a group successfully!', data);
  } catch (err) {
    console.log(err);
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
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
  try {
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

    var message = 'Converastion was updated by ' + user.username;

    conversation.update({
      name: conversationName,
      avatar: conversationAvatarUrl,
      typeId: typeConversation,
      last_message: message
    });

    const newMessage = await Chat.create({
      conversationId: conversation.id,
      status: 1,
      message: message
    });

    if (!newMessage) {
      const data = {};

      return await apiData(res, 500, 'Updated conversation fail!', data);
    }

    conversation.save();

    const data = {
      conversation: conversation
    };

    io.getIO().to("conversation" + conversation.id).emit('conversation', {
      action: 'update',
      data: data
    });

    return await apiData(res, 200, 'Edit group successfully!', data);
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
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

  try {
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
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }

});

exports.getRoles = (async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    const data = {
      roles: roles
    };

    return await apiData(res, 200, 'OK!', data);
  } catch (err) {
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
});

exports.getMembersInGroup = (async (req, res, next) => {
  const conversationId = req.query.conversationId;

  if (!conversationId) {
    const data = {};

    return await apiData(res, 500, 'Where params ?', data);
  }

  try {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      },
      attributes: ["id", "name", "avatar"],
      include: [
        {
          model: User,
          attributes: ["id", "username", "firstName", "lastname", "avatar"],
          where: {
            status: 1
          }
        },
        {
          model: Type,
          attributes: ["id", "name"],
        }
      ]
    });

    if (!conversation) {
      const data = {};

      return await apiData(res, 500, 'This group doesn\'t exists!', data);
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

exports.postAddMemberInGroup = (async (req, res, next) => {
  const userId = req.query.userId;
  const conversationId = req.query.conversationId;
  const memberId = req.body.memberId;

  if (!(conversationId && userId)) {
    const data = {};

    return await apiData(res, 200, 'Where params ?', data);
  }

  if (!(memberId)) {
    const data = {};

    return await apiData(res, 200, 'Where body ?', data);
  }

  try {
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

    const members = await Group_Member.findAll({
      where: {
        conversationId: group.id
      }
    });
    console.log(members);
    if (group.max_member){
      if (members.length + 1 > group.max_member) {
        const data = {};

        return await apiData(res, 500, 'This conversation have max member is: ' + group.max_member, data);
      }
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

    var message = '@' + member.username + ' was added by ' + '@' + user.username;

    const newMessage = await Chat.create({
      conversationId: group.id,
      status: 1,
      message: message
    });

    if (!newMessage) {
      const data = {};
      await newMember.destroy();
      await newMember.save();

      return await apiData(res, 500, 'Add ' + member.username + ' fail!', data);
    }

    group.update({
      last_message: message
    });
    group.save();

    const data = {
      conversation: group
    };

    io.getIO().in("user" + member.id).socketsJoin(["conversation" + group.id]);
    io.getIO().to("conversation" + group.id).emit('message', {
      action: 'newMessage',
      data: {
        chat: newMessage
      }
    });
    io.getIO().to("conversation" + group.id).emit('conversation', {
      action: 'update',
      data: data
    });

    await apiData(res, 500, 'Add member in group successfully!', data);
  } catch (err) {
    console.log(err);
    var data = {};
    return await apiData(res, 401, 'Add member in group fail!', data);
  }
});

exports.getMessageByConversationId = (async (req, res, next) => {
  const conversationId = req.query.conversationId;

  if (!(conversationId)) {
    const data = {};

    return await apiData(res, 500, 'Where your params ?', data);
  }
  try {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      },
      include: {
        model: Chat,
        include: {
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender'],
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
  } catch (err) {
    var data = {};
    return await apiData(res, 401, 'Fail', data);
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

  try {
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

    const messageToSend = await Chat.findOne({
      where: {
        id: newMessage.id
      },
      include: {
        model: User,
        attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender']
      }
    });
    
    const data = {
      chat: messageToSend
    };

    io.getIO().to("conversation" + conversation.id).emit("message", {
      action: "newMessage",
      data: data
    });
    io.getIO().to("conversation" + conversation.id).emit("conversation", {
      action: "update",
      data: {
        conversation: conversation
      }
    });

    await apiData(res, 200, 'Send message successfully!', data);
  } catch (err) {
    var data = {};
    return await apiData(res, 401, 'Send message fail!', data);
  }
});

exports.getFindUserByUsername = (async (req, res, next) => {
  const username = req.query.username;

  if (!username) {
    const data = {};

    return await apiData(res, 500, 'Where your params ?', data);
  }

  try {
    const users = await User.findAll({
      where: {
        username: {
          [Op.startsWith]: username
        },
        status: 1
      },
      attributes: ["id", "username", "firstName", "lastName", "avatar"],
      limit: 10
    });

    var data = {
      users: users
    };

    return await apiData(res, 200, 'OK', data);
  } catch (err) {
    var data = {};
    return await apiData(res, 401, 'Fail', data);
  }
});