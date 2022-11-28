const config = require('./config/config');
const {sequelize} = require('./models');
const {logger} = require("./misc/logger");
const app = require('./app.js');

const message = `Working Hours server listening on port ${config.port}`;
const isReset = 0;

sequelize.sync({force: isReset})
.then(() => {
  app.listen(config.port, () => {
    logger.info(message);
  });
});

app.get('/', (req, res) => {
  res.send(message);
});

