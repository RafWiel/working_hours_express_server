const logs = require('../controllers/logs');

module.exports = (app) => {
  app.post('/logs', logs.create);
}
