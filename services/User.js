const User = require('../models/User')

const newUser = async  (name, cpf) => {
  const insertedUser = await User.newUser(name, cpf);
  return insertedUser;
};

const getUser = async (cpf) => {
  const user = await User.getUser(cpf);
  return user;
}

const updateBalance = async (cpf, value) => {
  const balance = await User.updateBalance(cpf, value);
  return balance
}

module.exports = {
  newUser,
  updateBalance,
  getUser
};
