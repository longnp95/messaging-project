const io = require('../socket');
const User = require('../models/user');
const Group_Member = require('../models/group_member');
const Conversation = require('../models/conversation');
const Media = require('../models/media');
const Role = require('../models/role');
const Type = require('../models/type');
const Chat = require('../models/chat');
const Reaction = require('../models/reaction');
const Chat_Reaction = require('../models/chat_reaction');
const { Op, where } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Chat_Media = require('../models/chat_media');

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
    console.log(id);
    const data = await table.findOne({
      where: {
        id: id
      },
      attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status']
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

const pathFileInUrl = (async (file) => {
  let path = "";
  const destination = file.destination;
  const destinationArray = destination.split('/');

  for (var i = 0; i < destinationArray.length; i++) {
    var des = destinationArray[i];

    if (i == 0) {
      continue;
    }

    path += "/";
    path += destinationArray[i];
  }
  path += "/";
  path += file.filename;

  return path;
});

const updateLastSeen = (async (conversation, groupMember, message) => {
  if (!(conversation && groupMember && message)) return;
  if (conversation.id != groupMember.conversationId) return;
  if (conversation.id != message.conversationId) return;
  if (groupMember.lastSeenId != message.id) {
    const prevLastSeenId = groupMember.lastSeenId;
    if (prevLastSeenId) {
      const prevMessage = await Chat.findOne({
        where: { id: prevLastSeenId },
      });
      if (prevMessage) {
        const prevTime = new Date(prevMessage.createdAt).getTime();
        const newTime = new Date(message.createdAt).getTime();
        if (prevTime > newTime) return;
        if (prevTime == newTime && prevMessage.id > message.id) return;
      }
    }
    await groupMember.update({
      lastSeenId: message.id
    });
    await groupMember.save();
    if (prevLastSeenId) {
      const messageToSend1 = await Chat.findOne({
        where: { id: prevLastSeenId },
        include: [{
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender'],
        }, {
          model: Group_Member,
          include: {
            model: User,
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender'],
          }
        }, {
          model: Media,
        },{
          model: Chat_Reaction,
          attributes: ['id', 'reactionId'],
          include: {
            model: User,
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
          }
        }]
      });
      if (messageToSend1) io.getIO().to("conversation" + conversation.id).emit("message", {
        action: "update",
        data: {
          chat: messageToSend1
        }
      });
    }

    const messageToSend2 = await Chat.findOne({
      where: { id: message.id },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender'],
      }, {
        model: Group_Member,
        include: {
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender'],
        }
      }, {
        model: Media,
      },{
        model: Chat_Reaction,
        attributes: ['id', 'reactionId'],
        include: {
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      }]
    });
    if (messageToSend2) io.getIO().to("conversation" + conversation.id).emit("message", {
      action: "update",
      data: {
        chat: messageToSend2
      }
    });
  }
});

exports.getConversationsByUserId = (async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findOne({
      group: ['conversations.id'],
      where: {
        id: userId
      },
      include: {
        model: Conversation,
        attributes: {
          include: [
            [
              // Note the wrapping parentheses in the call below!
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM chats AS chat
                WHERE 
                  chat.conversationId = conversations.id
                  AND
                  chat.id > \`conversations->group_member\`.\`lastSeenId\`
              )`),
              'n_messages'
            ]
          ],
        },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
          }, {
            model: User,
            as: 'partner',
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
          }, {
            model: Chat,
            attributes: []
          }
        ]
      }
    });

    if (!user) {
      return user;
    }

    const data = {
      conversations: user.conversations
    };

    return await apiData(res, 200, 'OK', data);
  } catch (err) {
    console.log(err);
    const data = {};
    return await apiData(res, 500, 'Fail', data);
  }
});

