const User = require('../services/User')

const newUser = async (req, res) => {
  const { name, cpf } = req.body;

  const insertedUser = await User.newUser(name, cpf);
  
  return res.status(200).json(insertedUser);
}

module.exports = {
  newUser,
};