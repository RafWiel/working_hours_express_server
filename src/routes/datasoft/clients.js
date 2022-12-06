const clients = require('../../controllers/datasoft/clients');
const authorizationMiddleware = require('../../middlewares/authorization');

module.exports = (app) => {
  app.get('/ds/clients/names/distinct', authorizationMiddleware.filter, clients.getNamesDistinct);

}
