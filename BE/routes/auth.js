const express = require('express');
const routes = express.Router();

const haveBody = require('../middlewares/haveBody');
const authController = require('../controllers/auth');

routes.post('/admin/signin', haveBody, authController.postSignInAdmin);
routes.post('/signin', haveBody, authController.postSignInUser);
routes.post('/signup', haveBody, authController.postSignUp);

module.exports = routes;