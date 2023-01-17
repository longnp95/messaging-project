const express = require('express');
const routes = express.Router();

const haveBody = require('../middlewares/haveBody');
const isUser = require('../middlewares/isUser');

const userController = require('../controllers/user');

routes.get('/group', isUser, userController.getGroupsByUserId);
routes.post('/createGroup', isUser, haveBody, userController.postCreateGroup);
routes.post('/setRole', isUser, haveBody, userController.postSetRole);
routes.get('/role', isUser, haveBody, userController.getRoles);
routes.get('/member', isUser, haveBody, userController.getMembers);

module.exports = routes;