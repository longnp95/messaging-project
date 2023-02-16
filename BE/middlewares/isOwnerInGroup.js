const Group_Member = require('../models/group_member');

module.exports = (async (req, res, next) => {
  const userId = req.userId;
  const conversationId = req.query.conversationId;

  const userInGroup = await Group_Member.findOne({
    where: {
      conversationId: conversationId,
      userId: userId
    }
  });

  if (userInGroup.roleId != 1) {
    return await res.status(200).json({
      error: {
        status: 500,
        message: 'Don\'t have permission!'
      },
      data: {}
    });
  }

  next();
});