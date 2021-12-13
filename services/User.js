const User = require('../models/User')

const newUser = async  (name, cpf) => {
  const insertedUser = await User.newUser(name, cpf);
  return insertedUser;
};

module.exports = {
  newUser
};
