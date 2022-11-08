const {Task_AD} = require('../../models');
const tools = require('../../misc/tools');
const {logger} = require('../../misc/logger');

module.exports = {
  async create (req, res) {
    try {
      logger.info(req.body);

      const { date, project, version, hoursCount } = req.body;

      Task_AD.create({
        date,
        project,
        version,
        hoursCount,
      })
      .then(async (item) => {
        res.send({
          result: true,
          taskId: item.id,
        });
      })
      .catch((error) => tools.sendError(res, error));
    }
    catch (error) {
      tools.sendError(res, error);
    }
  },
}
