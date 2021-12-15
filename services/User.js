const User = require('../models/User')

const newUser = async  (name, cpf) => {
  const insertedUser = await User.newUser(name, cpf);
  return insertedUser;
};

const getUser = async (cpf) => {
  const user = await User.getUser(cpf);
  return user;
}

const balanceWithdraw = async (cpf, value) => {
  const balance = await User.balanceWithdraw(cpf, value);
  return balance;
}

const balanceDeposit = async (cpf, value) => {
  const balance = await User.balanceDeposit(cpf, value);
  return balance;
}

const transferBetweenUsers = async ({cpf_transfer, cpf_receiver, value}) => {
  const users = await User.transferBetweenUsers(cpf_transfer, cpf_receiver, value);
  return users;
}

module.exports = {
  newUser,
  balanceWithdraw,
  balanceDeposit,
  getUser,
  transferBetweenUsers
};
