const Joi = require('joi');

module.exports = {
  login (req, res, next) {
    const schema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
      res.status(400).send({
        message: 'Nieprawidłowe dane wejściowe',
        details: error.details[0].message
      });
    } else next();
  },
}