exports.postCreateConversation = (async (req, res, next) => {
  const body = req.body;
  const conversationName = body.conversationName;//string
  const conversationAvatarUrl = body.conversationAvatarUrl;//string
  const typeConversation = body.typeConversation;//int
  const partnerId = body.partnerId;//int

  const userId = req.userId;

  if (!(conversationName && typeConversation)) {
    const data = {};

    return await apiData(res, 500, 'Where your field ?', data);
  }

  try {
    const user = await checkStatusAccount(res, userId, User);

    if (!user) {
      return user;
    }

    let partner = null;

    if (typeConversation == 1) {
      if (!partnerId) {
        console.log(partnerId);
        return await apiData(res, 500, 'Where your field?', {});
      }

      partner = await checkStatusAccount(res, partnerId, User);

      if (!partner) {
        return partner;
      }
    }

    let last_message = '';

    if (typeConversation == 2) {
      last_message = 'Group was created by ' + [user.firstName, user.lastName].join(' ');
    } else if (typeConversation == 3) {
      last_message = 'Channel was created by ' + [user.firstName, user.lastName].join(' ');
    } else if (typeConversation == 1) {
      last_message = 'Direct message started by ' + [user.firstName, user.lastName].join(' ');
    }

    const conversation = await Conversation.create({
      name: conversationName,
      avatar: conversationAvatarUrl,
      typeId: typeConversation,
      last_message: last_message,
      max_member: 50,
      creatorId: user.id,
      partnerId: partnerId
    });

    if (!conversation) {
      return await apiData(res, 500, 'Create a conversation fail!', {});
    }

    const groupMember = await Group_Member.create({
      roleId: 1,
      userId: user.id,
      conversationId: conversation.id
    });

    if (!groupMember) {
      await Conversation.destroy({
        where: conversation.id
      });

      return res.status(200).json({
        error: {
          status: 500,
          message: 'Create conversation fail!'
        },
        data: {}
      });
    }

    if (partner && typeConversation == 1) {
      const groupPartner = await Group_Member.create({
        roleId: 1,
        userId: partnerId,
        conversationId: conversation.id
      });

      if (!groupPartner) {
        await Conversation.destroy({
          where: conversation.id
        });

        return res.status(200).json({
          error: {
            status: 500,
            message: 'Create conversation fail!'
          },
          data: {}
        });
      }
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

    const conversationToSend = await Conversation.findOne({
      where: {
        id: conversation.id
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }, {
          model: User,
          as: 'partner',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      ]
    });
    const data = {
      conversation: conversationToSend
    };

    io.getIO().in("user" + user.id).socketsJoin(["conversation" + conversation.id]);
    io.getIO().to(["user" + user.id]).emit('conversation', {
      action: 'create',
      data: data
    });

    if (partner) {
      io.getIO().in("user" + partner.id).socketsJoin(["conversation" + conversation.id]);
      io.getIO().to(["user" + partner.id]).emit('conversation', {
        action: 'create',
        data: data
      });
    }

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
  const conversationAvatarUrl = body.conversationAvatarUrl;

  const userId = req.userId;

  if (!(userId && conversationId && conversationName)) {
    const data = {};

    return await apiData(res, 500, 'Where your field ?', data);
  }
  try {
    const user = await checkStatusAccount(res, userId, User);

    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }, {
          model: User,
          as: 'partner',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      ]
    });

    if (!conversation) {
      const data = {};

      return await apiData(res, 500, 'This conversation doesn\'t exists!', data);
    }

    var message = 'Conversation was updated by ' + user.username;

    conversation.update({
      name: conversationName,
      avatar: conversationAvatarUrl,
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

    return await apiData(res, 500, 'Where your field ?!', data);
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
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }, {
          model: User,
          as: 'partner',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      ]
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

exports.getReactions = (async (req, res, next) => {
  try {
    const reactions = await Reaction.findAll();
    const data = {
      reactions: reactions
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
          attributes: ["id", "username", "firstName", "lastName", "avatar"],
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
  const userId = req.userId;
  const conversationId = req.query.conversationId;
  const memberIds = req.body.memberIds;
  let memberIdArray = [];
  let membersUpdated = [];

  if (!(conversationId)) {
    const data = {};

    return await apiData(res, 200, 'Where params ?', data);
  }

  var memberBodyType = typeof (memberIds);

  if (!(memberIds)) {
    const data = {};

    return await apiData(res, 200, 'Where body ?', data);
  } else if (memberBodyType == "string" || memberBodyType == "number") {
    memberIdArray.push(memberIds);
  } else if (Array.isArray(memberIds)) {
    memberIdArray = Array.from(memberIds);
  }

  try {
    const group = await Conversation.findOne({
      where: {
        id: conversationId
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }, {
          model: User,
          as: 'partner',
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      ]
    });

    if (!group) {
      const data = {};

      return await apiData(res, 500, 'This group doesn\'t exists!', data);
    }

    const members = await Group_Member.findAll({
      where: {
        conversationId: group.id
      }
    });

    if (group.max_member) {
      if (members.length + memberIdArray.length > group.max_member) {
        const data = {};

        return await apiData(res, 500, 'This conversation have max member is: ' + group.max_member, data);
      }
    }

    const user = await User.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      return user;
    }

    for (var memberId of memberIds) {
      if (typeof (memberId) != "number") {
        continue;
      }

      const member = await User.findOne({
        where: {
          id: memberId,
          status: 1
        }
      });

      if (!member) {
        continue;
      }

      const memberInGroup = await Group_Member.findOne({
        where: {
          conversationId: group.id,
          userId: member.id
        }
      });

      if (memberInGroup) {
        continue;
      }

      const newMember = await Group_Member.create({
        conversationId: conversationId,
        userId: memberId,
        roleId: 2
      });

      if (!newMember) {
        continue;
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

        continue;
      }

      membersUpdated.push(member);

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
    }

    const data = {
      membersUpdated: membersUpdated
    };

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
        include: [{
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender'],
        }, {
          model: Group_Member,
          include: {
            model: User,
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender'],
          }
        }, {
          model: Media
        },{
          model: Chat_Reaction,
          attributes: ['id', 'reactionId'],
          include: {
            model: User,
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
          }
        }]
      }
    });

    if (!conversation) {
      const data = {};

      return await apiData(res, 500, 'Please create conversation!', data);
    }

    const groupMember = req.userInGroup;

    if (!groupMember) {
      return await apiData(res, 500, 'Please create conversation!', {});
    }
    const lastMessage = await Chat.findOne({
      order: [
        ['createdAt', 'desc'],
        ['id', 'desc']
      ],
      where: {
        conversationId: conversationId
      }
    });
    if (lastMessage && groupMember.lastSeenId != lastMessage.id) await updateLastSeen(conversation, groupMember, lastMessage);

    const data = {
      chats: conversation.chats
    };

    return await apiData(res, 200, 'OK', data);
  } catch (err) {
    console.log(err);
    var data = {};
    return await apiData(res, 401, 'Fail', data);
  }
});

exports.postSendMessage = (async (req, res, next) => {
  const userId = req.userId;
  const conversationId = req.query.conversationId;
  const message = req.body.message;
  const mediaIds = req.body.mediaIds;
  const groupMember = req.userInGroup;

  if (!((message||(mediaIds && mediaIds.length)) && conversationId)) {
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
      },
      include: [
        {
          model: User.scope('userBasicInfo'),
          as: 'creator'
        }, {
          model: User.scope('userBasicInfo'),
          as: 'partner'
        }
      ]
    });

    if (!conversation) {
      const data = {};

      return await apiData(res, 500, 'Please create conversation!', data);
    }
    if (message) {
      await conversation.update({
        last_message: message
      });
      await conversation.save();
    } else if (mediaIds && mediaIds.length) {
      await conversation.update({
        last_message: [user.firstName, user.lastName].join(' ') + " uploaded files"
      });
      await conversation.save();
    }
    

    const newMessage = await Chat.create({
      message: message,
      status: 1,
      userId: user.id,
      conversationId: conversation.id
    });
    for (let mediaId of mediaIds) {
      const media = await Media.findOne({
        where: {
          id: mediaId
        }
      });
      if (media) {
        const chat_media = await Chat_Media.create({
          chatId: newMessage.id,
          mediumId: mediaId
        });
      }
    }
    if (newMessage && groupMember.lastSeenId != newMessage.id) {
      prevLastSeenId = groupMember.lastSeenId;
      await groupMember.update({
        lastSeenId: newMessage.id
      });
      await groupMember.save();
      const messageToSend1 = await Chat.findOne({
        where: { id: prevLastSeenId },
        include: [{
          model: User.scope('userBasicInfo'),
        }, {
          model: Group_Member,
          include: {
            model: User.scope('userBasicInfo'),
          }
        }, {
          model: Media,
        },{
          model: Chat_Reaction,
          attributes: ['id', 'reactionId'],
          include: {
            model: User,
            attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
          }
        }]
      });
      if (messageToSend1) io.getIO().to("conversation" + conversation.id).emit("message", {
        action: "update",
        data: {
          chat: messageToSend1
        }
      });
    }

    const messageToSend = await Chat.findOne({
      where: {
        id: newMessage.id
      },
      include: [{
        model: User.scope('userBasicInfo'),
      }, {
        model: Group_Member,
        include: {
          model: User.scope('userBasicInfo'),
        }
      }, {
        model: Media,
      },{
        model: Chat_Reaction,
        attributes: ['id', 'reactionId'],
        include: {
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      }]
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

exports.postEditMessage = (async (req, res, next) => {
  const userInGroup = req.userInGroup;
  const messageId = req.body.messageId;
  const messageContent = req.body.messageContent;
  const userId = req.userId;

  if (!(messageId && userInGroup && messageContent)) {
    return await apiData(res, 500, 'Where your field ?', {});
  }

  const messageToSend = await Chat.findOne({
    where: {
      id: messageId
    },
    include: [{
      model: User.scope('userBasicInfo'),
    }, {
      model: Group_Member,
      include: {
        model: User.scope('userBasicInfo'),
      }
    }, {
      model: Media,
    },{
      model: Chat_Reaction,
      attributes: ['id', 'reactionId'],
      include: {
        model: User,
        attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
      }
    }]
  });

  if (!messageToSend) {
    return await apiData(res, 500, 'This message doesn\'t exists?', {});
  }

  if (messageToSend.userId !== userId) {
    return await apiData(res, 500, 'You are not the message creator!', {});
  }

  await messageToSend.update({
    message: messageContent,
    status: 2
  });
  await messageToSend.save();

  const data = {
    chat: messageToSend
  };

  io.getIO().to("conversation" + userInGroup.conversationId).emit("message", {
    action: "update",
    data: data
  });

  await apiData(res, 200, 'Send message successfully!', data);
});

exports.postDeleteMessage = (async (req, res, next) => {
  const userInGroup = req.userInGroup;
  const messageId = req.body.messageId;
  const userId = req.userId;

  if (!(messageId && userInGroup)) {
    return await apiData(res, 500, 'Where your field ?', {});
  }

  const message = await Chat.findOne({
    where: {
      id: messageId
    },
    include: [{
      model: User.scope('userBasicInfo'),
    }, {
      model: Group_Member,
      include: {
        model: User.scope('userBasicInfo'),
      }
    }]
  });

  if (!message) {
    return await apiData(res, 500, 'This message doesn\'t exists?', {});
  }

  if( message.status == 0 ) {
    return await apiData(res, 500, 'This message already deleted!', {});
  }

  if (message.userId != userId && userInGroup.roleId != 1) {
    return await apiData(res, 500, 'Not enough permission to delele this message!', {});
  }

  await message.update({
    message: "",
    status: 0
  });
  await message.save();

  await Chat_Media.destroy({
    where: {
      chatId: message.id
    }
  });
  
  io.getIO().to("conversation" + userInGroup.conversationId).emit("message", {
    action: "update",
    data: {
      chat: message
    }
  });
  await apiData(res, 200, 'This message has been deleted!', {});
});

exports.getFindUser = (async (req, res, next) => {
  let limitReturnData = 20;
  let searchQuery = req.query.search;
  let users;
  // try {
  if (!searchQuery || searchQuery == '') {
    users = await User.findAll({
      order: Sequelize.literal('rand()'),
      where: {
        status: 1
      },
      attributes: ["id", "username", "firstName", "lastName", "avatar", "status"],
      limit: limitReturnData
    });
  } else {
    users = await User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                username: {
                  [Op.startsWith]: searchQuery
                }
              },
              Sequelize.where(
                Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), {
                [Op.startsWith]: searchQuery
              }
              )
            ]
          },
          {
            status: 1
          }
        ]
      },
      attributes: ["id", "username", "firstName", "lastName", "avatar", "status"]
    });
  }

  var data = {
    users: users
  };

  return await apiData(res, 200, 'OK', data);
  // } catch (err) {
  //   var data = {};
  //   return await apiData(res, 401, 'Fail', data);
  // }
});

