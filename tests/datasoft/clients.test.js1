const request = require('supertest');
const app = require('../../src/app.js');

jest.mock('../../src/models/datasoft/client', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var client =  dbMock.define('Client_DS',  {
    name: 'client',
  }, {
    instanceMethods: {
        map: function () {
          var array = ['client 1', 'client 2'];
          return array;
        },
    },
  });

  client.$queryInterface.$useHandler(function(query) {
    //console.log(options[0].where);
    if (query === 'findAll') {
      return client.build([
        {
          name: 'client 1',
        },
        {
          name: 'client 2',
        }
      ]);
    }
  });

  return client;
});

jest.mock('../../src/models/datasoft/task', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const task =  dbMock.define('Task_DS',  {
    date: '2022-11-30 12:00:00',
    clientId: 1,
    project: 'project',
    version: '1',
    price: 1,
    description: 'description'
  }, {
    instanceMethods: {
        map: function () {
          var array = ['project 1', 'project 2'];
          return array;
        },
    },
  });

  task.$queryInterface.$useHandler(function(query) {
    //console.log(options[0].where);
    if (query === 'findAll') {
      return task.build([
        {
          date: '2022-11-30 12:00:00',
          clientId: 1,
          project: 'project 1',
          version: '1',
          price: 1,
          description: 'description'
        },
        {
          date: '2022-11-30 12:00:00',
          clientId: 1,
          project: 'project 2',
          version: '2',
          price: 1,
          description: 'description'
        }
      ]);
    }
  });

  return task;
});

//Test GET /ds/clients/names/distinct
describe('GET /ds/clients/names/distinct', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .get('/ds/clients/names/distinct');

      console.log(response.body);
      expect(response.statusCode).toBe(200);
    });

    it('response body is array', async () => {
      const response = await request(app)
        .get('/ds/clients/names/distinct')
        .query({ filter: 'c' });

      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});




