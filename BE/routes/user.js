const express = require('express');
const routes = express.Router();

const isAdmin = require('../middlewares/isAdmin');
const isUser = require('../middlewares/isUser');

const userController = require('../controllers/user');

routes.post('/createGroup', isUser, userController.postCreateGroup);
routes.post('/setRole', isUser, userController.postSetRole);
routes.get('/role', isUser, userController.getRole);

module.exports = routes;