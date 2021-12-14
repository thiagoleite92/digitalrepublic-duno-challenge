const User = require('../services/User')

const newUser = async (req, res) => {
  const { name, cpf } = req.body;

  const insertedUser = await User.newUser(name, cpf);
  
  return res.status(200).json(insertedUser);
}

const getUser = async (req, res) => {
  const { cpf } = req.body;
  const user = await User.getUser(cpf);
  if (!user) {
    return res.status(200).json('CPF not found');
  }

  return res.status(200).json(user);
}

const balanceWithdraw = async (req, res) => {
  const { cpf, value } = req.body;

  const newBalance = await User.balanceWithdraw(cpf, value);

  return res.status(201).json(newBalance);
}

const balanceDeposit = async (req, res) => {
  const { cpf, value } = req.body;

  const newBalance = await User.balanceDeposit(cpf, value);

  return res.status(201).json(newBalance);
}

module.exports = {
  newUser,
  balanceWithdraw,
  balanceDeposit,
  getUser,
};