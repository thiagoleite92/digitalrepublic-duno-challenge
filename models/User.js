const connection = require('./connection');

const INITIAL_DEPOSIT = 0.00

const checkUserCpf = async (cpf) => {
  const db = await connection();
  let user = null;

  user = await db.collection('users').findOne({ cpf });

  return user;
}

const getUser = async (cpf) => {
  const user = await checkUserCpf(cpf);

  if (!user) {
    return "CPF not found";
  }

  return user;
}

const newUser = async (name, cpf, balance = INITIAL_DEPOSIT) => {
  const db = await connection();

  const { insertedId } = await db.collection('users').insertOne({ name, cpf, balance });

  return { id: insertedId, name, balance };
}

const updateBalance = async (cpf, value) => {
  const db = await connection();
  const user = await getUser(cpf);

  if (!user) {
    return "CPF not found";
  }

  const { balance } = user;

  if (balance - value < 0) {
    return 'Insuficiente funds'
  }

};

module.exports = {
  newUser,
  checkUserCpf,
  updateBalance,
  getUser
};
