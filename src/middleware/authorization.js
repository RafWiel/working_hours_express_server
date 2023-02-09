const tools = require('../misc/tools');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

module.exports = {
  filter (req, res, next) {
    if (process.env.NODE_ENV === 'development') {
      next();
      return;
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return tools.sendAuthorizationError(res);
    }

    jwt.verify(token, config.authentication.jwtSecret, (error) => {
      if (error) {
        return tools.sendAuthorizationError(res, error);
      }

      next();
    });
  }
}
