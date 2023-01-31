const io = require('../socket');
const User = require('../models/user');
const Group_Member = require('../models/group_member');
const Conversation = require('../models/conversation');
const Role = require('../models/role');

const checkStatusUser = function (user) {
  if (user) {
    if (user.status == 1) {
      return true;
    } else {
      return 'This user is block';
    }
  } else {
    return 'This user is doesn\'t exists';
  }
}

exports.postCreateConversation = (async (req, res, next) => {
  const body = req.body;
  const conversationName = body.conversationName;//string
  const conversationAvatarUrl = body.conversationAvatarUrl;//string
  const typeConversation = body.typeConversation;//int

  const userId = req.query.userId;

  if (!(conversationName && conversationAvatarUrl && typeConversation && userId)) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where your feild ?'
      },
      data: {}
    });
  }

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
    userId: createdBy,
    groupId: conversation.id
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

  if (!(userId && conversationId && conversationName && conversationAvatarUrl)) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where your feild ?'
      },
      data: {}
    });
  }

  const conversation = Conversation.findOne({
    id: conversationId
  });

  if (!conversation) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This conversation doesn\'t exists!'
      },
      data: {}
    });
  }

  conversation.update({
    name: conversationName,
    avatar: conversationAvatarUrl,
    typeId: typeConversation
  });
  conversation.save();

  io.getIO().emit('conversation', {
    action: 'update',
    data: {
      conversation: conversation,
    }
  });

  res.status(200).json({
    error: {
      status: 200,
      message: 'Edit group successfully!'
    },
    data: {
      conversation: conversation,
    }
  });
});

exports.postSetRole = (async (req, res, next) => {
  const userId = req.query.userId;
  const body = req.body;
  const conservationId = body.conservationId;
  const memberId = body.memberId;
  const roleId = body.roleId;

  if (!(userId && conservationId && memberId && roleId)) {
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

  const conservation = await Conversation.findOne({
    where: {
      id: conservationId
    }
  });

  if (!conservation) {
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
      conservationId: conservationId
    }
  });

  const memberInGroup = await Group_Member.findOne({
    where: {
      userId: memberId,
      conservationId: conservationId
    }
  });

  if (!userInGroup) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'You are don\'t have permission in ' + conservation.name + '!'
      },
      data: {}
    });
  }

  if (!memberInGroup) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This account doesn\'t exists in ' + conservation.name + '!'
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
        message: 'This account doesn\'t exists in ' + conservation.name + '!'
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

exports.getConversationsByUserId = (async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where params ?'
      },
      data: {}
    });
  }

  const user = await User.findOne({
    where: {
      id: userId
    },
    include: {
      all: true,
      nested: true
    }
  });

  if (!user) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This user doesn\'t exists!'
      },
      data: {}
    });
  }

  return res.status(200).json({
    error: {
      status: 200,
      message: 'OK'
    },
    data: {
      conversations: user.conversations
    }
  });
});

exports.getMembersInGroup = (async (req, res, next) => {
  const groupId = req.query.groupId;

  if (!groupId) {
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
      id: groupId
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
      groupId: groupId
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
  const groupId = req.query.groupId;
  const memberId = req.body.memberId;

  if (!(groupId && userId)) {
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
      id: groupId
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

  const member = await User.findOne({
    where: {
      id: memberId
    }
  });

  if (!member) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This user doesn\'t exists!'
      },
      data: {}
    });
  }

  if (member && member.status == 0) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'This user does deactivate!'
      },
      data: {}
    });
  }

  const memberInGroup = await Group_Member.findOne({
    where: {
      groupId: groupId,
      userId: memberId
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
      groupId: groupId,
      userId: memberId,
      roleId: 2
    });

    if (newMember) {
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
})