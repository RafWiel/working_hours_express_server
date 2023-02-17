const Joi = require('joi');

module.exports = {
  getNamesDistinct (req, res, next) {
    const schema = Joi.object({
      'task-type': Joi.number().required(),
      filter: Joi.string().optional(),
    });

    const {error} = schema.validate(req.query);
    if (error) {
      res.status(400).send({
        message: 'Incorrect input data',
        details: error.details[0].message
      });
    } else next();
  },
}
