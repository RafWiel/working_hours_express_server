const Joi = require('joi');

module.exports = {
  create (req, res, next) {
    const schema = Joi.object({
      userName: Joi.string(),
      password: Joi.string().pattern(
        new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/)
      ),
      firstName: Joi.string().allow(null, ''),
      lastName: Joi.string().allow(null, ''),
      isAccountManager: Joi.boolean().allow(null, false),
    });

    const {error} = schema.validate(req.body);
    if (error) {
      switch (error.details[0].context.key) {
        case 'password':
          res.status(400).send({
            message: 'Hasło musi mieć minimum 8 znaków, wielką literę, cyfrę, oraz znak specjalny'
          })
          break;
        default:
          res.status(400).send({
            message: 'Nieprawidłowe dane',
            details: error.details[0].message
          })
      }
    } else {
      next();
    }
  },
}
