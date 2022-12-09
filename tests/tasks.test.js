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
    date: '2022-11-30 12:00:00',
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
    //console.log(options[0].where);
    if (query === 'findAll') {
      return task.build([
        {
          date: '2022-11-30 12:00:00',
          type: 1,
          client: 'client 1',
          project: 'project 1',
          version: '1',
          description: 'description',
          price: 1,
        },
        {
          date: '2022-11-30 12:00:00',
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
        date: '2022-11-30 12:00:00',
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
  date: '2022-11-30 12:00:00',
  type: 1,
  client: 'client',
  project: 'project',
  version: '1',
  description: 'description',
  price: 1,
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

//Test GET /tasks/projects/distinct
describe('GET /projects/names/distinct', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .get('/projects/names/distinct');

      //console.log(response.body);
      expect(response.statusCode).toBe(200);
    });

    it('response body is array', async () => {
      const response = await request(app)
        .get('/projects/names/distinct')
        .query({
          'task-type': 1,
          filter: 'p'
        });

      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});

//Test GET /tasks/newest
describe('GET /tasks/newest', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  describe('valid data', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app)
        .get('/tasks/newest')
        .query({ type: 1 });

      //console.log(response.body);
      expect(response.statusCode).toBe(200);
    });

    it('response has date defined', async () => {
      const response = await request(app)
        .get('/tasks/newest')
        .query({ type: 1 });

      expect(response.body.date).toBeDefined();
    });
  });
});


