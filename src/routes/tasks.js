const tasks = require('../controllers/tasks');
const authorizationMiddleware = require('../middlewares/authorization');

module.exports = (app) => {
  app.post('/tasks', authorizationMiddleware.filter, tasks.create);
  app.get('/tasks/newest', authorizationMiddleware.filter, tasks.getNewest);
}
