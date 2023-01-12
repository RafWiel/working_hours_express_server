const logs = require('../controllers/logs');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/logs`, logs.create);
}
