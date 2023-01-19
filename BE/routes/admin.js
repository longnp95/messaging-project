const express = require('express');
const routes = express.Router();

const haveBody = require('../middlewares/haveBody');
const isAdmin = require('../middlewares/isAdmin');

const conversationsController = require('../controllers/conversations');
const usersController = require('../controllers/users');

routes.get('/user', isAdmin, usersController.getAllUser);
routes.get('/user/show', isAdmin, usersController.getUser);
routes.post('/user/create', isAdmin, haveBody, usersController.postCreateUser);
routes.post('/user/update', isAdmin, haveBody, usersController.postUpdateUser);
routes.post('/user/activate', isAdmin, haveBody, usersController.postActivavteUser);
routes.post('/user/deactivate', isAdmin, haveBody, usersController.postDeactivateUser);

routes.get('/conversation', isAdmin, conversationsController.getAllConversation);
routes.get('/conversation/show', isAdmin, conversationsController.getConversation);
routes.post('/conversation/create', isAdmin, haveBody, conversationsController.postCreateConversation);
routes.post('/conversation/update', isAdmin, haveBody, conversationsController.postUpdateConversation);

module.exports = routes;