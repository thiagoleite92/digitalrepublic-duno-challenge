const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const endPoint = 'http://localhost:3000/user';
const DB_URL_NAME = 'mongodb://localhost:27017/DigitalRepublic/';
const DB_NAME = 'digitalrepublic';

const VALID_NAME = 'Thiago José Leite';
const ANOTHER_VALID_NAME = 'Bruno Vasconcelos'
const INVALID_NAME_NUMBERS = 123;
const INVALID_NAME_CHARS = 'Th14go J0s3 Si#queir@ Leit3';
const INVALID_NAME_MIN_LENGTH = 'Thiago'
const INVALID_NAME_MAX_LENGTH = 'Thiago José Siqueira Leite'

const VALID_CPF = '123.456.789-00';
const INVALID_CPF_FORMAT = '1a#-4b@-7c!-0*';

const NEW_USER_RESPONSE = {
  message: 'A new user has been registered',
  name: VALID_NAME,
  cpf: VALID_CPF,
  balance: 0,
};

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
          expect(result).toBe('Name must be informed.');
        });
    });

    it('Field name must be at least 12 characters long', async () => {
      await frisby
        .post(`${endPoint}/register/`,
          {
            name: INVALID_NAME_MIN_LENGTH,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Name must be between 12 and 25 characters.');
        });
    });

    it('Field name must have at most 25 characters long', async () => {
      await frisby
        .post(`${endPoint}/register/`,
          {
            name: INVALID_NAME_MAX_LENGTH,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Name must be between 12 and 25 characters.');
        });
    });

    it('Field name cannot be numbers', async () => {
      await frisby
        .post(`${endPoint}/register/`,
          {
            name: INVALID_NAME_CHARS,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Name must contain only letters.');
        });
    });

    it('Field name cannot have special characters', async () => {
      await frisby
        .post(`${endPoint}/register/`,
          {
            name: INVALID_NAME_NUMBERS,
            cpf: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Name must contain only letters.');
        });
    });

    describe('Field cpf validation', () => {
      it('Field cpf is required', async () => {
        await frisby
          .post(`${endPoint}/register/`,
            {
              name: VALID_NAME,
            })
          .expect('status', 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result).toBe('CPF must be informed.');
          });
      });

      it('Field cpf must have format "123.456.789-00"', async () => {
        await frisby
          .post(`${endPoint}/register/`,
            {
              name: VALID_NAME,
              cpf: INVALID_CPF_FORMAT,
            })
          .expect('status', 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result).toBe('CPF must be format: 123.456.789-00.');
          });
      });
    })

    describe('Register of a new user with valid name and cpf', () => {
      it('Should be possible to register a new user with valid name and valid cpf', async () => {
        await frisby
          .post(`${endPoint}/register/`,
            {
              name: VALID_NAME,
              cpf: VALID_CPF,
            })
          .expect('status', 201)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result).toStrictEqual(NEW_USER_RESPONSE);
          });
      });
    });

    describe('Register with duplicated cpf is not possible', () => {
      it('Shouldn\'t be possible to register two users with the same cpf', async () => {
        await frisby
          .post(`${endPoint}/register/`,
            {
              name: VALID_NAME,
              cpf: VALID_CPF,
            })
          .expect('status', 201)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result).toStrictEqual(NEW_USER_RESPONSE);
          });

        await frisby
          .post(`${endPoint}/register/`,
            {
              name: ANOTHER_VALID_NAME,
              cpf: VALID_CPF,
            })
          .expect('status', 409)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result).toBe('CPF already in use.');
          });
      });
    })
  });
});