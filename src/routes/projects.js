const projects = require('../controllers/projects');
const authorizationMiddleware = require('../middlewares/authorization');

module.exports = (app) => {
  app.get(`/${process.env.URL_PATH}/projects/names/distinct`, authorizationMiddleware.filter, projects.getNamesDistinct);

}
