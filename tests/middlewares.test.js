const frisby = require('frisby');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const endPoint = 'http://localhost:3000/user';
const DB_URL_NAME = 'mongodb://localhost:27017/DigitalRepublic/';
const DB_NAME = 'digitalrepublic';

const VALID_NAME = 'Thiago José Siqueira Leite';
const INVALID_NAME_NUMBERS = 123
const INVALID_NAME_LENGTH = 'Thiago'

const VALID_CPF = '12345678900';
const INVALID_CPF_FORMAT = '1a#-4b@-7c!-0*';

describe('Validating the register of a new user', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(DB_URL_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(DB_NAME);
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  })
  describe('Field name validation ', () => {
    it('Field name is required', async () => {
      await frisby
        .post(`${endPoint}/register/`,
          {
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Name must be informed');
        });
    });

    it('Field name must be at least 12 characters long', async () => {
      await frisby
        .post(`${endPoint}/register/`,
          {
            name: INVALID_NAME_LENGTH,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Name must be at least 12');
        });
    });

    it('Field name must be a string', async () => {
      await frisby
        .post(`${endPoint}/register/`,
          {
            name: INVALID_NAME_LENGTH,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Name must be letters');
        });
    });
  });
});