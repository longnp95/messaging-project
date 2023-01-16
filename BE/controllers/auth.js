const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.postSignInUser = (async (req, res, next) => {
  const body = req.body;

  if (body) {
    const username = body.username;
    const password = body.password;

    if (username && password) {
      const user = await User.findOne({
        where: {
          username: username
        }
      });

      if (user) {
        if (user.status == 1) {
          const doMatchPass = await bcrypt.compare(password, user.password);

          if (doMatchPass) {
            const token = jwt.sign(
              { userId: user.id },
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

        } else {
          return res.status(200).json({
            error: {
              status: 500,
              message: "This account is block!"
            },
            data: {}
          });
        }

      } else {
        return res.status(200).json({
          error: {
            status: 500,
            message: "Wrong Username or Password!"
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

exports.postSignInAdmin = (async (req, res, next) => {
  const body = req.body;

  if (body) {
    const username = body.username;
    const password = body.password;

    if (username && password) {
      const admin = await Admin.findOne({
        where: {
          username: username
        }
      });

      if (admin) {
        if (admin.status == 1) {
          const doMatchPass = await bcrypt.compare(password, admin.password);

          if (doMatchPass) {
            const token = jwt.sign(
              { userId: admin.id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            );

            admin.update({
              token: token
            });
            admin.save();

            return res.status(200).json({
              error: {
                status: 200,
                message: "Sign in successfully!"
              },
              data: {
                user: admin
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

        } else {
          return res.status(200).json({
            error: {
              status: 500,
              message: "This account is block!"
            },
            data: {}
          });
        }

      } else {
        return res.status(200).json({
          error: {
            status: 500,
            message: "Wrong Username or Password!"
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

exports.postSignUp = (async (req, res, next) => {
  const body = req.body;

  if (body) {
    const username = body.username;
    const password = body.password;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const gender = body.gender;

    if (username && password && firstName && lastName && gender) {
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
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          status: 1
        });

        if (user) {
          const token = jwt.sign(
            { userId: user.id },
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