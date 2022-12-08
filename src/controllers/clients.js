const { logger } = require('../misc/logger');
const {Client} = require('../models');
const { Sequelize, Op } = require('sequelize');
const tools = require('../misc/tools');

module.exports = {
  async getId (name) {
    try {
      //find client
      let client = await Client.findOne({
        where: {
          name: name,
        }
      });

      // create new client
      if (!client) {
        client = await Client.create({
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
  async getNamesDistinct (req, res) {
    Client.findAll({
      attributes: [Sequelize.fn('distinct', Sequelize.col('name')) ,'name'],
      where: {
        name: {
          [Op.like]: `%${req.query.filter}%`
        }
      }
    })
    .then((values) => res.send(values.map(u => u.name)))
    .catch((error) => tools.sendError(res, error));
  },
}