const { logger } = require('../misc/logger');
const {Client} = require('../models');
const { Sequelize, Op, QueryTypes } = require('sequelize');
const tools = require('../misc/tools');
const {sequelize} = require('../models');
const sortOrder = require('../enums/sortOrder');
const settlementType = require('../enums/settlementType');
const invoiceType = require('../enums/invoiceType');

module.exports = {
  async getId (name) {
    try {
      //find client
      let client = await Client.findOne({
        where: {
          name,
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
    let where = {};

    if(req.query.filter) {
      where = {
        name: {
          [Op.like]: `%${req.query.filter}%`
        }
      };
    }

    Client.findAll({
      attributes: [Sequelize.fn('distinct', Sequelize.col('name')) ,'name'],
      where
    })
    .then((values) => res.send(values.map(u => u.name)))
    .catch((error) => tools.sendError(res, error));
  },
  async get (req, res) {
    try {
      console.log('query', req.query);

      const page = req.query.page || 1;

      // sorting columns
      const sortColumn = req.query['sort-column'] ? req.query['sort-column'] : 'client';
      const order = sortOrder.getSqlKeyword(req.query['sort-order']);

      // run query
      sequelize.query(`
        select
          c.id as id,
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
          and
            case when :invoiceType is not null then
              case when :invoiceType = :issued then
                t.invoiceDate is not null
              else
                case when :invoiceType = :notIssued then
                  t.invoiceDate is null
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
          invoiceType: req.query['invoice-type'] && parseInt(req.query['invoice-type']) !== invoiceType.all ? parseInt(req.query['invoice-type']) : null,
          issued: invoiceType.issued,
          notIssued: invoiceType.notIssued,
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
