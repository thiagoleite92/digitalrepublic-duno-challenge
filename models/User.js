const connection = require('./connection');

const insertNewUser = async (name, cpf) => {
  const db = await connection();
  let user = null;

  console.log(name, cpf)

  user = await db.collection('users').insertOne({ name, cpf });

  return user
}

const checkUserCpf = async (cpf) => {
  const db = await connection();
  let user = null;

  user = await db.collection('users').findOne({ cpf });

  return user;
}

module.exports = {
  insertNewUser,
  checkUserCpf
};
