const Joi = require('joi');

module.exports = {
  create (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required().pattern(
        new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/)
      ),
      firstName: Joi.string().allow(null, ''),
      lastName: Joi.string().allow(null, ''),
      type: Joi.number().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
      switch (error.details[0].context.key) {
        case 'password':
          res.status(400).send({
            code: 4001,
            message: 'Password does not meet policy requirements'
          });
          break;
        default:
          res.status(400).send({
            message: 'Incorrect input data',
            details: error.details[0].message
          });
      }
    } else next();
  },
  isUniqueUsername (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().required(),
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
