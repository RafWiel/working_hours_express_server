const clients = require('../controllers/clients');
const authorizationMiddleware = require('../middlewares/authorization');

module.exports = (app) => {
  app.get(`/${process.env.URL_PATH}/clients/names/distinct`, authorizationMiddleware.filter, clients.getNamesDistinct);
  app.get(`/${process.env.URL_PATH}/clients`, authorizationMiddleware.filter, clients.get);
}
