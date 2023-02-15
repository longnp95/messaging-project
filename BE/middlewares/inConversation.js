const Group_Member = require('../models/group_member');

module.exports = (async (req, res, next) => {
  const userInGroup = await Group_Member.findOne({
    where: {
      conversationId: conversationId,
      userId: userId
    }
  });

  if (!userInGroup) {
    return await apiData(res, 500, 'Don\'t have permission in group!', {});
  }

  next();
});