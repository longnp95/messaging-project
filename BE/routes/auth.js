const express = require('express');
const routes = express.Router();

const authController = require('../controllers/auth');

routes.post('/admin/signin', authController.postSignInAdmin);
routes.post('/signin', authController.postSignInUser);
routes.post('/signup', authController.postSignUp);

module.exports = routes;