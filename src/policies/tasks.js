const Joi = require('joi');
const taskType = require('../enums/taskType');

module.exports = {
  create (req, res, next) {
    const schema = Joi.object({
      creationDate: Joi.date().required(),
      type: Joi.number().required(),
      client: Joi.when('type', { is: taskType.priceBased, then: Joi.string().required() }),
      project: Joi.string().required(),
      version: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.when('type', { is: taskType.priceBased, then: Joi.number().required() }),
      hours: Joi.when('type', { is: taskType.hoursBased, then: Joi.number().required() }),
    });

    const {error} = schema.validate(req.body);
    if (error) {
      res.status(400).send({
        message: 'Incorrect input data',
        details: error.details[0].message
      });
    } else next();
  },
  update (req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required(),
      creationDate: Joi.date().required(),
      settlementDate: Joi.date().optional().allow(null),
      type: Joi.number().required(),
      client: Joi.when('type', { is: taskType.priceBased, then: Joi.string().required() }),
      project: Joi.string().required(),
      version: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.when('type', { is: taskType.priceBased, then: Joi.number().required() }),
      hours: Joi.when('type', { is: taskType.hoursBased, then: Joi.number().required() }),
    });

    const {error} = schema.validate(req.body);
    if (error) {
      res.status(400).send({
        message: 'Incorrect input data',
        details: error.details[0].message
      });
    } else next();
  },
  getLast (req, res, next) {
    const schema = Joi.object({
      type: Joi.number().required(),
    });

    const {error} = schema.validate(req.query);
    if (error) {
      res.status(400).send({
        message: 'Incorrect input data',
        details: error.details[0].message
      });
    } else next();
  },
  getOne (req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    const {error} = schema.validate(req.params);
    if (error) {
      res.status(400).send({
        message: 'Incorrect input data',
        details: error.details[0].message
      });
    } else next();
  },
  settle (req, res, next) {
    const schema = Joi.object({
      idArray: Joi.array().items(Joi.number()).required(),
      settlementDate: Joi.date().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
      res.status(400).send({
        message: 'Incorrect input data',
        details: error.details[0].message
      });
    } else next();
  },
}
