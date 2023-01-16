const User = require('../models/user');
const Group = require('../models/group');
const Role = require('../models/role');

exports.postCreateGroup = (async (req, res, next) => {
  const userId = req.userId;
  const body = req.body;

  if (!body) {
    return 
  }
});