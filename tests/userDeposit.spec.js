const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const endPoint = 'http://localhost:3000/user';
const DB_URL_NAME = 'mongodb://localhost:27017/DigitalRepublic/';
const DB_NAME = 'digitalrepublic';

const VALID_NAME = 'Thiago José Leite';
const VALID_CPF = '123.456.789-00';
const INVALID_CPF = '987.654.321-00';

const INITIAL_BALANCE = 0;

const NEGATIVE_VALUE = -100;
const POSITIVE_VALUE = 100;
const VALUE_2001 = 2001;
const VALUE_2000 = 2000;
const VALUE_1999 = 1999;

const SUCCESSFUL_MONEY_DEPOSIT_WITH_2000 = {
  balance: 2000,
  name: 'Thiago José Leite'
};

const SUCCESSFUL_MONEY_DEPOSIT_WITH_1999 = {
  balance: 1999,
  name: 'Thiago José Leite'
};

const SUCCESSFUL_CONSECUTIVE_DEPOSITS = {
  balance: 3999,
  name: 'Thiago José Leite'
};

describe('Validating user balance deposit', () => {
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
      balance: INITIAL_BALANCE,
    });
  });

  afterAll(async () => {
    await connection.close();
  })

  describe('Validate if the user has a registered cpf', () => {
    it('Should not be possible to manage a account without cpf', async () => {
      await frisby
        .patch(`${endPoint}/deposit/`,
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
        .patch(`${endPoint}/deposit/`,
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
    it('Should not be possible to deposit money with no value informed', async () => {
      await frisby
        .patch(`${endPoint}/deposit/`,
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

    it('Should not be possible to deposit money if the value is negative', async () => {
      await frisby
        .patch(`${endPoint}/deposit/`,
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
  });

  describe('Validating the amount value informed by the user', () => {
    it('Should not be possible to deposit a amount value greater than 2.000', async () => {
      await frisby
        .patch(`${endPoint}/deposit/`,
          {
            value: VALUE_2001,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Sorry, cannot deposit amount values greater than 2000');
        });
    });

    it('Should be possible to deposit amount value equals to 2000', async () => {
      await frisby
        .patch(`${endPoint}/deposit/`,
          {
            value: VALUE_2000,
            cpf: VALID_CPF,
          })
        .expect('status', 201)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toStrictEqual(SUCCESSFUL_MONEY_DEPOSIT_WITH_2000);
        });
    });

    it('Should be possible to deposit amount values less than 2000', async () => {
      await frisby
        .patch(`${endPoint}/deposit/`,
          {
            value: VALUE_1999,
            cpf: VALID_CPF,
          })
        .expect('status', 201)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toStrictEqual(SUCCESSFUL_MONEY_DEPOSIT_WITH_1999);
        });
    });

    describe('Validating consecutive deposits with validated value', () => {
      it('Should be possible to deposit consecutives values amounts lesse then 2000 or equals to 2000', async () => {
        await frisby
          .patch(`${endPoint}/deposit/`,
            {
              value: VALUE_2000,
              cpf: VALID_CPF,
            })
          .expect('status', 201)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result).toStrictEqual(SUCCESSFUL_MONEY_DEPOSIT_WITH_2000);
          });

        await frisby
          .patch(`${endPoint}/deposit/`,
            {
              value: VALUE_1999,
              cpf: VALID_CPF,
            })
          .expect('status', 201)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result).toStrictEqual(SUCCESSFUL_CONSECUTIVE_DEPOSITS);
          });
      });

      it('Should be possible to deposit a value less or equal to 2000 after try with a value greater than 2000',
        async () => {
          await frisby
            .patch(`${endPoint}/deposit/`,
              {
                value: VALUE_2001,
                cpf: VALID_CPF,
              })
            .expect('status', 400)
            .then((response) => {
              const { body } = response;
              const result = JSON.parse(body);
              expect(result).toBe('Sorry, cannot deposit amount values greater than 2000');
            });

          await frisby
            .patch(`${endPoint}/deposit/`,
              {
                value: VALUE_2000,
                cpf: VALID_CPF,
              })
            .expect('status', 201)
            .then((response) => {
              const { body } = response;
              const result = JSON.parse(body);
              expect(result).toStrictEqual(SUCCESSFUL_MONEY_DEPOSIT_WITH_2000);
            });

          await frisby
            .patch(`${endPoint}/deposit/`,
              {
                value: VALUE_1999,
                cpf: VALID_CPF,
              })
            .expect('status', 201)
            .then((response) => {
              const { body } = response;
              const result = JSON.parse(body);
              expect(result).toStrictEqual(SUCCESSFUL_CONSECUTIVE_DEPOSITS);
            });
        });
    })
  });
});