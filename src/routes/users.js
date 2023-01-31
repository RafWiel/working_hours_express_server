const users = require('../controllers/users');
const policy = require('../policies/users');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/users/`, policy.create, users.create);
  app.post(`/${process.env.URL_PATH}/users/unique-username`, policy.create, users.isUniqueUserName);
}
