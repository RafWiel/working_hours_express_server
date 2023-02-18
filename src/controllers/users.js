const tools = require('../misc/tools');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
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
  async login (req, res) {
    const {username, password} = req.body;

    // verify username
    var user = await User.findOne({
      where: { username: username }
    });

    if (!user) {
      return tools.sendLoginError(res, 'Username not found');
    }

    // verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return tools.sendLoginError(res, 'Invalid password');
    }

    const payload = {
      id: user.id,
      username: user.username
    };

    const token = jwt.sign(payload, config.authentication.jwtSecret, { expiresIn: 3600 * 24 });

    res.send({
      token: token,
      userType: user.type,
      locale: user.locale
    });
  },
  async setLocale (req, res) {
    const {username, locale} = req.body;

    User.update({
      locale,
    },{
      where: { username }
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => tools.sendError(res, error));

    res.sendStatus(200);
  },
}
