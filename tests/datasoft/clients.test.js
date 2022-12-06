const request = require('supertest');
const app = require('../../src/app.js');

jest.mock('../../src/models/datasoft/client', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var taskMock =  dbMock.define('Client_DS',  {
    name: 'client',
  }, {
    instanceMethods: {
        map: function () {
          var array = ['client 1', 'client 2'];
          return array;
        },
    },
  });

  taskMock.$queryInterface.$useHandler(function(query) {
    //console.log(options[0].where);
    if (query === 'findAll') {
      return taskMock.build([
        {
          name: 'client 1',
        },
        {
          name: 'client 2',
        }
      ]);
    }
  });

  return taskMock;
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




