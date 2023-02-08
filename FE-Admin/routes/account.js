const express = require("express");
const routes = express.Router();

const accountServices = require('../services/account');

routes.get('/admin', accountServices.getAllAdminAccount);
routes.get('/admin', accountServices.getAnAdminAccount);

routes.get('/user', accountServices.getAllUserAccount);
routes.get('/user/show', accountServices.getAnUserAccount);
routes.post('/user/activate', accountServices.postUserAccountActivate);
routes.post('/user/deactivate', accountServices.postUserAccountDeactivate);

module.exports = routes;