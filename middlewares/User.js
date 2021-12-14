const User = require('../models/User')

const BAD_STATUS = 400;
const NAME_PATTERN = new RegExp(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/)
const NAME_MIN_LENGTH = 12;
const NAME_MAX_LENGTH = 25;
const CPF_MAX_LENGTH = 11;
const CPF_PATTERN = new RegExp(/^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}/)

const isValidName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(BAD_STATUS).json('Name must be informed.');
  }

  if ((typeof name != 'string' || !name.match(NAME_PATTERN))) {
    return res.status(BAD_STATUS).json('Name must contain only letters.');
  }

  if (name.length < NAME_MIN_LENGTH && name.length > NAME_MAX_LENGTH) {
    return res.status(BAD_STATUS).json('Name must be between 12 and 255 characters.')
  }

  next();
}

const isValidCpf = (req, res, next) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(BAD_STATUS).json('CPF must be informed.');
  }

  if (cpf.length > CPF_MAX_LENGTH || !cpf.match(CPF_PATTERN)) {
    return res.status(BAD_STATUS).json('CPF must be format: 12345678900.');
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

  if (!user) { 
    return res.status(BAD_STATUS).json('CPF not found');
  }

  next();
}

const isValidValue = (req, res, next) => {
  const { value } = req.body;
  if (!value || typeof value != 'number') {
    return res.status(BAD_STATUS).json('Value is missing or not valid')
  }

  if (value < 0) {
    return res.status(BAD_STATUS).json('Value cannot be negative')
  }

  next();
}

module.exports = {
  isValidName,
  isValidCpf,
  isValidValue,
  checkCpfUniquity,
  checkUserBalance,
  checkUserRegister,
};
