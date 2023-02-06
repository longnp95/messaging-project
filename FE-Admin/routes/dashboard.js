const express = require("express");
const routes = express.Router();

const dashboardService = require('../services/dashboard');

routes.get('/home', dashboardService.getRawData);

module.exports = routes;