const Account = require('../model/account');
const apiUrlAdmins = Account.apiUrlAdmins;
const apiUrlUsers = Account.apiUrlUsers;

// admin account
exports.getAllAdminAccount = (req, res, next) => {
  return renderEjsPageWithApiGet("messageAdminAccount", 'account/admin/index', apiUrlAdmins.allAdmin, req, res, next);
}

exports.getAnAdminAccount = (req, res, next) => {
  return renderEjsPageWithApiGet("messageAdminAccount", 'account/admin/show', apiUrlAdmins.allAdmin, req, res, next);
}

// user account
exports.getAllUserAccount = (req, res, next) => {
  return renderEjsPageWithApiGet("messageUserAccount", 'account/user/index', apiUrlUsers.allUser, req, res, next);
}

exports.getAnUserAccount = (req, res, next) => {
  return renderEjsPageWithApiGet("messageUserAccount", 'account/user/show', apiUrlUsers.anUser, req, res, next);
}

exports.postUserAccountActivate = (req, res, next) => {
  return renderEjsPageWithApiPost('messageUserAccount', apiUrlUsers.activate, req, res, next);
}

exports.postUserAccountDeactivate = (req, res, next) => {
  return renderEjsPageWithApiPost('messageUserAccount', apiUrlUsers.deactivate, req, res, next);
}

// get data a apiUrl and return htmlpage with data and message(only ejs framework)
function renderEjsPageWithApiGet(messageName, pagePath, urlApi, req, res, next) {
  const params = req.query;
  const message = req.flash(messageName);
  const token = req.cookies.token;
  const body = req.body;

  Account.get(urlApi, token, params)
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

  Account.postOne(urlApi, token, body, params)
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