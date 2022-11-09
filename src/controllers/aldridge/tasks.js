const {Task_AD} = require('../../models');
const tools = require('../../misc/tools');
const {logger} = require('../../misc/logger');

module.exports = {
  async create (req, res) {
    try {
      logger.info(req.body);

      const { date, project, version, hoursCount } = req.body;
      const hours = parseFloat(hoursCount, 10);

      1.5 ok
      1,5 obcina do 1

      Task_AD.create({
        date,
        project,
        version,
        hoursCount: hours,
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
