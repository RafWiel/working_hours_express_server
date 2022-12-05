const tasks = require('../../controllers/datasoft/tasks');
const authorizationMiddleware = require('../../middlewares/authorization');

module.exports = (app) => {
  app.post('/ds/tasks', authorizationMiddleware.filter, tasks.create);
  //app.get('/ad/tasks/projects/distinct', authorizationMiddleware.filter, tasks.getProjectsDistinct);
  //app.get('/ad/tasks/newest', authorizationMiddleware.filter, tasks.getNewest);
}
