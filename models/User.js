const connection = require('./connection');

const INITIAL_DEPOSIT = 0;

const checkUserCpf = async (cpf) => {
  const db = await connection();
  let user = null;

  user = await db.collection('users').findOne({ cpf });

  return user;
}

const getUser = async (cpf) => {
  const user = await checkUserCpf(cpf);

  if (!user) {
    return null;
  }

  return { name: user.name, cpf: user.cpf, balance: user.balance }
}

const newUser = async (name, cpf, balance = INITIAL_DEPOSIT) => {
  const db = await connection();

  await db.collection('users').insertOne({ name, cpf, balance });

  return { message: 'A new user has been registered', name, cpf, balance };
}

const balanceWithdraw = async (cpf, value) => {
  const db = await connection();

  await db.collection('users').findOneAndUpdate(
    { cpf },
    { $inc: { balance: -value } },
  )

  const { name, balance } = await db.collection('users').findOne({ cpf });

  return { name, balance };
};

const balanceDeposit = async (cpf, value) => {
  const db = await connection();

  console.log(cpf, value, '---------------------------')

  await db.collection('users').findOneAndUpdate(
    { cpf },
    { $inc: { balance: value } },
  )
  const { name, balance } = await db.collection('users').findOne({ cpf });

  return { name, balance };
};

module.exports = {
  newUser,
  checkUserCpf,
  balanceWithdraw,
  balanceDeposit,
  getUser,
};
