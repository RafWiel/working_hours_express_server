const clients = require('../../controllers/datasoft/clients');
const {Task_DS} = require('../../models');
const {Client_DS} = require('../../models');
const tools = require('../../misc/tools');
const {logger} = require('../../misc/logger');
const { Sequelize, Op } = require('sequelize');

function validate(req, res) {
  const { date, client, project, version, price, description } = req.body;

  if (!date) {
    tools.sendBadRequestError(res, 'Undefined parameter: date');
    return false;
  }

  if (!client) {
    tools.sendBadRequestError(res, 'Undefined parameter: client');
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

  if (!price) {
    tools.sendBadRequestError(res, 'Undefined parameter: price');
    return false;
  }

  if (!description) {
    tools.sendBadRequestError(res, 'Undefined parameter: description');
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

      const { date, client, project, version, price, description } = req.body;

      const clientId = await clients.getId(client);
      if (!clientId) {
        tools.sendError(res, 'Client not found');
        return;
      }

      Task_DS.create({
        date,
        clientId,
        project,
        version,
        price,
        description
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
    Task_DS.findOne({
      order: [['id', 'DESC']],
      include: { model: Client_DS, as: 'client', required: true },
    })
    .then((item) => res.send({
      date: item.date,
      client: item.client.name,
      project: item.project,
      version: item.version,
      price: item.price,
      description: item.description
    }))
    .catch((error) => tools.sendError(res, error));
  },
  async getProjectsDistinct (req, res) {
    Task_DS.findAll({
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
