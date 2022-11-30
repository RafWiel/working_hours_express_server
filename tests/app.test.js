const request = require('supertest');
const app = require('../src/app.js');

describe('POST /logs', () => {
  describe('data ok', () => {
    it('responds with 200 status code', async () => {
      const response = await request(app).post('/users').send({
        user: 'user',
        password: 'password'
      });

      expect(response.statusCode).toBe(200);
    });

    it('specifies json in content type header', async () => {
      const response = await request(app).post('/users').send({
        user: 'user',
        password: 'password'
      });

      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    it('response has userId defined', async () => {
      const response = await request(app).post('/users').send({
        user: 'user',
        password: 'password'
      });

      expect(response.body.userId).toBeDefined();
    });
  });

  describe('data not ok', () => {
    const bodyArray = [
      { user: 'user' },
      { password: 'password' },
      {}
    ]
    bodyArray.forEach(async (item) => {
      it('responds with 400 status code', async () => {
        const response = await request(app).post('/users').send(item);

        expect(response.statusCode).toBe(400);
      });
    });
  });
});
