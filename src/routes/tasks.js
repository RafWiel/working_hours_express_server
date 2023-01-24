const tasks = require('../controllers/tasks');
const authorizationMiddleware = require('../middlewares/authorization');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/tasks`, authorizationMiddleware.filter, tasks.create);
  app.get(`/${process.env.URL_PATH}/tasks/last`, authorizationMiddleware.filter, tasks.getLast);
  app.get(`/${process.env.URL_PATH}/tasks/:id`, authorizationMiddleware.filter, tasks.getOne);
  app.get(`/${process.env.URL_PATH}/tasks`, authorizationMiddleware.filter, tasks.get);
  app.post(`/${process.env.URL_PATH}/tasks/settle`, authorizationMiddleware.filter, tasks.settle);
}
