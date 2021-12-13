const connection = require('./connection');

const insertNewUser = async (name, cpf) => {
  const db = await connection();
  let user = null;

  console.log(name, cpf)

  user = await db.collection('users').insertOne({ name, cpf });
  
  if (!user) return 'oi'

  return user
 }

module.exports = {
  insertNewUser
};
