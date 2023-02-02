const api = require('../model/sign');

exports.getSignIn = (req, res, next) => {
  const message = req.flash("errorAuth")[0];

  return res.render('auth/signin', {
    data: {
      pageTitle: 'Login',
      message: `${message}`
    }
  });
}

exports.postSignIn = (req, res, next) => {
  const body = req.body;
  const cb = api.postSign(api.apiSign.signIn, body);

  cb.then(response => response.json())
    .then(results => {
      const error = results.error;
      const data = results.data;

      switch (error.status) {
        case 200:
          req.flash('errorAuth', error.message);
          res.cookie('token', data.user.token);
          return res.redirect('/account/user');
          break;
        case 500:
          req.flash('errorAuth', error.message);
          return res.redirect('/auth/signin');
          break;
        default:
          return res.redirect('/auth/signin');
          break;
      }
    })
    .catch(err => console.log(err));
}

exports.postSignOut = (req, res, next) => {
  res.clearCookie("token");
  res.redirect('/auth/signin');
}