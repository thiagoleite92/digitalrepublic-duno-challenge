const User = require('../models/User')

const BAD_STATUS = 400;
const NAME_MIN_LENGTH = 12;
const CPF_MAX_LENGTH = 11;
const CPF_PATTERN = new RegExp(/^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}/)

const isValidName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(BAD_STATUS).json('Name must be informed');
  }

  if (typeof name !== 'string') {
    return res.status(BAD_STATUS).json('Name must be letters');
  }


  if (name.length < NAME_MIN_LENGTH) {
    return res.status(BAD_STATUS).json('Name must be at least ' + NAME_MIN_LENGTH)
  }

  next();
}

const isValidCpf = (req, res, next) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(BAD_STATUS).json('CPF must be informed');
  }

  if (cpf.length > CPF_MAX_LENGTH || !cpf.match(CPF_PATTERN)) {
    return res.status(BAD_STATUS).json('CPF must be format: 12345678900');
  }

  next();
}

const checkCpfUniquity = async (req, res, next) => {
  const { cpf } = req.body;
  const user =  await User.checkUserCpf(cpf)

  if (user) {
    return res.status(409).json('CPF already in use');
  }

  next();
}

const checkUserBalance = async (req, res, next) => {
  const { cpf, value } = req.body;
  const user = await User.getUser(cpf);

  const { balance } = user;

  if (balance - value < 0) {
    return res.status(BAD_STATUS).json('Insuficcient funds');
  }
  next();
}

const checkUserRegister = async (req, res, next) => {
  const { cpf } = req.body;
  const user = await User.getUser(cpf);
  
  console.log(user);

  if (!user) { 
    return res.status(BAD_STATUS).json('CPF not found');
  }

  next();
}

module.exports = {
  isValidName,
  isValidCpf,
  checkCpfUniquity,
  checkUserBalance,
  checkUserRegister,
};
