const User = require('../models/User')

const insertNewUser = () => {
  const teste = User.insertNewUser();
  return teste;
};

module.exports = {
  insertNewUser
};
