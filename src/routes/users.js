const controller = require('../controllers/users');
const policy = require('../policies/users');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/users/`, policy.create, controller.create);
  app.post(`/${process.env.URL_PATH}/users/unique-username`, policy.isUniqueUsername, controller.isUniqueUsername);
  app.post(`/${process.env.URL_PATH}/user`, policy.login, controller.login);
  app.put(`/${process.env.URL_PATH}/user`, policy.setLocale, controller.setLocale);
}
