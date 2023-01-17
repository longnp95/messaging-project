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

// exports.postCreateGroup = (async (req, res, next) => {
//   const body = req.body;
//   const groupName = body.groupName;
//   const groupAvatarUrl = body.groupAvatarUrl;
//   const createdBy = body.createdBy;

//   if (!(groupName && groupAvatarUrl && createdBy)) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Where your feild ?'
//       },
//       data: {}
//     });
//   }

//   const group = await Group.create({
//     name: groupName,
//     avatar: groupAvatarUrl
//   });

//   if (!group) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Create a group member faild!'
//       },
//       data: {}
//     });
//   }

//   const groupMember = await Group_Member.create({
//     roleId: 1,
//     userId: createdBy,
//     groupId: group.id
//   });

//   if (!groupMember) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Create a group member faild!'
//       },
//       data: {}
//     });
//   }

//   io.getIO().emit('group', {
//     action: 'create',
//     data: {
//       group: group,
//     }
//   });

//   res.status(200).json({
//     error: {
//       status: 200,
//       message: 'Create a group member successfully!'
//     },
//     data: {
//       group: group,
//     }
//   });
// });

// exports.postUpdateGroup = (async (req, res, next) => {
//   const body = req.body;
//   const groupName = body.groupName;
//   const groupAvatarUrl = body.groupAvatarUrl;
//   const createdBy = body.createdBy;

//   if (!(groupName && groupAvatarUrl && createdBy)) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Where your feild ?'
//       },
//       data: {}
//     });
//   }

//   const group = await Group.create({
//     name: groupName,
//     avatar: groupAvatarUrl
//   });

//   if (!group) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Create a group member faild!'
//       },
//       data: {}
//     });
//   }

//   const groupMember = await Group_Member.create({
//     roleId: 1,
//     userId: createdBy,
//     groupId: group.id
//   });

//   if (!groupMember) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Create a group member faild!'
//       },
//       data: {}
//     });
//   }

//   io.getIO().emit('group', {
//     action: 'create',
//     data: {
//       group: group,
//     }
//   });

//   res.status(200).json({
//     error: {
//       status: 200,
//       message: 'Create a group member successfully!'
//     },
//     data: {
//       group: group,
//     }
//   });
// });

// exports.postSetRole = (async (req, res, next) => {
//   const body = req.body;
//   const userId = body.userId;
//   const conservationId = body.conservationId;
//   const memberId = body.memberId;
//   const roleId = body.roleId;

//   if (!(userId && groupId && memberId && roleId)) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Where your feild ?'
//       },
//       data: {}
//     });
//   }

//   const user = await User.findOne({
//     where: {
//       id: userId
//     }
//   });

//   const member = await Group.findOne({
//     where: {
//       id: memberId
//     }
//   });

//   const statusUser = checkStatusUser(user);
//   const statusMember = checkStatusUser(member);

//   if (statusUser != true) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: statusUser.toString()
//       },
//       data: {}
//     });
//   }

//   if (statusMember != true) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: statusMember.toString()
//       },
//       data: {}
//     });
//   }

//   const conservation = await Conversation.findOne({
//     where: {
//       id: groupId
//     }
//   });

//   if (!group) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'This group doesn\'t exists!'
//       },
//       data: {}
//     });
//   }

//   const userInGroup = await Group_Member.findOne({
//     where: {
//       userId: userId,
//       conservationId: conservationId
//     }
//   });

//   const memberInGroup = await Group_Member.findOne({
//     where: {
//       userId: memberId,
//       conservationId: conservationId
//     }
//   });

//   if (!userInGroup) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'You are don\'t have permission in ' + group.name + '!'
//       },
//       data: {}
//     });
//   }

//   if (!memberInGroup) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'This account doesn\'t exists in ' + group.name + '!'
//       },
//       data: {}
//     });
//   }

//   if (userInGroup.roleId < memberInGroup.roleId) {
//     io.getIO().emit('group', {
//       action: 'setRole',
//       data: {
//         memberInGroup: memberInGroup,
//       }
//     });

//     await Group_Member.update(
//       {
//         roleId: roleId
//       },
//       {
//         where: {
//           id: memberInGroup
//         }
//       }
//     );

//     res.status(200).json({
//       error: {
//         status: 200,
//         message: 'Set Role successfully'
//       },
//       data: {}
//     });
//   } else {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'This account doesn\'t exists in ' + group.name + '!'
//       },
//       data: {}
//     });
//   }
// });

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

// exports.getGroupsByUserId = (async (req, res, next) => {
//   const userId = req.query.userId;

//   if (!userId) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Where params ?'
//       },
//       data: {}
//     });
//   }

//   const user = await User.findOne({
//     where: {
//       id: userId
//     },
//     include: {
//       all: true,
//       nested: true
//     }
//   });

//   if (!user) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'This user doesn\'t exists!'
//       },
//       data: {}
//     });
//   }

//   return res.status(200).json({
//     error: {
//       status: 200,
//       message: 'OK'
//     },
//     data: {
//       groups: user.groups
//     }
//   });
// });

// exports.getMembersInGroup = (async (req, res, next) => {
//   const groupId = req.query.groupId;

//   if (!groupId) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'Where params ?'
//       },
//       data: {}
//     });
//   }

//   const group = await Group.findOne({
//     where: {
//       id: groupId
//     }
//   });

//   if (!group) {
//     return res.status(200).json({
//       error: {
//         status: 500,
//         message: 'This group doesn\'t exists!'
//       },
//       data: {}
//     });
//   }

//   const members = await Group_Member.findAll({
//     where: {
//       groupId: groupId
//     },
//     include: {
//       all: true,
//       nested: true
//     }
//   });

//   return res.status(200).json({
//     error: {
//       status: 200,
//       message: 'OK'
//     },
//     data: {
//       members: members
//     }
//   });
// });