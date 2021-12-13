const express = require('express');

const route = express.Router();

const User = require('../controllers/User');

const { isValidName, isValidCpf, checkCpfUniquity, checkUserBalance, checkUserRegister } = require('../middlewares/User')

route.get('/', User.getUser)
route.post('/', isValidName, isValidCpf,checkCpfUniquity, User.newUser)
route.patch('/', checkUserRegister, checkUserBalance, User.updateBalance)

module.exports = route;