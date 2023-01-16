const User = require('../models/user');
const Group_Member = require('../models/group_member');
const Group = require('../models/group');
const Role = require('../models/role');

exports.postCreateGroup = (async (req, res, next) => {
  const body = req.body;

  if (body) {
    const groupName = body.groupName;
    const groupAvatarUrl = body.groupAvatarUrl;
    const createdBy = body.createdBy;

    if (groupName && groupAvatarUrl, createdBy) {
      const group = await Group.create({
        name: groupName,
        avatar: groupAvatarUrl
      });

      const groupMember = await Group_Member.create({
        roleId: 1,
        userId: createdBy,
        groupId: group.id
      });

      if (group && groupMember) {
        return res.status(200).json({
          error: {
            status: 200,
            message: 'Create a group member successfully!'
          },
          data: {}
        });
      } else {
        return res.status(200).json({
          error: {
            status: 500,
            message: 'Create a group member faild!'
          },
          data: {}
        });
      }
    } else {
      return res.status(200).json({
        error: {
          status: 500,
          message: 'Where your feild ?'
        },
        data: {}
      });
    }
  } else {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where your body ?'
      },
      data: {}
    });
  }
});