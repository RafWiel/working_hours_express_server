const clients = require('../controllers/clients');
const projects = require('../controllers/projects');
const {Task} = require('../models');
const {Client} = require('../models');
const {Project} = require('../models');
const tools = require('../misc/tools');
const {logger} = require('../misc/logger');
const taskType = require('../enums/taskType');
const moment = require('moment');
const { Sequelize, Op, QueryTypes } = require('sequelize');
const {sequelize} = require('../models');
const sortOrder = require('../enums/sortOrder');
const timePeriod = require('../enums/timePeriod');
const settlementType = require('../enums/settlementType');

module.exports = {
  async create (req, res) {
    try {
      logger.info(req.body);

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

      const projectId = await projects.getId(clientId, type, project);
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
  async update (req, res) {
    try {
      logger.info(req.body);

      let { creationDate } = req.body;
      const { id, type, client, project, version, description, price, hours } = req.body;

      let clientId = null;
      if (type === taskType.priceBased) {
        clientId = await clients.getId(client);
        if (!clientId) {
          tools.sendError(res, 'Client not found');
          return;
        }
      }

      const projectId = await projects.getId(clientId, type, project);
      if (!projectId) {
        tools.sendError(res, 'Project not found');
        return;
      }

      creationDate = moment(creationDate).format('YYYY-MM-DD');

      Task.update({
        creationDate,
        type,
        clientId,
        projectId,
        version,
        description,
        price,
        hours
      },{
        where: { id }
      })
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => tools.sendError(res, error));
    }
    catch (error) {
      tools.sendError(res, error);
    }
  },
  async getLast (req, res) {
    const { type, client, project } = req.query;

    getLastTask(type, client, project)
    .then((item) => res.send(item))
    .catch((error) => tools.sendError(res, error));
  },
  async get (req, res) {
    try {
      console.log('query', req.query);

      const page = req.query.page || 1;

      // sorting columns
      const sortColumn = req.query['sort-column'] ? req.query['sort-column'] : 'creationDate';
      const order = sortOrder.getSqlKeyword(req.query['sort-order']);

      // set filter date
      let startDate = req.query['start-date'] ? req.query['start-date'] : null;
      let stopDate = req.query['stop-date'] ? req.query['stop-date'] : null;
      const now = new Date();

      // set filter predefined date
      switch(parseInt(req.query['time-period'])) {
        case timePeriod.currentWeek:
          startDate = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
            .subtract(now.getDay() - 1, 'd')
            .format('YYYY-MM-DD');
          stopDate = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
            .subtract(now.getDay() - 1, 'd')
            .add(7, 'd')
            .format('YYYY-MM-DD');
          break;
        case timePeriod.currentMonth:
          startDate = moment(new Date(now.getFullYear(), now.getMonth(), 1))
            .format('YYYY-MM-DD');
          stopDate = moment(new Date(now.getFullYear(), now.getMonth(), 1))
            .add(1, 'M')
            .format('YYYY-MM-DD');
          break;
        case timePeriod.previousMonth:
          startDate = moment(new Date(now.getFullYear(), now.getMonth(), 1))
            .add(-1, 'M')
            .format('YYYY-MM-DD');
          stopDate = moment(new Date(now.getFullYear(), now.getMonth(), 1))
            .format('YYYY-MM-DD');
          break;
        default:
          break;
      }

      // run query
      sequelize.query(`
        select
          t.id,
          t.creationDate,
          t.settlementDate,
          t.invoiceDate,
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
        where (
            t.version like :search or
            t.description like :search or
            c.name like :search or
            p.name like :search
          )
          and
            case when :startDate is not null then
              t.creationDate >= :startDate
            else true end
          and
            case when :stopDate is not null then
              t.creationDate < :stopDate
            else true end
          and
            case when :taskType is not null then
              t.type = :taskType
            else true end
          and
            case when :settlementType is not null then
              case when :settlementType = :settled then
                t.settlementDate is not null
              else
                case when :settlementType = :unsettled then
                  t.settlementDate is null
                end
              end
            else true end
          and
            case when :clientId is not null then
              c.id = :clientId
            else true end
        order by ${sortColumn} ${order}
        limit 50
        offset :offset
      `, {
        type: QueryTypes.SELECT,
        replacements: {
          search: req.query.search ? `%${req.query.search}%` : '%%',
          startDate: startDate ? startDate : null,
          stopDate: stopDate ? stopDate : null,
          taskType: req.query['task-type'] && parseInt(req.query['task-type']) !== taskType.all ? parseInt(req.query['task-type']) : null,
          settlementType: req.query['settlement-type'] && parseInt(req.query['settlement-type']) !== settlementType.all ? parseInt(req.query['settlement-type']) : null,
          settled: settlementType.settled,
          unsettled: settlementType.unsettled,
          clientId: req.query['client-id'] ? parseInt(req.query['client-id']) : null,
          offset: 50 * (page - 1),
        },
      })
      .then(async (tasks) => {
        const response = {
          tasks,
          meta: {
            page: 1,
          },
        };

        if (req.query['client-id']) {
          const client = await Client.findOne({
            where: {
              id: parseInt(req.query['client-id']),
            }
          });

          response.client = client.name;
        }

        res.send(response);
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
          [Op.and]: [
            { id: idArray },
            {
              settlementDate: {
                [Op.eq]: null
              }
            }
          ],
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
  async invoice (req, res) {
    try {
      logger.info(req.body);

      const { idArray } = req.body;
      let { invoiceDate } = req.body;

      invoiceDate = moment(invoiceDate).format('YYYY-MM-DD');

      Task.update({
        invoiceDate,
      }, {
        where: {
          [Op.and]: [
            { id: idArray },
            {
              invoiceDate: {
                [Op.eq]: null
              }
            }
          ],
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
  async getOne (req, res) {
    try {
      const { id } = req.params;

      Task.findOne({
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
          id,
        },
      })
      .then((task) => {
        if (!task) {
          tools.sendNotFoundError(res, 'Task not found');
          return;
        }

        res.send({
          id: task.id,
          creationDate: task.creationDate,
          settlementDate: task.settlementDate,
          invoiceDate: task.invoiceDate,
          type: task.type,
          version: task.version,
          description: task.description,
          price: task.price,
          hours: task.hours,
          client: task.client != null ? task.client.name : null,
          project: task.project != null ? task.project.name : null,
        });
      })
      .catch((error) => { tools.sendError(res, error) });
    }
    catch (error) {
      tools.sendError(res, error);
    }
  },
  async delete (req, res) {
    try {
      logger.info(req.params);

      const { id } = req.params;

      Task.destroy({
        where: { id }
      })
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

  if (!item1.version && !item2.version
    || item1.version.localeCompare(item2.version, undefined, { sensitivity: 'accent' }) !== 0) {
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

async function getLastTask(type, clientName, projectName) {
  let project = null;
  if (projectName) {
    let client = null;

    if (clientName) {
      client = await Client.findOne({
        attributes: [ 'id' ],
        where: {
          name: clientName,
        }
      });
    }

    // console.log('client', client ? client.id : null);

    let where = `
      taskType = ${type} and
      name = '${projectName}'`

    if(!!client === true) {
      where += `and clientId = ${client.id}`
    }

    project = await Project.findOne({
      attributes: [ 'id' ],
      where: Sequelize.literal(where)
    });

    // console.log('project', project ? project.id : null);
  }

  let where = `type = ${type} `;
  if (projectName) {
    where += `and projectId = ${!!project === true ? project.id : null}`
  }

  return new Promise((resolve, reject) => {
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
      where: Sequelize.literal(where)
    })
    .then((task) => {
      if (!task) resolve(null);

      if (task.type === taskType.priceBased) {
        resolve({
          creationDate: task.creationDate,
          settlementDate: task.settlementDate,
          invoiceDate: task.invoiceDate,
          client: task.client.name,
          project: task.project.name,
          version: task.version,
          description: task.description,
          price: task.price,
        });
      }

      if (task.type === taskType.hoursBased) {
        resolve({
          creationDate: task.creationDate,
          settlementDate: task.settlementDate,
          project: task.project.name,
          version: task.version,
          description: task.description,
          hours: task.hours
        });
      }
    })
    .catch((error) => { reject(error) });
  });
}


