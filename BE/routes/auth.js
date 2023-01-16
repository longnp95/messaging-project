const express = require('express');
const routes = express.Router();

const authController = require('../controllers/auth');

routes.post('/signup', authController.postSignUp);