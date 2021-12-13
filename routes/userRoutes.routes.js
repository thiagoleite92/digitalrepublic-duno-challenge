const express = require('express');

const route = express.Router();

const User = require('../controllers/User');

const {isDataUserValid, isUniqueCpf} = require('../middlewares/User')

route.get('/', isDataUserValid, isUniqueCpf, User.insertNewUser)

module.exports = route;