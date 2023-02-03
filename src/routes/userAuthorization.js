const controller = require('../controllers/userAuthorization');
const authorization = require('../middlewares/authorization');
const policy = require('../policies/userAuthorization');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/login`, authorization.filter, policy.login, controller.login);
}
