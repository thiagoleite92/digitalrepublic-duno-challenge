const User = require('../services/User')

const insertNewUser = (req, res) => {
  const teste = User.insertNewUser();
  
  return res.status(200).json(teste);
}

module.exports = {
  insertNewUser,
};