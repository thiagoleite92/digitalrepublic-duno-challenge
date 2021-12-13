const express = require('express');

const route = express.Router();

const User = require('../controllers/User');

route.get('/', User.insertNewUser)

module.exports = route;