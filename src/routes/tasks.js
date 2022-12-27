const tasks = require('../controllers/tasks');
const authorizationMiddleware = require('../middlewares/authorization');

module.exports = (app) => {
  app.post('/tasks', authorizationMiddleware.filter, tasks.create);
  app.get('/tasks/last', authorizationMiddleware.filter, tasks.getLast);
  app.get('/tasks', authorizationMiddleware.filter, tasks.get);
  app.post('/tasks/settle', authorizationMiddleware.filter, tasks.settle);
}
