const tools = require('../misc/tools');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {User} = require('../models');

module.exports = {
  async login (req, res) {
    const {userName, password} = req.body;

    // verify username
    var user = await User.findOne({
      where: { userName: userName }
    });

    if (!user) {
      return tools.sendLoginError(res, 'UserName not found');
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
    });
  },
}
