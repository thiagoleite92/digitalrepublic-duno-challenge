const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const endPoint = 'http://localhost:3000/user';
const DB_URL_NAME = 'mongodb://localhost:27017/DigitalRepublic/';
const DB_NAME = 'digitalrepublic';

const VALID_NAME = 'Thiago José Leite';
const VALID_CPF = '123.456.789-00';

const ANOTHER_VALID_NAME = 'Bruno Vasconcelos'
const ANOTHER_VALID_CPF = '111.222.333-99'

const INITIAL_BALANCE = 1000;
const MORE_THAN_INITIAL_VALUE = 1001;
const VALID_VALUE_TO_TRANSFER = 50;

const NEGATIVE_VALUE = -1;

const SUCESSFUL_MONEY_TRANSFER = {
  amount_transfered: 50,
  initialState: [
    { balance: 1000, cpf: '123.456.789-00', name: 'Thiago José Leite' },
    { balance: 1000, cpf: '111.222.333-99', name: 'Bruno Vasconcelos' },
  ],
  finalState: [
    { balance: 950, cpf: '123.456.789-00', name: 'Thiago José Leite'},
    { balance: 1050, cpf: '111.222.333-99', name: 'Bruno Vasconcelos' },
  ],
}

const SUCESSFUL_MONEY_TRANSFER_SECONDTIME = {
  amount_transfered: 50,
  initialState: [
    { balance: 950, cpf: '123.456.789-00', name: 'Thiago José Leite' },
    { balance: 1050, cpf: '111.222.333-99', name: 'Bruno Vasconcelos' },
  ],
  finalState: [
    { balance: 900, cpf: '123.456.789-00', name: 'Thiago José Leite'},
    { balance: 1100, cpf: '111.222.333-99', name: 'Bruno Vasconcelos' },
  ],
}

describe('Validating transfers between users', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(DB_URL_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(DB_NAME);
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
    const users = [
      { name: VALID_NAME, cpf: VALID_CPF, balance: INITIAL_BALANCE },
      { name: ANOTHER_VALID_NAME, cpf: ANOTHER_VALID_CPF, balance: INITIAL_BALANCE }
    ]
    await db.collection('users').insertMany(users);
  });

  afterAll(async () => {
    await connection.close();
  })

  describe('Validate the value informed by the user', () => {
    it('Shouldn\'t be possible to transfer money with no value informed', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            cpf_transfer: VALID_CPF,
            cpf_receiver: ANOTHER_VALID_CPF,
            value: '',
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('Value is missing or not valid, inform a positive number.');
        });
    });

    it('Shouldn\'t be possible to transfer money if the value is negative', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
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


  describe('Validate the register of both users', () => {
    it('Shouldn\'t be possible to transfer, if the cpf from receiver and transferor are not informed', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            value: VALID_VALUE_TO_TRANSFER,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('The CPF from transferor or receiver is missing.');
        })
    });

    it('Shouldn\'t be possible to transfer, if the cpf from transferor hasn\'t be informed', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_receiver: ANOTHER_VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('The CPF from transferor or receiver is missing.');
        })
    });

    it('Shouldn\'t be possible to transfer, if the cpf from receiver hasn\'t be informed', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_transfer: VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('The CPF from transferor or receiver is missing.');
        })
    });

    it('Shouldn\'t be possible to transfer, if both cpfs, transfer and receiver, are misinformed', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_transfer: 'invalid cpf',
            cpf_receiver: 'invalid cpf',
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('One or both CPFs are misinformed.');
        })
    });

    it('Shouldn\'t be possible to transfer, if at least one cpf has been misinformed', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_transfer: VALID_CPF,
            cpf_receiver: 'invalid cpf',
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('One or both CPFs are misinformed.');
        });
    });

    it('Shouldn\'t be possible to transfer, if at least one cpf has been misinformed', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_receiver: VALID_CPF,
            cpf_transfer: 'invalid cpf',
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('One or both CPFs are misinformed.');
        });
    });
  });

  describe('Validate amount to be transfered by the transfer', () => {
    it('Shouldn\'t be possible transfer, if the amount value results in a negative balance for the transfer', async () => {
      await frisby
        .patch(`${endPoint}/transfer/`,
          {
            value: MORE_THAN_INITIAL_VALUE,
            cpf_receiver: VALID_CPF,
            cpf_transfer: ANOTHER_VALID_CPF,
          })
        .expect('status', 400)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toBe('The transfer has no sufficient funds.');
        });
    });
  });

  describe('Validate the transfer between accounts', () => {
    it('Should be possible transfer values between accounts', async () => {
      await frisby
        .patch(`${endPoint}/transfer`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_transfer: VALID_CPF,
            cpf_receiver: ANOTHER_VALID_CPF,
          })
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toStrictEqual(SUCESSFUL_MONEY_TRANSFER);
        });
    });

    it('Should be possible transfer values between accounts more than one time', async () => {
      await frisby
        .patch(`${endPoint}/transfer`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_transfer: VALID_CPF,
            cpf_receiver: ANOTHER_VALID_CPF,
          })
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toStrictEqual(SUCESSFUL_MONEY_TRANSFER);
        });

        await frisby
        .patch(`${endPoint}/transfer`,
          {
            value: VALID_VALUE_TO_TRANSFER,
            cpf_transfer: VALID_CPF,
            cpf_receiver: ANOTHER_VALID_CPF,
          })
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          const result = JSON.parse(body);
          expect(result).toStrictEqual(SUCESSFUL_MONEY_TRANSFER_SECONDTIME);
        });
    });
  })
});
