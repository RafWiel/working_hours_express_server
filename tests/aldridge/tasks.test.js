const request = require('supertest');
const app = require('../../src/app.js');


//const models = require('../../src/models/index');

jest.mock('../../src/models/index', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  return dbMock.define('Task_AD',  {
    date: '2022-11-30 12:00:00',
    project: 'project',
    version: '1',
    hoursCount: 1
  })
});

// jest.mock('../../src/models/index', () => ({
//   Task_AD: jest.fn(),
// }));

// models.Task_AD.mockImplementation(() => {
//   return dbMock.define('Task_AD',  {
//     date: '2022-11-30 12:00:00',
//     project: 'project',
//     version: '1',
//     hoursCount: 1
//   })
// });

describe('POST /ad/tasks', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app).post('/ad/tasks').send({
        date: '2022-11-30 12:00:00',
        project: 'project',
        version: '1',
        hoursCount: 2
      });

      expect(response.statusCode).toBe(200);
    });


  });

  describe('invalid data', () => {
  });
});
