const controller = require('../controllers/tasks');
const authorization = require('../middlewares/authorization');
const policy = require('../policies/tasks');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/tasks`, authorization.filter, policy.create, controller.create);
  app.put(`/${process.env.URL_PATH}/tasks`, authorization.filter, policy.update, controller.update);
  app.get(`/${process.env.URL_PATH}/tasks/last`, authorization.filter, policy.getLast, controller.getLast);
  app.get(`/${process.env.URL_PATH}/tasks/:id`, authorization.filter, policy.getOne, controller.getOne);
  app.get(`/${process.env.URL_PATH}/tasks`, authorization.filter, controller.get);
  app.post(`/${process.env.URL_PATH}/tasks/settle`, authorization.filter, policy.settle, controller.settle);
  app.delete(`/${process.env.URL_PATH}/tasks/:id`, authorization.filter, policy.getOne, controller.delete);
}
