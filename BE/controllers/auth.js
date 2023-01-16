const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.postLoginUser = (req, res, next) => {

}

exports.postLoginAdmin = (req, res, next) => {

}

exports.postSignUp = (async (req, res, next) => {
  const body = req.body;

  if (body) {
    const username = body.username;
    const password = body.password;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const gender = body.gender;

    if (username && password && firstName && lastName && gender) {
      const hashPassword = bcrypt.hash(password, 12);
      const existsUsername = await User.findOne({
        where: {
          username: username
        }
      });

      if (!existsUsername) {
        const token = jwt.sign(
          { userId: account.id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' }
        );

        const user = await User.create({
          username: username,
          password: hashPassword,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          status: 1,
          token: token
        });

        if (user) {
          return res.status(200).json({
            error: {
              status: 200,
              message: 'Create account successfully!'
            },
            data: {
              user: user,
              path: '/user/home'
            }
          });
        } else {
          return res.status(200).json({
            error: {
              status: 401,
              message: 'Create account faild!'
            },
            data: {
              body: JSON.stringify(body),
              path: '/auth/signin'
            }
          });
        }
      } else {
        return res.status(200).json({
          error: {
            status: 401,
            message: 'This username is already exists!'
          },
          data: {
            body: JSON.stringify(body),
            path: '/auth/signin'
          }
        });
      }
    } else {
      return res.status(200).json({
        error: {
          status: 401,
          message: 'Where your feild ?'
        },
        data: {
          path: '/auth/signin'
        }
      });
    }
  } else {
    return res.status(200).json({
      error: {
        status: 401,
        message: 'Where your body ?'
      },
      data: {
        path: '/auth/signin'
      }
    });
  }
});