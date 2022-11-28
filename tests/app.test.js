const request = require('supertest');
const app = require('../src/app.js');

describe('POST /logs', () => {
  describe('data ok', () => {
    test('should respond with 200 status code', async () => {
      const response = await request(app).post('/users').send({
        'user': 'user',
        'password': 'password'
      });

      expect(response.statusCode).toBe(200);
    })
  });

  describe('data not ok', () => {});
});
