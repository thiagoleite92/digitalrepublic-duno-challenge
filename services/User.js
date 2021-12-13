const User = require('../models/User')

const insertNewUser = async  (name, cpf) => {
  const teste = await User.insertNewUser(name, cpf);
  return teste;
};

module.exports = {
  insertNewUser
};
