const controller = require('../controllers/projects');
const authorization = require('../middlewares/authorization');
const policy = require('../policies/projects');

module.exports = (app) => {
  app.get(`/${process.env.URL_PATH}/projects/names/distinct`, authorization.filter, policy.getNamesDistinct, controller.getNamesDistinct);

}
