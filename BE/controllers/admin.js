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

exports.getAllUser = (async (req, res, next) => {
  const users = await User.findAll();

  return res.status(200).json({
    error: {
      status: 200,
      message: 'OK'
    },
    data: {
      users: users
    }
  });
});

exports.getUser = (async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(200).json({
      error: {
        status: 500,
        message: "Where params ?"
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

  const statusUser = checkStatusUser(user);

  if (statusUser != true) {
    return res.status(200).json({
      error: {
        status: 500,
        message: statusUser
      }
    });
  }

  return res.status(200).json({
    error: {
      status: 200,
      message: 'OK'
    },
    data: {
      user: user
    }
  });
});

exports.postUpdateUser = (async (req, res, next) => {
  const userId = req.query.userId;

  
});