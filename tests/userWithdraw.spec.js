const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const endPoint = 'http://localhost:3000/user';
const DB_URL_NAME = 'mongodb://localhost:27017/DigitalRepublic/';
const DB_NAME = 'digitalrepublic';

const VALID_NAME = 'Thiago José Leite';
const VALID_CPF = '123.456.789-00';
const INVALID_CPF = '987.654.321-00';

const NEGATIVE_VALUE = -100;
const POSITIVE_VALUE = 100;

describe('Validating user balance withdraw', () => {
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
    await db.collection('users').insertOne({
      name: VALID_NAME,
      cpf: VALID_CPF,
    });
  });

  afterAll(async () => {
    await connection.close();
  })

  describe('Validate if the user has a registered cpf', () => {
    it('Should not be possible to manage a account without cpf', async () => {
      await frisby
        .patch(`${endPoint}/withdraw/`,
          {})
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('A CPF is required to manage the account.');
        });
    });

    it('Should not be possible to manage a account with a misinformed cpf', async () => {
      await frisby
        .patch(`${endPoint}/withdraw/`,
          {
            cpf: INVALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('CPF not found.');
        });
    });
  });

  describe('Validate the value informed by the user', () => {
    it('Should not be possible to withdraw money with no value informed', async () => {
      await frisby
        .patch(`${endPoint}/withdraw/`,
          {
            cpf: VALID_CPF,
            value: ''
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Value is missing or not valid, inform a positive number.');
        });
    });

    it('Should not be possible to withdraw money if the value is negative', async () => {
      await frisby
        .patch(`${endPoint}/withdraw/`,
          {
            cpf: VALID_CPF,
            value: NEGATIVE_VALUE,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Value cannot be negative.');
        });
    });

    it('Should not be possible to withdraw money if the result balance is negative', async () => {
      await frisby
        .patch(`${endPoint}/withdraw/`,
          {
            value: POSITIVE_VALUE,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          console.log(body);
          const result = JSON.parse(body);
          expect(result).toBe('Insuficcient funds.');
        });
    });
  })
});