const express = require('express');
const routes = express.Router();

const userController = require('../controllers/user');

routes.post('/createGroup', userController.postCreateGroup);

module.exports = routes;