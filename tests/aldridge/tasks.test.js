const request = require('supertest');
const app = require('../../src/app.js');

jest.mock('../../src/models/aldridge/task', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var taskMock =  dbMock.define('Task_AD',  {
    date: '2022-11-30 12:00:00',
    project: 'project',
    version: '1',
    hoursCount: 1
  });

  // taskMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
  //   if (query === 'create') {
  //     return taskMock.build({ taskId: 1 });
  //   }
  // });

  return taskMock;
});

const task = {
  date: '2022-11-30 12:00:00',
  project: 'project',
  version: '1',
  hoursCount: 3
};

describe('POST /ad/tasks', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app).post('/ad/tasks').send(task);

      expect(response.statusCode).toBe(200);
    });

    it('specifies json in content type header', async () => {
      const response = await request(app).post('/ad/tasks').send(task);

      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    it('response has taskId defined', async () => {
      const response = await request(app).post('/ad/tasks').send(task);

      expect(response.body.taskId).toBeDefined();
    });
  });

  describe('invalid data', () => {
    const bodyArray = [
      {
        project: 'project',
        version: '1',
        hoursCount: 3
      },
      {
        date: '2022-11-30 12:00:00',
        version: '1',
        hoursCount: 3
      },
      {
        date: '2022-11-30 12:00:00',
        project: 'project',
        hoursCount: 3
      },
      {
        date: '2022-11-30 12:00:00',
        project: 'project',
        version: '1',
        hoursCount: null
      }
    ]

    bodyArray.forEach(async (item) => {
      it('responds with 400 status code', async () => {
        const response = await request(app).post('/ad/tasks').send(item);

        expect(response.statusCode).toBe(400);
      });
    });
  });
});


