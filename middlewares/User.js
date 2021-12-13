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

  if (typeof cpf !== 'string' || cpf.length > CPF_MAX_LENGTH) {
    return res.status(BAD_STATUS).json('Cpf: only letters are needed');
  }

  if (!cpf.match(CPF_PATTERN)) {
    return res.status(BAD_STATUS).json('CPF informed is not valid');
  }

  next();
}

module.exports = {
  isValidName,
  isValidCpf,
};
