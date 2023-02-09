const controller = require('../controllers/clients');
const authorization = require('../middleware/authorization');
const policy = require('../policies/clients');

module.exports = (app) => {
  app.get(`/${process.env.URL_PATH}/clients/names/distinct`, authorization.filter, policy.getNamesDistinct, controller.getNamesDistinct);
  app.get(`/${process.env.URL_PATH}/clients`, authorization.filter, controller.get);
}
