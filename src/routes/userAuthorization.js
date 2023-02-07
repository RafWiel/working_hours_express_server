const controller = require('../controllers/userAuthorization');
const policy = require('../policies/userAuthorization');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/login`, policy.login, controller.login);
}
