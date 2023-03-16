const Joi = require('joi');
const taskType = require('../enums/taskType');

function processError(data, res, schema) {
  const {error} = schema.validate(data);
  if (!error) return false;

  res.status(400).send({
    message: 'Incorrect input data',
    details: error.details[0].message
  });

  return true;
}

module.exports = {
  create (req, res, next) {
    const schema = Joi.object({
      creationDate: Joi.date().required(),
      type: Joi.number().required(),
      client: Joi.when('type', { is: taskType.priceBased, then: Joi.string().required() }),
      project: Joi.string().required(),
      version: Joi.string().optional().allow(null).allow(''),
      description: Joi.string().required(),
      price: Joi.when('type', { is: taskType.priceBased, then: Joi.number().required() }),
      hours: Joi.when('type', { is: taskType.hoursBased, then: Joi.number().required() }),
    });

    if (processError(req.body, res, schema)) {
      return;
    }

    next();
  },
  update (req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required(),
      creationDate: Joi.date().required(),
      settlementDate: Joi.date().optional().allow(null),
      invoiceDate: Joi.date().optional().allow(null),
      type: Joi.number().required(),
      client: Joi.when('type', { is: taskType.priceBased, then: Joi.string().required() }),
      project: Joi.string().required(),
      version: Joi.string().optional().allow(null).allow(''),
      description: Joi.string().required(),
      price: Joi.when('type', { is: taskType.priceBased, then: Joi.number().required() }),
      hours: Joi.when('type', { is: taskType.hoursBased, then: Joi.number().required() }),
    });

    if (processError(req.body, res, schema)) {
      return;
    }

    next();
  },
  getLast (req, res, next) {
    const schema = Joi.object({
      type: Joi.number().required(),
      client: Joi.string().optional().allow(null).allow(''),
      project: Joi.string().optional().allow(null).allow(''),
    });

    if (processError(req.query, res, schema)) {
      return;
    }

    next();
  },
  getOne (req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    if (processError(req.params, res, schema)) {
      return;
    }

    next();
  },
  settle (req, res, next) {
    const schema = Joi.object({
      idArray: Joi.array().items(Joi.number()).required(),
      settlementDate: Joi.date().required(),
    });

    if (processError(req.body, res, schema)) {
      return;
    }

    next();
  },
  invoice (req, res, next) {
    const schema = Joi.object({
      idArray: Joi.array().items(Joi.number()).required(),
      invoiceDate: Joi.date().required(),
    });

    if (processError(req.body, res, schema)) {
      return;
    }

    next();
  },
}
