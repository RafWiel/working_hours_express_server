const { logger } = require('../../misc/logger');
const {Client_DS} = require('../../models');

module.exports = {
  async getId (name) {
    try {
      //find client
      let client = await Client_DS.findOne({
        where: {
          name: name,
        }
      });

      // create new client
      if (!client) {
        client = await Client_DS.create({
          name
        });
      }

      return client.id;
    }
    catch (error) {
      logger.error(error);
    }

    return null;
  },
}
