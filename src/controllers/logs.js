const {clientLogger} = require('../misc/logger');

module.exports = {
  async create (req, res) {
    const {level, message} = req.body;

    if (level === clientLogger.levels.error) clientLogger.error(message);
    if (level === clientLogger.levels.warn) clientLogger.warn(message);
    if (level === clientLogger.levels.info) clientLogger.info(message);
    if (level === clientLogger.levels.http) clientLogger.http(message);
    if (level === clientLogger.levels.debug) clientLogger.debug(message);

    res.sendStatus(200);
  },
}
