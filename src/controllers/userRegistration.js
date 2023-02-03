const tools = require('../misc/tools');
const {User} = require('../models');

module.exports = {
  create (req, res) {
    User.findOne({
      attributes: [ 'id' ],
      where : { userName: req.body.userName }
    })
    .then((id) => {
      if (id === null) {
        const {userName, password, firstName, lastName, type } = req.body;

        User.create({
          userName,
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
        res.status(409).send({ message: `Użytkownik ${req.body.userName} jest już zarejestrowany`});
      }
    })
    .catch((error) => tools.sendError(res, error));
  },
  isUniqueUserName (req, res) {
    User.findOne({
      attributes: [ 'id' ],
      where : { userName: req.body.userName }
    })
    .then((id) => {
      res.send({
        result: id === null,
      });
    })
    .catch((error) => tools.sendError(res, error));
  },
}
