const clients = require('../controllers/clients');
const projects = require('../controllers/projects');
const {Task} = require('../models');
const {Client} = require('../models');
const {Project} = require('../models');
const tools = require('../misc/tools');
const {logger} = require('../misc/logger');
const taskType = require('../enums/taskType');
const moment = require('moment');
const { QueryTypes } = require('sequelize');
const {sequelize} = require('../models');

module.exports = {
  async create (req, res) {
    try {
      logger.info(req.body);

      if (validate(req, res) === false)
        return;

      const previousItem = await getLastTask(req.body.type);

      if (previousItem && isDuplicate(req.body, previousItem)) {
        tools.sendDuplicateError(res, 'Duplicate request');
        return;
      }

      let { creationDate } = req.body;
      const { type, client, project, version, description, price, hours } = req.body;

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

      creationDate = moment(creationDate).format('YYYY-MM-DD');

      Task.create({
        creationDate,
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
  async getLast (req, res) {
    getLastTask(req.query.type)
    .then((item) => res.send(item))
    .catch((error) => tools.sendError(res, error));
  },
  async get (req, res) {
    try {
      const page = req.query.page || 1;

      console.log('query', req.query);

      // run query
      sequelize.query(`
        select
          t.id,
          t.creationDate,
          t.settlementDate,
          t.type,
          t.version,
          t.description,
          t.price,
          t.hours,
          c.name as client,
          p.name as project
        from Tasks t
        left join Clients c on c.id = t.clientId
        left join Projects p on p.id = t.projectId
        limit 50
        offset :offset
      `, {
        type: QueryTypes.SELECT,
        replacements: {
          offset: 50 * (page - 1),
        },
      })
      .then((tasks) => {
        res.send({
          tasks,
          meta: {
            page: 1,
          },
        });
      });
    }
    catch (error) { tools.sendError(res, error); }
  },
  async settle (req, res) {
    try {
      logger.info(req.body);

      const { idArray } = req.body;

      let { settlementDate } = req.body;
      settlementDate = moment(settlementDate).format('YYYY-MM-DD');

      Task.update({
        settlementDate,
      }, {
        where: {
          id: idArray,
        },
      }
      )
      .then(async () => {
        res.status(200).send();
      })
      .catch((error) => tools.sendError(res, error));
    }
    catch (error) {
      tools.sendError(res, error);
    }
  },
}

function validate(req, res) {
  const { creationDate, type, client, project, version, description, price, hours } = req.body;

  if (!creationDate) {
    tools.sendBadRequestError(res, 'Undefined parameter: creationDate');
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
  if (item1 === null || item2 === null) {
    return false;
  }

  const creationDate1 = moment(item1.creationDate).format('YYYY-MM-DD');
  const creationDate2 = moment(item2.creationDate).format('YYYY-MM-DD');

  if (new Date(creationDate1).getTime() !== new Date(creationDate2).getTime()) {
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

function getLastTask(type) {
  return new Promise((resolve, reject) => {
    if (!type) reject(new Error('Task type not defined'));

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
    .then((item) => {
      if (!item) resolve(null);

      if (item.type === taskType.priceBased) {
        resolve({
          creationDate: item.creationDate,
          settlementDate: item.settlementDate,
          client: item.client.name,
          project: item.project.name,
          version: item.version,
          description: item.description,
          price: item.price,
        });
      }

      if (item.type === taskType.hoursBased) {
        resolve({
          creationDate: item.creationDate,
          settlementDate: item.settlementDate,
          project: item.project.name,
          version: item.version,
          description: item.description,
          hours: item.hours
        });
      }
    })
    .catch((error) => { reject(error) });
  });
}


