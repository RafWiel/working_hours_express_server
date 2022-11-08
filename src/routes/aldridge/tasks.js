const tasks = require('../../controllers/aldridge/tasks');
const authorizationMiddleware = require('../../middlewares/authorization');

module.exports = (app) => {
  app.post('/ad/tasks', authorizationMiddleware.filter, tasks.create);
}
