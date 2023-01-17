const request = require('supertest');
const app = require('../src/app.js');

jest.mock('../src/models/client', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var client =  dbMock.define('Client',  {
    name: 'client',
  });

  return client;
});

jest.mock('../src/models/project', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var project =  dbMock.define('Project',  {
    'task-type': 1,
    name: 'project',
  });

  return project;
});

jest.mock('../src/models/task', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const task =  dbMock.define('Task',  {
    date: '2022-11-30 12:00:00',
    clientId: 1,
    projectId: 1,
    version: '1',
    description: 'description',
    price: 1,
    hours: null
  });

  return task;
});

//Test GET /clients/names/distinct
describe('GET /projects/names/distinct', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .get('/server/projects/names/distinct')
        .query({
          'task-type': 1
        });

      //console.log(response.body);
      expect(response.statusCode).toBe(200);
    });

    it('response body is array', async () => {
      const response = await request(app)
        .get('/server/projects/names/distinct')
        .query({
          'task-type': 1,
          filter: 'i'
        });

      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});




