const controller = require('../controllers/logs');

module.exports = (app) => {
  app.post(`/${process.env.URL_PATH}/logs`, controller.create);
}