exports.postLeaveGroup = (async (req, res, next) => {
  const conversationId = req.query.conversationId;
  const userId = req.userId;

  if (!conversationId) {
    const data = {};
    return await apiData(res, 500, 'Where params ?', data);
  }

  // try {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
      }, {
        model: User,
        as: 'partner',
        attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
      }
    ]
  });

  if (!conversation) {
    const data = {};
    await apiData(res, 500, 'THis conversation doesn\'t exists!', data);
  }

  const user = await User.findOne({
    where: {
      id: userId
    }
  });

  const userInGroup = await Group_Member.findOne({
    where: {
      conversationId: conversationId,
      userId: userId
    }
  });

  if (!userInGroup) {
    const data = {};

    return await apiData(res, 500, 'You was leave this conversation!', data);
  }

  var message = '@' + user.username + ' has left the conversation!';

  const newMessage = await Chat.create({
    message: message,
    status: 1,
    conversationId: conversation.id
  });

  if (!newMessage) {
    const data = {};
    return await apiData(res, 500, 'Leave this conversation fail!', data);
  }

  const members = await Group_Member.findAll({
    where: {
      conversationId: conversationId
    }
  });

  if (members.length < 2) {
    await Chat.destroy({
      where: {
        conversationId: conversationId
      }
    });

    await Conversation.destroy({
      where: {
        id: conversationId
      }
    });

    io.getIO().to("conversation" + conversationId).emit("conversation", {
      action: 'delete',
      message: "Conversation has been deleted!",
      conversationId: conversationId
    });
    io.getIO().socketsLeave("conversation" + conversationId);

    return await apiData(res, 200, "Conversation has been deleted!", {});
  }

  if (userInGroup.roleId == 1) {
    members.forEach(member => {
      if (member.userId != userId) {
        Group_Member.findOne({
          where: {
            conversationId: conversationId,
            userId: member.userId
          }
        })
          .then(memberToSet => {
            if (memberToSet) {
              memberToSet.update({
                roleId: 1
              });
              memberToSet.save();

              User.findOne({
                where: {
                  id: memberToSet.userId
                }
              }).then(ur => {
                Chat.create({
                  message: [ur.firstName, ur.lastName].join(' ') + " has been promoted to Leader",
                  status: 1,
                  conversationId: conversation.id
                })
                  .then(newMessage => {
                    conversation.update({
                      last_message: newMessage.message
                    });
                    conversation.save();

                    io.getIO().to("conversation" + conversationId).emit("message", {
                      action: "newMessage",
                      data: {
                        chat: newMessage
                      }
                    });
                  });

                io.getIO().to("conversation" + conversationId).emit("conversation", {
                  action: "update",
                  data: {
                    conversation: conversation
                  }
                });
              });
            }
          });
      }
    });
  }

  await conversation.update({
    last_message: message
  });
  conversation.save();

  userInGroup.destroy();

  const data = {
    conversation: conversation
  }
  io.getIO().in("user" + user.id).socketsLeave("conversation" + conversation.id);
  io.getIO().to("conversation" + conversation.id).emit("message", {
    action: "newMessage",
    data: {
      chat: newMessage
    }
  });

  io.getIO().to("conversation" + conversation.id).emit("conversation", {
    action: 'update',
    data: data
  });

  await apiData(res, 200, message, data);
  // } catch (err) {
  //   const data = {};

  //   return await apiData(res, 500, 'Fail', data);
  // }
});

