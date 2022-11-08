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
        User.create({
          userName: req.body.userName,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          isAccountManager: req.body.isAccountManager,
        })
        .then(() => {
          res.send({
            result: true,
            // user, 
          });
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
