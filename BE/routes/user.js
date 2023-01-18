const express = require('express');
const routes = express.Router();

const haveBody = require('../middlewares/haveBody');
const isUser = require('../middlewares/isUser');

const userController = require('../controllers/user');

routes.get('/conversation', isUser, userController.getConversationsByUserId);
routes.post('/conversation/create', isUser, haveBody, userController.postCreateConversation);
routes.post('/conversation/update', isUser, haveBody, userController.postUpdateConversation);
routes.post('/conversation/setrole', isUser, haveBody, userController.postSetRole);

routes.get('/role', userController.getRoles);

routes.get('/group/member', isUser, userController.getMembersInGroup);

module.exports = routes;