exports.getFilesByUserId = (async (req, res, next) => {
  const userId = req.userId;

  const medias = await Media.findAll({
    where: userId,
  });

  return await apiData(res, 200, 'OK', {
    medias: medias
  });
});

exports.postUploadFiles = (async (req, res, next) => {
  const files = req.files;
  const medias = [];
  const userId = req.userId;

  for (let i = 0; i < files.length; i++) {
    var file = req.files[i];
    var path = await pathFileInUrl(file);
    var media = await Media.create({
      originalName: file.originalname,
      path: path,
      userId: userId,
      mimeType: file.mimetype,
      size: file.size
    });

    if (!media) {
      continue;
    }

    medias.push(media);
  }

  return await apiData(res, 200, 'Upload files successfully', {
    medias: medias,
    filesUploaded: files.length + "/" + medias.length
  });
});

exports.postDeleteImage = (async (req, res, next) => {
});

exports.postSetLastSeen = (async (req, res, next) => {
  const userId = req.userId;
  const conversationId = req.query.conversationId;
  const groupMember = req.userInGroup;
  if (!(conversationId)) {
    const data = {};

    return await apiData(res, 500, 'Where is your params ?', data);
  }
  try {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      }
    });
    if (!conversation) {
      const data = {};

      return await apiData(res, 500, 'No such conversation!', data);
    }
    const groupMember = req.userInGroup;

    if (!groupMember) {
      return await apiData(res, 500, 'Not a member in group', {});
    }
    const lastMessage = await Chat.findOne({
      order: [
        ['createdAt', 'desc'],
        ['id', 'desc']
      ],
      where: {
        conversationId: conversationId
      }
    });
    if (lastMessage && groupMember.lastSeenId != lastMessage.id) await updateLastSeen(conversation, groupMember, lastMessage);
    return await apiData(res, 200, 'OK', {});
  } catch (err) {
    console.log(new Date(), err);
    return await apiData(res, 401, 'Fail', {});
  }
});
exports.postReaction = (async (req, res, next) => {
  const userId = req.userId;
  const conversationId = req.query.conversationId;
  const messageId = req.query.messageId;
  const groupMember = req.userInGroup;
  const reactionId = req.body.reactionId;
  if (!(conversationId)) {
    const data = {};

    return await apiData(res, 500, 'Where is your params ?', data);
  }
  try {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      }
    });
    if (!conversation) {
      const data = {};

      return await apiData(res, 500, 'No such conversation!', data);
    }
    const groupMember = req.userInGroup;

    if (!groupMember) {
      return await apiData(res, 500, 'Not a member in group', {});
    }
    const message = await Chat.findOne({
      where: {
        id: messageId,
        conversationId: conversationId
      }
    });
    if (!message) return await apiData(res, 500, 'Not a message in conversation', {});
    const reaction = await Reaction.findOne({
      where: {
        id: reactionId
      }
    });
    if (!reaction) return await apiData(res, 500, 'Not a valid reaction', {});
    const chat_reaction = await Chat_Reaction.create({
      userId: userId,
      chatId: messageId,
      reactionId: reactionId
    })
    if (!chat_reaction) return await apiData(res, 500, 'Failed to add a reaction!', {});

    const messageToSend = await Chat.findOne({
      where: { id: messageId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
      }, {
        model: Group_Member,
        include: {
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      }, {
        model: Media,
      },{
        model: Chat_Reaction,
        attributes: ['id', 'reactionId'],
        include: {
          model: User,
          attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
        }
      }]
    });
    if (messageToSend) io.getIO().to("conversation" + conversationId).emit("message", {
      action: "update",
      data: {
        chat: messageToSend
      }
    });
    return await apiData(res, 200, 'OK', {chat: messageToSend});
  } catch (err) {
    console.log(new Date(), err);
    return await apiData(res, 401, 'Fail', {});
  }
});
