const { MongoClient } = require('mongodb');
require('dotenv').config();

const DB_URL_NAME = 'mongodb://localhost:27017/DigitalRepublic/';

const DB_NAME = 'digitalrepublic'

let schema = null;

async function connection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient
    .connect(process.env.DB_URL || DB_URL_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(process.env.DB_NAME || DB_NAME))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = connection;