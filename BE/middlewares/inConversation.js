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

module.exports = (async (req, res, next) => {
  const userId = req.userId;
  const conversationId = req.query.conversationId;

  if (!conversationId) {
    return await apiData(res, 500, 'No conversationId provided', {});
  }

  const userInGroup = await Group_Member.findOne({
    where: {
      conversationId: conversationId,
      userId: userId
    }
  });

  if (!userInGroup) {
    return await apiData(res, 500, 'Don\'t have permission in group!', {});
  }
  req.userInGroup = userInGroup;
  next();
});