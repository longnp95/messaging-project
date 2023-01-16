const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
  const token = req.header('token');

  try {
    var data = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

    if (data.role == 'user') {
      User.findOne({
        where: {
          id: data.userId
        }
      })
        .then(admin => {
          if (admin) {
            req.userId = data.userId;
            next();
          } else {
            return res.status(200).json({
              error: {
                status: 500,
                message: 'This Account Doesn\'t exists'
              },
              data: {}
            });
          }
        })
        .catch(err => {
          return res.status(400).json({
            error: {
              status: 200,
              message: err
            },
            data: {}
          });
        });
    } else {
      return res.status(200).json({
        error: {
          status: 500,
          message: 'Don\'t have perrmission!'
        },
        data: {}
      });
    }
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: {
          status: 401,
          message: err.toString()
        },
        data: {
          pageTitle: 'Sign In',
          path: '/auth/signin'
        }
      });
    }
  }
}