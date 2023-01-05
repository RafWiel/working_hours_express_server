const clients = require('../controllers/clients');
const authorizationMiddleware = require('../middlewares/authorization');

module.exports = (app) => {
  app.get('/clients/names/distinct', authorizationMiddleware.filter, clients.getNamesDistinct);
  app.get('/clients', authorizationMiddleware.filter, clients.get);

}
