const { logger } = require('../misc/logger');
const {Project} = require('../models');
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
    let where = {};

    if(req.query.filter) {
      where = {
        [Op.and]: [
          { taskType: req.query['task-type'] },
          { name: {
            [Op.like]: `%${req.query.filter}%`
          } }
        ]
      };
    }
    else {
      where = {
        taskType: req.query['task-type'],
      }
    }

    Project.findAll({
      attributes: [Sequelize.fn('distinct', Sequelize.col('name')) ,'name'],
      where
    })
    .then((values) => res.send(values.map(u => u.name)))
    .catch((error) => tools.sendError(res, error));
  },
}
