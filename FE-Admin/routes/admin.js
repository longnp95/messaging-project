const express = require("express");
const routes = express.Router();

const usersService = require('../services/users');

routes.get('/account/user', usersService.getAllAccount);
routes.get('/account/user/show', usersService.getAnAccount);
routes.post('/account/user/activate', usersService.postAccountActivate);
routes.post('/account/user/deactivate', usersService.postAccountDeactivate);

module.exports = routes;