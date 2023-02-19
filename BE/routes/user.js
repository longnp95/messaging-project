const express = require('express');
const routes = express.Router();

const haveBody = require('../middlewares/haveBody');
const isUser = require('../middlewares/isUser');
const userInGroup = require('../middlewares/inConversation');
const isOwnerInGroup = require('../middlewares/isOwnerInGroup');

const userController = require('../controllers/user');
const accountUserController = require('../controllers/users');
const conversationController = require('../controllers/conversations');

routes.get('/conversation', isUser, userController.getConversationsByUserId);
routes.post('/conversation/create', isUser, haveBody, userController.postCreateConversation);
routes.post('/conversation/update', isUser, haveBody, userInGroup, userController.postUpdateConversation);
routes.post('/conversation/delete', isUser, haveBody, userInGroup, isOwnerInGroup, conversationController.postDeleteConversation);
routes.post('/conversation/setrole', isUser, haveBody, userInGroup, userController.postSetRole);
routes.get('/conversation/getMessage', isUser, userController.getMessageByConversationId);
routes.post('/conversation/sendMessage', isUser, haveBody, userInGroup, userController.postSendMessage);
routes.get('/conversation/getMember', isUser, haveBody, userInGroup, userController.getMembersInGroup);
routes.post('/conversation/addMember', isUser, haveBody, userInGroup, userController.postAddMemberInGroup);
routes.post('/conversation/leaveGroup', isUser, haveBody, userInGroup, userController.postLeaveGroup);

routes.get('/users', isUser, accountUserController.getAllUser);
routes.get('/user/search', isUser, userController.getFindUser);
routes.post('/user/profile', isUser, accountUserController.postUpdateUser);

routes.get('/role', userController.getRoles);

routes.get('/group/member', isUser, userController.getMembersInGroup);

module.exports = routes;