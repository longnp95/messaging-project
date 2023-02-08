const Admin = require('../models/admin');

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

      await apiData(res, 500, 'This account is block', returnData);
    }
  } else {
    const returnData = {};

    await apiData(res, 500, 'Where your params ?', returnData);
  }
});

const changeStatusAccount = (async (res, id, status, table) => {
  if (id) {
    const user = await checkStatusAccount(res, id, table);

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

// GET: list admin account
exports.getAllAdmin = (async (req, res, next) => {
  const admins = await Admin.findAll({
    order: [
      ['updatedAt', 'DESC'],
    ],
    include: {
      all: true,
      nested: true
    }
  });

  const data = {
    admins: admins
  };

  await apiData(res, 200, 'OK', data);
});

// GET: details admin account
exports.getAdmin = (async (req, res, next) => {
  const adminId = req.query.adminId;
  
  const admin = await Admin.findOne({
    where: {
      id: adminId
    },
    include: {
      all: true,
      nested: true
    }
  });

  const data = {
    admin: admin
  };

  await apiData(res, 200, 'OK', data);
});

// POST: activate admin account
exports.postActivavteAdmin = (async (req, res, next) => {
  const adminId = req.query.adminId;

  const admin = await changeStatusAccount(res, adminId, 1, Admin);

  if (admin) {
    const data = {
      path: '/account/admin'
    }

    await apiData(res, 200, 'Activate an account successfullly!', data);
  } else {
    const data = {};

    await apiData(res, 200, 'Activate an account fail!', data);
  }
});

// GET: deactivate admin account
exports.postDeactivateAdmin = (async (req, res, next) => {
  const adminId = req.query.adminId;

  const admin = await changeStatusAccount(res, adminId, 0, Admin);

  if (admin) {
    const data = {
      path: '/account/admin'
    }

    await apiData(res, 200, 'Deactive an account successfullly!', data);
  } else {
    const data = {};

    await apiData(res, 200, 'Deactive an account fail!', data);
  }
});