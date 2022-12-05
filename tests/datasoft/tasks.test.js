const request = require('supertest');
const app = require('../../src/app.js');

jest.mock('../../src/models/datasoft/task', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var taskMock =  dbMock.define('Task_DS',  {
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

  taskMock.$queryInterface.$useHandler(function(query) {
    //console.log(options[0].where);
    if (query === 'findAll') {
      return taskMock.build([
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

  return taskMock;
});

const task = {
  date: '2022-11-30 12:00:00',
  client: 'client',
  project: 'project',
  version: '1',
  price: 1,
  description: 'description'
};

//Test POST /ds/tasks
describe('POST /ds/tasks', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .post('/ds/tasks')
        .send(task);

      expect(response.statusCode).toBe(200);
    });

    it('specifies json in content type header', async () => {
      const response = await request(app)
        .post('/ds/tasks')
        .send(task);

      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    it('response has taskId defined', async () => {
      const response = await request(app)
        .post('/ds/tasks')
        .send(task);

      expect(response.body.taskId).toBeDefined();
    });
  });

  describe('invalid data', () => {
    const bodyArray = [
      {
        client: 'client',
        project: 'project',
        version: '1',
        price: 1,
        description: 'description'
      },
      {
        date: '2022-11-30 12:00:00',
        project: 'project',
        version: '1',
        price: 1,
        description: 'description'
      },
      {
        date: '2022-11-30 12:00:00',
        client: 'client',
        version: '1',
        price: 1,
        description: 'description'
      },
      {
        date: '2022-11-30 12:00:00',
        client: 'client',
        project: 'project',
        price: 1,
        description: 'description'
      },
      {
        date: '2022-11-30 12:00:00',
        client: 'client',
        project: 'project',
        version: '1',
        description: 'description'
      },
      {
        date: '2022-11-30 12:00:00',
        client: 'client',
        project: 'project',
        version: '1',
        price: 1,
      },
    ]

    bodyArray.forEach(async (item) => {
      it('responds with 400 status code', async () => {
        const response = await request(app)
          .post('/ds/tasks')
          .send(item);

        expect(response.statusCode).toBe(400);
      });
    });
  });
});

//Test GET /ds/tasks/projects/distinct
// describe('GET /ds/tasks/projects/distinct', () => {
//   beforeEach(() => {
//     process.env.NODE_ENV = 'development';
//   });

//   describe('valid data', () => {
//     it('responds with 200 status code', async () => {
//       const response = await request(app)
//         .get('/ds/tasks/projects/distinct');

//       console.log(response.body);
//       expect(response.statusCode).toBe(200);
//     });

//     it('response body is array', async () => {
//       const response = await request(app)
//         .get('/ds/tasks/projects/distinct')
//         .query({ filter: 'p' });

//       expect(Array.isArray(response.body)).toBeTruthy();
//     });
//   });
// });

//Test GET /ds/tasks/newest
// describe('GET /ds/tasks/newest', () => {
//   beforeEach(() => {
//     process.env.NODE_ENV = 'development';
//   });

//   describe('valid data', () => {
//     it('responds with 200 status code', async () => {
//       const response = await request(app)
//         .get('/ds/tasks/newest');

//       console.log(response.body);
//       expect(response.statusCode).toBe(200);
//     });

//     it('response has date defined', async () => {
//       const response = await request(app)
//         .get('/ds/tasks/newest');

//       expect(response.body.date).toBeDefined();
//     });
//   });
// });

