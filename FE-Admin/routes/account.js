const express = require("express");
const routes = express.Router();

const accountServices = require('../services/account');

routes.get('/account/admin', accountServices.getAllAdminAccount);

routes.get('/account/user', accountServices.getAllUserAccount);
routes.get('/account/user/show', accountServices.getAnUserAccount);
routes.post('/account/user/activate', accountServices.postUserAccountActivate);
routes.post('/account/user/deactivate', accountServices.postUserAccountDeactivate);

module.exports = routes;