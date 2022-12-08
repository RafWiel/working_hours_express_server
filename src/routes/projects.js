const projects = require('../controllers/projects');
const authorizationMiddleware = require('../middlewares/authorization');

module.exports = (app) => {
  app.get('/projects/names/distinct', authorizationMiddleware.filter, projects.getNamesDistinct);

}
