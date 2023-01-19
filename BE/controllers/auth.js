const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

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

const signInByTable = (async (req, res, table) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;

  if (!(username && password)) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where your feild ?'
      },
      data: {}
    });
  }

  const user = await table.findOne({
    where: {
      username: username
    }
  });

  const statusUser = checkStatusUser(user);

  if (statusUser != true) {
    return res.status(200).json({
      error: {
        status: 500,
        message: statusUser.toString()
      },
      data: {}
    });
  }

  const doMatchPass = await bcrypt.compare(password, user.password);

  if (doMatchPass) {
    const token = jwt.sign(
      {
        userId: user.id,
        role: table.name
      },
      'RANDOM_TOKEN_SECRET',
      { expiresIn: '24h' }
    );

    user.update({
      token: token
    });
    await user.save();

    return res.status(200).json({
      error: {
        status: 200,
        message: "Sign in successfully!"
      },
      data: {
        user: user
      }
    });
  } else {
    return res.status(200).json({
      error: {
        status: 500,
        message: "Wrong Username or Password!"
      },
      data: {}
    });
  }
});

exports.postSignInUser = (async (req, res, next) => {
  await signInByTable(req, res, User);
});

exports.postSignInAdmin = (async (req, res, next) => {
  await signInByTable(req, res, Admin);
});

exports.postSignUp = (async (req, res, next) => {
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

  if (!(username && password && firstName && lastName && gender && avatarUrl && dob && mobile && email)) {
    const existsUsername = await User.findOne({
      where: {
        username: username
      }
    });

    if (!existsUsername) {
      const hashPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        username: username,
        password: hashPassword,
        avatar: avatarUrl,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dob: dob,
        mobile: mobile,
        email: email,
        status: 1
      });

      if (user) {
        const token = jwt.sign(
          {
            userId: user.id,
            role: 'user'
          },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' }
        );

        user.update({
          token: token
        });
        user.save();

        return res.status(200).json({
          error: {
            status: 200,
            message: 'Create account successfully!'
          },
          data: {
            user: user
          }
        });
      } else {
        return res.status(200).json({
          error: {
            status: 500,
            message: 'Create account faild!'
          },
          data: {}
        });
      }
    } else {
      return res.status(200).json({
        error: {
          status: 500,
          message: 'This username is already exists!'
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
});