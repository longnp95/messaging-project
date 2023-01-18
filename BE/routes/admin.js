const express = require('express');
const routes = express.Router();

const haveBody = require('../middlewares/haveBody');
const isAdmin = require('../middlewares/isAdmin');

const adminController = require('../controllers/admin');

routes.get('/users', isAdmin, adminController.getAllUser);
routes.get('/users/show', isAdmin, adminController.getUser);

module.exports = routes;