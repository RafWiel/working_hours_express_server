const { logger } = require('../misc/logger');
const {Project} = require('../models');
const { Sequelize, Op } = require('sequelize');
const tools = require('../misc/tools');

module.exports = {
  async getId (taskType, name) {
    try {
      //find project
      let project = await Project.findOne({
        where: {
          [Op.and]: [
            { taskType },
            { name }
          ]
        }
      });

      // create new project
      if (!project) {
        project = await Project.create({
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
    if (!req.query['task-type']) {
      tools.sendBadRequestError(res, 'Undefined parameter: task-type');
      return;
    }

    Project.findAll({
      attributes: [Sequelize.fn('distinct', Sequelize.col('name')) ,'name'],
      where: {
        [Op.and]: [
          { taskType: req.query['task-type'] },
          { name: {
            [Op.like]: `%${req.query.filter}%`
          } }
        ]
      }
    })
    .then((values) => res.send(values.map(u => u.name)))
    .catch((error) => tools.sendError(res, error));
  },
}
