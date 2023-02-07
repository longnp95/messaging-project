const io = require('../socket');
const User = require('../models/user');
const Group_Member = require('../models/group_member');
const Conversation = require('../models/conversation');
const Role = require('../models/role');
const Type = require('../models/type');

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

    await apiData(res, 500, 'Where your field ?', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  const conversation = await Conversation.create({
    name: conversationName,
    avatar: conversationAvatarUrl,
    typeId: typeConversation
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
        message: 'Create a group fail!'
      },
      data: {}
    });
  }

  io.getIO().emit('conversation', {
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

    await apiData(res, 500, 'Where your field ?', data);
  }

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!conversation) {
    const data = {};

    await apiData(res, 500, 'This conversation doesn\'t exists!', data);
  }

  conversation.update({
    name: conversationName,
    avatar: conversationAvatarUrl,
    typeId: typeConversation
  });
  conversation.save();

  io.getIO().to("conversation" + conversation.id).emit('conversation', {
    action: 'update',
    data: {
      conversation: conversation,
    }
  });

  const data = {
    conversation: conversation,
  };

  await apiData(res, 200, 'Edit group successfully!', data);
});

exports.postSetRole = (async (req, res, next) => {
  const userId = req.query.userId;
  const body = req.body;
  const conversationId = body.conversationId;
  const memberId = body.memberId;
  const roleId = body.roleId;

  if (!(userId && conversationId && memberId && roleId)) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where your feild ?'
      },
      data: {}
    });
  }

  const user = await User.findOne({
    where: {
      id: userId
    }
  });

  const member = await User.findOne({
    where: {
      id: memberId
    }
  });

  const statusUser = checkStatusUser(user);
  const statusMember = checkStatusUser(member);

  if (statusUser != true) {
    return res.status(200).json({
      error: {
        status: 500,
        message: statusUser.toString()
      },
      data: {}
    });
  }

  if (statusMember != true) {
    return res.status(200).json({
      error: {
        status: 500,
        message: statusMember.toString()
      },
      data: {}
    });
  }

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!conversation) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This group doesn\'t exists!'
      },
      data: {}
    });
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
    return res.status(200).json({
      error: {
        status: 500,
        message: 'You are don\'t have permission in ' + conversation.name + '!'
      },
      data: {}
    });
  }

  if (!memberInGroup) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This account doesn\'t exists in ' + conversation.name + '!'
      },
      data: {}
    });
  }

  if (userInGroup.roleId < memberInGroup.roleId) {
    memberInGroup.update({
      roleId: roleId
    });
    memberInGroup.save();

    io.getIO().emit('group', {
      action: 'setRole',
      data: {
        memberInGroup: memberInGroup,
      }
    });

    res.status(200).json({
      error: {
        status: 200,
        message: 'Set Role successfully!'
      },
      data: {}
    });
  } else {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This account doesn\'t exists in ' + conversation.name + '!'
      },
      data: {}
    });
  }
});

exports.getRoles = (async (req, res, next) => {
  const roles = await Role.findAll();

  return res.status(200).json({
    error: {
      status: 200,
      message: 'OK'
    },
    data: {
      roles: roles
    }
  });
});

exports.getMembersInGroup = (async (req, res, next) => {
  const conversationId = req.query.conversationId;

  if (!conversationId) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where params ?'
      },
      data: {}
    });
  }

  const group = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!group) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This group doesn\'t exists!'
      },
      data: {}
    });
  }

  const members = await Group_Member.findAll({
    where: {
      conversationId: conversationId
    },
    include: {
      all: true,
      nested: true
    }
  });

  return res.status(200).json({
    error: {
      status: 200,
      message: 'OK'
    },
    data: {
      members: members
    }
  });
});

exports.postAddMemberInGroup = (async (req, res, next) => {
  const userId = req.query.userId;
  const conversationId = req.query.conversationId;
  const memberId = req.body.memberId;

  if (!(conversationId && userId)) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where params ?'
      },
      data: {}
    });
  }

  if (!(memberId)) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where body ?'
      },
      data: {}
    });
  }

  const group = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!group) {
    const data = {};

    await apiData(res, 500, 'This group doesn\'t exists!', data);
  }

  const member = await checkStatusAccount(res, memberId, User);

  const memberInGroup = await Group_Member.findOne({
    where: {
      conversationId: group.id,
      userId: member.id
    },
    include: {
      all: true,
      nested: true
    }
  });

  if (memberInGroup) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This user does exists in group!'
      },
      data: {}
    });
  } else {
    const newMember = await Group_Member.create({
      conversationId: conversationId,
      userId: memberId,
      roleId: 2
    });

    if (newMember) {
      io.getIO().to("conversation" + conversationId).emit('group', {
        action: 'addMember',
        data: {
          member: member
        }
      });

      return res.status(200).json({
        error: {
          status: 500,
          message: 'Add ' + member.firstName + ' ' + member.lastName + ' in group successfully!'
        },
        data: {}
      });
    } else {
      return res.status(200).json({
        error: {
          status: 500,
          message: 'Add ' + member.firstName + ' ' + member.lastName + ' in group fail!'
        },
        data: {}
      });
    }
  }
});

exports.sendMessage = (async (req, res, next) => {
  const userId = req.query.userId;
  const conversationId = req.query.conversationId;
  const message = req.body.message;

  if (!(message && conversationId)) {
    const data = {};

    await apiData(res, 500, 'Where your params ?', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    }
  });

  if (!conversation) {
    const data = {
      action: 'create new conversation'
    };

    await apiData(res, 500, 'Please create conversaion!', data);
  }

  const newMessage = await Chat.create({
    message: message,
    status: 1,
    userId: user.id,
    conversation: conversation.id
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

    await apiData(res, 500, 'Send message faild!', data);
  }
});