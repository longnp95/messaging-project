const User = require('../model/user');
const apiUrlUsers = User.apiUrlUsers;

// account
exports.getAllAccount = (req, res, next) => {
  return renderEjsPageWithApiGet("messageUserAccount", 'account/user/index', apiUrlUsers.allUser, req, res, next);
}

exports.getAnAccount = (req, res, next) => {
  return renderEjsPageWithApiGet("messageUserAccount", 'account/user/show', apiUrlUsers.anUser, req, res, next);
}

exports.postAccountActivate = (req, res, next) => {
  return renderEjsPageWithApiPost('messageUserAccount', apiUrlUsers.activate, req, res, next);
}

exports.postAccountDeactivate = (req, res, next) => {
  return renderEjsPageWithApiPost('messageUserAccount', apiUrlUsers.deactivate, req, res, next);
}

// get data a apiUrl and return htmlpage with data and message(only ejs framework)
function renderEjsPageWithApiGet(messageName, pagePath, urlApi, req, res, next) {
  const params = req.query;
  const message = req.flash(messageName);
  const token = req.cookies.token;
  const body = req.body;

  User.get(urlApi, token, params)
    .then(response => {
      return response.json();
    })
    .then(results => {
      const error = results.error;
      const data = results.data;

      if (error.status == 200) {
        return res.render(pagePath, {
          data: data,
          body: body,
          message: message
        });
      } else {
        return res.redirect(data.path);
      }
    })
    .catch(err => console.log(err));
}

// post data a apiUrl and return htmlpage with data and message(only ejs framework)
function renderEjsPageWithApiPost(messageName, urlApi, req, res, next) {
  const token = req.cookies.token;
  const params = req.query;
  const body = req.body;

  User.postOne(urlApi, token, body, params)
    .then(response => {
      return response.json();
    })
    .then(results => {
      const error = results.error;
      const data = results.data;

      if (error.status != 200) {
        req.flash(messageName, error.message);

        return res.redirect(data.path);
      } else {
        req.flash(messageName, error.message);

        return res.redirect('back');
      }
    })
    .catch(err => console.log(err));
}