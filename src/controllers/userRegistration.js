const tools = require('../misc/tools');
const {User} = require('../models');

module.exports = {
  create (req, res) {
    User.findOne({
      attributes: [ 'id' ],
      where : { username: req.body.username }
    })
    .then((id) => {
      if (id === null) {
        const {username, password, firstName, lastName, type } = req.body;

        User.create({
          username,
          password,
          firstName,
          lastName,
          type,
        })
        .then(() => {
          res.status(200).send();
        })
        .catch((error) => tools.sendError(res, error));
      }
      else {
        res.status(409).send({
          code: 4091,
          message: 'User already registered'
        });
      }
    })
    .catch((error) => tools.sendError(res, error));
  },
  isUniqueUsername (req, res) {
    User.findOne({
      attributes: [ 'id' ],
      where : { username: req.body.username }
    })
    .then((id) => {
      res.send({
        result: id === null,
      });
    })
    .catch((error) => tools.sendError(res, error));
  },
}
