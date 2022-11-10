const {Task_AD} = require('../../models');
const tools = require('../../misc/tools');
const {logger} = require('../../misc/logger');
const { Sequelize, Op } = require('sequelize');

module.exports = {
  async create (req, res) {
    try {
      logger.info(req.body);

      const { date, project, version, hoursCount } = req.body;

      Task_AD.create({
        date,
        project,
        version,
        hoursCount,
      })
      .then(async (item) => {
        res.send({
          result: true,
          taskId: item.id,
        });
      })
      .catch((error) => tools.sendError(res, error));
    }
    catch (error) {
      tools.sendError(res, error);
    }
  },
  async getNewest (req, res) {
    Task_AD.findOne({
      order: [['id', 'DESC']],
    })
    .then((item) => res.send(item))
    .catch((error) => tools.sendError(res, error));
  },
  async getProjectsDistinct (req, res) {
    Task_AD.findAll({
      attributes: [Sequelize.fn('distinct', Sequelize.col('project')) ,'project'],
      where: {
        project: {
          [Op.like]: `%${req.query.filter}%`
        }
      }
    })
    .then((values) => res.send(values.map(u => u.project)))
    .catch((error) => tools.sendError(res, error));
  },
}
