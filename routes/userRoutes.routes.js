const express = require('express');

const route = express.Router();

const User = require('../controllers/User');

const { 
  isValidName,
  isValidCpf,
  checkCpfUniquity,
  checkUserBalance,
  checkUserRegister,
  isValidValue,
  isValidValueDeposit,
  isValidUsersCpf,
  isValidAmountTransfer,
} = require('../middlewares/User')

route.get('/', User.getUser)
route.post('/register/', isValidName, isValidCpf, checkCpfUniquity, User.newUser)
route.patch('/withdraw/', checkUserRegister, isValidValue, checkUserBalance, User.balanceWithdraw)
route.patch('/deposit/', checkUserRegister, isValidValue, isValidValueDeposit, User.balanceDeposit)
route.patch('/transfer/', isValidValue, isValidUsersCpf, isValidAmountTransfer, User.transferBetweenUsers)

module.exports = route;