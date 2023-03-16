const { logger } = require('../misc/logger');
const { Project, Client } = require('../models');
const { Sequelize, Op } = require('sequelize');
const tools = require('../misc/tools');

module.exports = {
  async getId (clientId, taskType, name) {
    try {
      //find project
      let project = await Project.findOne({
        where: {
          [Op.and]: [
            { clientId },
            { taskType },
            { name }
          ]
        }
      });

      // create new project
      if (!project) {
        project = await Project.create({
          clientId,
          taskType,
          name
        });
      }

      return project.id;
    }
    catch (error) {
      logger.error(error);
    }

    return null;
  },
  async getNamesDistinct (req, res) {
    let client = null;

    if (req.query['client']) {
      client = await Client.findOne({
        attributes: [ 'id' ],
        where: {
          name: req.query['client'],
        }
      });
    }

    let where = `taskType = ${req.query['task-type']}
      and clientId = ${(client ? client.id : 0)} `;

    if(req.query.filter) {
      where += `and name like '%${req.query.filter}%'`
    }

    console.log('where: ', where);

    Project.findAll({
      attributes: [Sequelize.fn('distinct', Sequelize.col('name')) ,'name'],
      where: Sequelize.literal(where)
    })
    .then((values) => res.send(values.map(u => u.name)))
    .catch((error) => tools.sendError(res, error));
  },
}
