const connection = require('./connection');

const checkUserCpf = async (cpf) => {
  const db = await connection();
  let user = null;

  user = await db.collection('users').findOne({ cpf });

  return user;
}

const newUser = async (name, cpf) => {
  const db = await connection();

  const user = await checkUserCpf(cpf);

  if (user) {
    return "CPF already in use"
  }

  const { insertedId } = await db.collection('users').insertOne({ name, cpf });

  return { id: insertedId, name };
}


module.exports = {
  newUser,
  checkUserCpf
};
