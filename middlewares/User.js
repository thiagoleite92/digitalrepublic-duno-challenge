const Joi = require('joi');
const User = require('../models/User');

const isDataUserValid = (req, res, next) => {
  const { name, cpf } = req.body;

  const { error } = Joi.object({
    name: Joi.string().min(12).required(),
    cpf: Joi.string().pattern( new RegExp(/^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/)).required(),
  }).validate({name, cpf});

  if (error) {
    return res.status(400).json(error.details[0].message)
  }

  next();
}

const isUniqueCpf = async (req, res, next) => {
    const { cpf } = req.body;
    const user = await User.checkUserCpf(cpf)
    console.log(user);
    if (!user) {
      return next();
    }
    return res.status(409).json('CPF is already in use')
  }


module.exports = {
  isDataUserValid,
  isUniqueCpf,
};
