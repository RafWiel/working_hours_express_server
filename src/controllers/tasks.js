const clients = require('../controllers/clients');
const projects = require('../controllers/projects');
const {Task} = require('../models');
const {Client} = require('../models');
const {Project} = require('../models');
const tools = require('../misc/tools');
const {logger} = require('../misc/logger');
const taskType = require('../enums/taskType');

module.exports = {
  async create (req, res) {
    try {
      logger.info(req.body);

      if (validate(req, res) === false)
        return;

      const { date, type, client, project, version, description, price, hours } = req.body;

      let clientId = null;
      if (type === taskType.priceBased) {
        clientId = await clients.getId(client);
        if (!clientId) {
          tools.sendError(res, 'Client not found');
          return;
        }
      }

      const projectId = await projects.getId(type, project);
      if (!projectId) {
        tools.sendError(res, 'Project not found');
        return;
      }

      Task.create({
        date,
        type,
        clientId,
        projectId,
        version,
        description,
        price,
        hours
      })
      .then(async (item) => {
        res.send({
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
    if (!req.query.type) {
      tools.sendError(res, 'Task type not defined');
      return;
    }

    Task.findOne({
      order: [['id', 'DESC']],
      include: [{
        model: Client,
        as: 'client',
        required: false
      },{
        model: Project,
        as: 'project',
        required: true
      },],
      where: {
        type: req.query.type,
      },
    })
    .then((item) => {
      if (!item) {
        tools.sendError(res, 'Item not found');
        return;
      }

      if (item.type === taskType.priceBased) {
        res.send({
          date: item.date,
          client: item.client.name,
          project: item.project.name,
          version: item.version,
          description: item.description,
          price: item.price,
        });
      }

      if (item.type === taskType.hoursBased) {
        res.send({
          date: item.date,
          project: item.project.name,
          version: item.version,
          description: item.description,
          hours: item.hours
        });
      }
    })
    .catch((error) => tools.sendError(res, error));
  },
}

function validate(req, res) {
  const { date, type, client, project, version, description, price, hours } = req.body;

  if (!date) {
    tools.sendBadRequestError(res, 'Undefined parameter: date');
    return false;
  }

  if (!type) {
    tools.sendBadRequestError(res, 'Undefined parameter: type');
    return false;
  }

  if (!client && type === taskType.priceBased) {
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

  if (!description) {
    tools.sendBadRequestError(res, 'Undefined parameter: description');
    return false;
  }

  if (!price && type === taskType.priceBased) {
    tools.sendBadRequestError(res, 'Undefined parameter: price');
    return false;
  }

  if (!hours && type === taskType.hoursBased) {
    tools.sendBadRequestError(res, 'Undefined parameter: hours');
    return false;
  }

  return true;
}
