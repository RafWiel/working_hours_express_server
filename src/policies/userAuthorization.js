const Joi = require('joi');

module.exports = {
  login (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
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
