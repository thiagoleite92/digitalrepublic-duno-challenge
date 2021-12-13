const express = require('express');

const route = express.Router();

const User = require('../controllers/User');

const {isValidName, isValidCpf} = require('../middlewares/User')

route.get('/', isValidName, isValidCpf, User.newUser)

module.exports = route;