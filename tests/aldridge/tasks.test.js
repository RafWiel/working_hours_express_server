const request = require('supertest');
const app = require('../../src/app.js');

describe('POST /ad/tasks', () => {
  describe('valid data', () => {
    test('responds with 200 status code', async () => {
      const response = await request(app).post('/ad/tasks').send({
        user: 'user',
        password: 'password'
      });

      expect(response.statusCode).toBe(200);
    });


  });

  describe('invalid data', () => {
  });
});
