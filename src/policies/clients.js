const Joi = require('joi');

module.exports = {
  getNamesDistinct (req, res, next) {
    const schema = Joi.object({
      filter: Joi.string().optional(),
    });

    const {error} = schema.validate(req.query);
    if (error) {
      res.status(400).send({
        message: 'Nieprawidłowe dane wejściowe',
        details: error.details[0].message
      });
    } else next();
  },
}
