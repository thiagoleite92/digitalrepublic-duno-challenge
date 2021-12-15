const User = require('../models/User')

const BAD_STATUS = 400;
const NAME_PATTERN = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
const NAME_MIN_LENGTH = 12;
const NAME_MAX_LENGTH = 25;
const CPF_PATTERN = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

const isValidName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(BAD_STATUS).json('Name must be informed.');
  }

  if ((typeof name != 'string' || !NAME_PATTERN.test(name))) {
    return res.status(BAD_STATUS).json('Name must contain only letters.');
  }

  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    return res.status(BAD_STATUS).json('Name must be between 12 and 25 characters.')
  }

  next();
}

const isValidCpf = (req, res, next) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(BAD_STATUS).json('CPF must be informed.');
  }

  if (!CPF_PATTERN.test(cpf)) {
    return res.status(BAD_STATUS).json('CPF must be format: 123.456.789-00.');
  }

  next();
}

const checkCpfUniquity = async (req, res, next) => {
  const { cpf } = req.body;
  const user = await User.checkUserCpf(cpf)

  if (user) {
    return res.status(409).json('CPF already in use.');
  }

  next();
}

const checkUserBalance = async (req, res, next) => {
  const { cpf, value } = req.body;
  const user = await User.getUser(cpf);

  if (user.balance - value < 0) {
    return res.status(BAD_STATUS).json('Insuficcient funds.');
  };

  next();
}

const checkUserRegister = async (req, res, next) => {
  const { cpf } = req.body;
  const user = await User.getUser(cpf);

  if (!cpf) {
    return res.status(BAD_STATUS).json('A CPF is required to manage the account.')
  };

  if (!user) {
    return res.status(BAD_STATUS).json('CPF not found.');
  };

  next();
}

const isValidValue = (req, res, next) => {
  const { value } = req.body;
  if (!value || typeof value != 'number') {
    return res.status(BAD_STATUS).json('Value is missing or not valid, inform a positive number.')
  }

  if (value < 0) {
    return res.status(BAD_STATUS).json('Value cannot be negative.')
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
