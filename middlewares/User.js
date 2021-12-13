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

module.exports = {
  isValidName,
  isValidCpf,
  checkCpfUniquity,
};
