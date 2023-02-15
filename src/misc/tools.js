const path = require('path');
const {logger} = require('../misc/logger');

module.exports = {
  sendError(res, error) {
    logger.error(error);
    res.status(500).send({
      message: 'Internal server error'
    });
  },
  sendBadRequestError(res, error) {
    logger.error(error);
    res.status(400).send({
      message: 'Incorrect input data'
    });
  },
  sendNotFoundError(res, error) {
    logger.error(error);
    res.status(404).send({
      message: 'Not found'
    });
  },
  sendDuplicateError(res, error) {
    logger.error(error);
    res.status(409).send({
      message: 'Duplicate data'
    });
  },
  sendAuthorizationError(res, error) {
    logger.error(error);
    res.status(401).send({
      message: 'Authorization error'
    });
  },
  sendLoginError(res, error) {
    logger.error(error);
    res.status(401).send({
      code: 4011,
      message: 'Incorrect username or password'
    });
  },
  getDir() {
    if (process.pkg) {
      return path.resolve(process.execPath + '/..');
    } else {
      return path.join(require.main ? require.main.path : process.cwd(), '..');
    }
  }
}
