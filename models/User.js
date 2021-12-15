const connection = require('./connection');

const INITIAL_BALANCE = 0;

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

const newUser = async (name, cpf, balance = INITIAL_BALANCE) => {
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

  await db.collection('users').findOneAndUpdate(
    { cpf },
    { $inc: { balance: value } },
  )
  const { name, balance } = await db.collection('users').findOne({ cpf });

  return { name, balance };
};

const checkUsersCpf = async ({ cpf_transfer, cpf_receiver }) => {
  const db = await connection();

  const users = await db.collection('users').find(
    { cpf: { $in: [cpf_transfer, cpf_receiver] } },
    { projection:{ _id: false } },
  ).toArray();

  return users;
}

const transferBetweenUsers = async (cpf_transfer, cpf_receiver, value) => {
  const db = await connection();

  const initialState = await checkUsersCpf({ cpf_transfer, cpf_receiver })

  await db.collection('users').findOneAndUpdate(
    {
      cpf: cpf_transfer
    },
    {
      $inc: { balance: -value }
    }
  );

  await db.collection('users').findOneAndUpdate(
    { cpf: cpf_receiver },
    { $inc: { balance: value } }
  )

  const finalState = await checkUsersCpf({ cpf_transfer, cpf_receiver })

  return { amount_transfered: value, initialState, finalState, }
}

module.exports = {
  newUser,
  checkUserCpf,
  balanceWithdraw,
  balanceDeposit,
  getUser,
  checkUsersCpf,
  transferBetweenUsers,
};
