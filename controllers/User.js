const User = require('../services/User')

const insertNewUser = async (req, res) => {
  const { name, cpf } = req.body;

  console.log(name, cpf)

  const user = await User.insertNewUser(name, cpf);
  
  return res.status(200).json(user);
}

module.exports = {
  insertNewUser,
};