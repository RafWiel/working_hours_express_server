const {Task_AD} = require('../../models');
const tools = require('../../misc/tools');
const {logger} = require('../../misc/logger');
const { Sequelize, Op } = require('sequelize');

function validate(req, res) {
  const { date, project, version, hoursCount } = req.body;

  if (!date) {
    tools.sendBadRequestError(res, 'Undefined parameter: date');
    return false;
  }

  if (!project) {
    tools.sendBadRequestError(res, 'Undefined parameter: project');
    return false;
  }

  if (!version) {
    tools.sendBadRequestError(res, 'Undefined parameter: version');
    return false;
  }

  if (!hoursCount) {
    tools.sendBadRequestError(res, 'Undefined parameter: hoursCount');
    return false;
  }

  return true;
}

module.exports = {
  async create (req, res) {
    try {
      logger.info(req.body);

      if (validate(req, res) === false)
        return;

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
