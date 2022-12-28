const request = require('supertest');
const app = require('../src/app.js');

jest.mock('../src/models/client', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var client =  dbMock.define('Client',  {
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

    if (query === 'findOne') {
      return client.build({
        id: 1,
        name: 'client 1',
      });
    }
  });

  return client;
});

jest.mock('../src/models/project', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  var project =  dbMock.define('Project',  {
    taskType: 1,
    name: 'project',
  });

  return project;
});

jest.mock('../src/models/task', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const task =  dbMock.define('Task',  {
    creationDate: '2022-11-30 12:00:00',
    type: 1,
    clientId: 1,
    projectId: 1,
    version: '1',
    description: 'description',
    price: 1,
    hours: null
  }, {
    instanceMethods: {
        map: function () {
          var array = ['project 1', 'project 2'];
          return array;
        },
    },
  });

  task.$queryInterface.$useHandler(function(query) {
    //console.log('QUERY:', query);
    if (query === 'findAll') {
      return task.build([
        {
          creationDate: '2022-11-30 12:00:00',
          type: 1,
          client: 'client 1',
          project: 'project 1',
          version: '1',
          description: 'description',
          price: 1,
        },
        {
          creationDate: '2022-11-30 12:00:00',
          type: 2,
          client: 'client 2',
          project: 'project 2',
          version: '2',
          description: 'description',
          hours: 1,
        }
      ]);
    }
    if (query === 'findOne') {
      return task.build({
        creationDate: '2022-11-30 12:00:00',
        type: 1,
        client: 'client 1',
        project: 'project 1',
        version: '1',
        description: 'description',
        price: 1,
      });
    }
  });

  return task;
});

const task = {
  creationDate: '2022-11-30 12:00:00',
  type: 1,
  client: 'client',
  project: 'project',
  version: '1',
  description: 'description',
  price: 1,
};

const settlement = {
  idArray: [
    1,
    2,
    3
  ],
  settlementDate: '2022-12-28',
};

//Test POST /tasks
describe('POST /tasks', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .post('/tasks')
        .send(task);

      expect(response.statusCode).toBe(200);
    });

    it('specifies json in content type header', async () => {
      const response = await request(app)
        .post('/tasks')
        .send(task);

      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    it('response has taskId defined', async () => {
      const response = await request(app)
        .post('/tasks')
        .send(task);

      expect(response.body.taskId).toBeDefined();
    });
  });

  describe('invalid data', () => {
    const bodyArray = [
      {
        type: 1,
        client: 'client',
        project: 'project',
        version: '1',
        description: 'description',
        price: 1,
      },
      {
        date: '2022-11-30 12:00:00',
        type: 1,
        project: 'project',
        version: '1',
        description: 'description',
        price: 1,
      },
      {
        date: '2022-11-30 12:00:00',
        type: 1,
        client: 'client',
        version: '1',
        description: 'description',
        price: 1,
      },
      {
        date: '2022-11-30 12:00:00',
        type: 1,
        client: 'client',
        project: 'project',
        description: 'description',
        price: 1,
      },
      {
        date: '2022-11-30 12:00:00',
        type: 1,
        client: 'client',
        project: 'project',
        version: '1',
        description: 'description'
      },
      {
        date: '2022-11-30 12:00:00',
        type: 1,
        client: 'client',
        project: 'project',
        version: '1',
        price: 1,
      },
    ]

    bodyArray.forEach(async (item) => {
      it('responds with 400 status code', async () => {
        const response = await request(app)
          .post('/tasks')
          .send(item);

        expect(response.statusCode).toBe(400);
      });
    });
  });
});

//Test GET /tasks/last
describe('GET /tasks/last', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .get('/tasks/last')
        .query({ type: 1 });

      //console.log(response.body);
      expect(response.statusCode).toBe(200);
    });

    it('response has creationDate defined', async () => {
      const response = await request(app)
        .get('/tasks/last')
        .query({ type: 1 });

      expect(response.body.creationDate).toBeDefined();
    });
  });

  describe('invalid data', () => {
    it('responds with 500 status code', async () => {
      const response = await request(app)
        .get('/tasks/last')
        .query({ type: null });

      //console.log(response.body);
      expect(response.statusCode).toBe(500);
    });
  });
});

//Test POST /tasks/settle
describe('POST /tasks/settle', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .post('/tasks/settle')
        .send(settlement);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('invalid data', () => {
    const bodyArray = [
      {
        idArray: null,
        settlementDate: '2022-12-28',
      },
      {
        idArray: [
        ],
        settlementDate: '2022-12-28',
      },
      {
        idArray: [
          1,
          2,
          3
        ],
        settlementDate: null,
      },
      {
        idArray: [
          1,
          2,
          3
        ],
        settlementDate: '',
      },
    ]

    bodyArray.forEach(async (item) => {
      it('responds with 400 status code', async () => {
        const response = await request(app)
          .post('/tasks/settle')
          .send(item);

        expect(response.statusCode).toBe(400);
      });
    });
  });
});

//Test GET /tasks
// describe('GET /tasks', () => {
//   beforeEach(() => {
//     process.env.NODE_ENV = 'development';
//   });

//   describe('valid data', () => {
//     it('responds with 200 status code', async () => {
//       const response = await request(app)
//         .get('/tasks');

//       //console.log(response.body);
//       expect(response.statusCode).toBe(200);
//     });

//     it('response has items defined', async () => {
//       const response = await request(app)
//         .get('/tasks');

//       expect(response.body.items).toBeDefined();
//     });

//     it('response items is array', async () => {
//       const response = await request(app)
//         .get('/tasks');

//       expect(Array.isArray(response.body.items)).toBeTruthy();
//     });
//   });
// });

