const controller = require('../controllers/userRegistration');
const policy = require('../policies/userRegistration');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/users/`, policy.create, controller.create);
  app.post(`/${process.env.URL_PATH}/users/unique-username`, policy.isUniqueUsername, controller.isUniqueUsername);
}
