const { logger } = require('../misc/logger');
const {Client} = require('../models');
const { Sequelize, Op, QueryTypes } = require('sequelize');
const tools = require('../misc/tools');
const {sequelize} = require('../models');
const sortOrder = require('../enums/sortOrder');
const settlementType = require('../enums/settlementType');

module.exports = {
  async getId (name) {
    try {
      //find client
      let client = await Client.findOne({
        where: {
          name: name,
        }
      });

      // create new client
      if (!client) {
        client = await Client.create({
          name
        });
      }

      return client.id;
    }
    catch (error) {
      logger.error(error);
    }

    return null;
  },
  async getNamesDistinct (req, res) {
    Client.findAll({
      attributes: [Sequelize.fn('distinct', Sequelize.col('name')) ,'name'],
      where: {
        name: {
          [Op.like]: `%${req.query.filter}%`
        }
      }
    })
    .then((values) => res.send(values.map(u => u.name)))
    .catch((error) => tools.sendError(res, error));
  },
  async get (req, res) {
    try {
      console.log('query', req.query);

      const page = req.query.page || 1;

      // sorting columns
      const sortColumn = req.query['sort-column'] ? req.query['sort-column'] : 'creationDate';
      const order = sortOrder.getSqlKeyword(req.query['sort-order']);

      // run query
      sequelize.query(`
        select
          c.name as client,
          sum(t.price) as amount
        from Clients c
        left join Tasks t on c.id = t.clientId
        where
          c.name like :search
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
        group by c.name
        order by ${sortColumn} ${order}
        limit 50
        offset :offset
      `, {
        type: QueryTypes.SELECT,
        replacements: {
          search: req.query.search ? `%${req.query.search}%` : '%%',
          settlementType: req.query['settlement-type'] && parseInt(req.query['settlement-type']) !== settlementType.all ? parseInt(req.query['settlement-type']) : null,
          settled: settlementType.settled,
          unsettled: settlementType.unsettled,
          offset: 50 * (page - 1),
        },
      })
      .then((clients) => {
        res.send({
          clients,
          meta: {
            page: 1,
          },
        });
      });
    }
    catch (error) { tools.sendError(res, error); }
  },
}
