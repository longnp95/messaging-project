const io = require('../socket');
const Admin = require('../models/admin');
const User = require('../models/user');
const Group_Member = require('../models/group_member');
const Role = require('../models/role');

const checkStatusAccount = (async (res, id, table) => {
  if (id) {
    const data = await table.findOne({
      where: {
        id: id
      },
      include: {
        all: true,
        nested: true
      }
    });

    if (!data) {
      const returnData = {};

      await apiData(res, 500, 'This account doesn\'t exists', returnData);
    } else if (data.status == 1) {
      return data;
    } else {
      const returnData = {};

      await apiData(req, 500, 'This account is block', returnData);
    }
  } else {
    await apiData(res, 500, 'Where your params ?', data);
  }
});

const changeStatusAccount = (async (res, id, status, table) => {
  if (id) {
    const user = await checkStatusAccount(req, id, table);

    if (user) {
      await user.update({
        status: 1
      });
      await user.save();

      const data = {
        user: user
      };

      return user;
    }
  } else {
    await apiData(res, 500, 'Where your params ?', data);
  }
});

const apiData = (async (res, status, message, data) => {
  return res.status(200).json({
    error: {
      status: status,
      message: message
    },
    data: data
  });
});

exports.getAllUser = (async (req, res, next) => {
  const users = await User.findAll({
    order: [
      ['updatedAt', 'DESC'],
    ]
  });

  const data = {
    users: users
  };

  await apiData(res, 200, 'OK', data);
});

exports.getUser = (async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    const data = {};
    await apiData(res, 500, 'Where params ?', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  if (user) {
    await apiData(res, 200, 'OK', user);
  }
});

exports.postCreateUser = (async (req, res, next) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;
  const firstName = body.firstName;
  const lastName = body.lastName;
  const gender = body.gender;
  const avatarUrl = body.avatarUrl;
  const dob = body.dateOfBirth;
  const mobile = body.phoneNumber;
  const email = body.email;
  const userId = req.query.userId;

  if (!(username && password && firstName && lastName && gender && avatarUrl && dob && mobile && email)) {
    const data = {}
    await apiData(res, 500, 'Where params ?', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  if (user) {
    const user = await User.create({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      avatarUrl: avatarUrl,
      dob: dob,
      mobile: mobile,
      email: email
    });

    if (!user) {
      const data = {
        user: user
      };

      io.getIO().emit('user', {
        action: 'create',
        data: {
          user: user,
        }
      });
      await apiData(res, 200, 'Create an account successfullly with username: ' + user.username + ' !', data);
    } else {
      const data = {};
      await apiData(res, 500, 'Create an account fail!', data);
    }
  }
});

exports.postUpdateUser = (async (req, res, next) => {
  const body = req.body;
  const id = body.id;
  const username = body.username;
  const password = body.password;
  const firstName = body.firstName;
  const lastName = body.lastName;
  const gender = body.gender;
  const avatarUrl = body.avatarUrl;
  const dob = body.dateOfBirth;
  const mobile = body.phoneNumber;
  const email = body.email;
  const userId = req.query.userId;

  if (!(id && username && password && firstName && lastName && gender && avatarUrl && dob && mobile && email)) {
    const data = {};
    await apiData(res, 500, 'Where your feild ?', data);
  }

  if (id != userId) {
    const data = {};
    await apiData(res, 500, 'Id and userId wrong!', data);
  }

  const user = await checkStatusAccount(res, userId, User);

  if (user) {
    await user.update({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      avatarUrl: avatarUrl,
      dob: dob,
      mobile: mobile,
      email: email
    });
    await user.save();

    if (!user) {
      const data = {};
      await apiData(res, 500, 'Update an account fail!', data);
    } else {
      const data = {
        user: user
      };

      io.getIO().emit('user', {
        action: 'update',
        data: {
          user: user,
        }
      });
      await apiData(res, 200, 'Update an account successfullly!', data);
    }
  }
});

exports.postActivavteUser = (async (req, res, next) => {
  const userId = req.qeury.userId;

  const user = await changeStatusAccount(req, userId, 1, table);

  if (user) {
    io.getIO().emit('user', {
      action: 'activate',
      data: {
        user: user,
      }
    });
    await apiData(res, 200, 'Activate an account successfullly!', data);
  } else {
    await apiData(res, 200, 'Activate an account fail!', data);
  }
});

exports.postDeactivateUser = (async (req, res, next) => {
  const userId = req.qeury.userId;

  const user = await checkStatusAccount(req, userId, table);

  if (user) {
    io.getIO().emit('user', {
      action: 'deactive',
      data: {
        user: user,
      }
    });
    await apiData(res, 200, 'Deactive an account successfullly!', data);
  } else {
    await apiData(res, 200, 'Deactive an account fail!', data);
  }
});