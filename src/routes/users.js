const controller = require('../controllers/users');
const policy = require('../policies/users');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/users/`, policy.create, controller.create);
  app.post(`/${process.env.URL_PATH}/users/unique-username`, policy.isUniqueUserName, controller.isUniqueUserName);
}
