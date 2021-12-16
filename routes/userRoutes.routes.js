const express = require('express');

const router = express.Router();

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

router.get('/', User.getUser)
router.post('/register/', isValidName, isValidCpf, checkCpfUniquity, User.newUser)
router.patch('/withdraw/', checkUserRegister, isValidValue, checkUserBalance, User.balanceWithdraw)
router.patch('/deposit/', checkUserRegister, isValidValue, isValidValueDeposit, User.balanceDeposit)
router.patch('/transfer/', isValidValue, isValidUsersCpf, isValidAmountTransfer, User.transferBetweenUsers)

module.exports = router;