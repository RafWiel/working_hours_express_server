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

      const previousItem = await getNewestTask(req.body.type);

      if (isDuplicate(req.body, previousItem)) {
        tools.sendDuplicateError(res, 'Duplicate request');
        return;
      }

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

function isDuplicate(item1, item2) {
  tutaj
  logger.info('tutaj');
  if (item1 === null || item2 === null) {
    return false;
  }

  if (new Date(item1.date).getTime() !== new Date(item2.date).getTime()) {
    return false;
  }

  if (item1.type === taskType.priceBased
    && item1.client.localeCompare(item2.client, undefined, { sensitivity: 'accent' }) !== 0) {
    return false;
  }

  if (item1.project.localeCompare(item2.project, undefined, { sensitivity: 'accent' }) !== 0) {
    return false;
  }

  if (item1.version.localeCompare(item2.version, undefined, { sensitivity: 'accent' }) !== 0) {
    return false;
  }

  if (item1.description.localeCompare(item2.description, undefined, { sensitivity: 'accent' }) !== 0) {
    return false;
  }

  if (item1.type === taskType.priceBased
    && parseFloat(item1.price) !== parseFloat(item2.price)) {
    return false;
  }

  if (item1.type === taskType.hoursBased
    && parseFloat(item1.hours) !== parseFloat(item2.hours)) {
    return false;
  }


  return true;
}

function getNewestTask(type) {
  if (!type) return null;

  return new Promise((resolve) => {
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
        type,
      },
    })
    .then((item) => resolve(item))
    .catch(() => null);
  });
}


