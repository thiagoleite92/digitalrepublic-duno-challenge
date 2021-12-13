const { MongoClient } = require('mongodb');

const MONGO_DB_URL = 'mongodb://localhost:27017DigitalRebublic';

const DB_NAME = 'DigitalRebublic';

const connection = () => MongoClient
  .connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => connection.db(DB_NAME))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = connection;