const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const {sequelize} = require('./models');
const fs = require('fs');
const path = require('path');
const helmet = require("helmet");
const morganMiddleware = require("./middlewares/logger");
const {logger} = require("./misc/logger");

if (process.pkg) {
  const envPath = path.join(__dirname, '../.env.production');
  dotenv.config({ path: envPath });
}
else dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(morganMiddleware);

// load routes
fs.readdirSync(`${__dirname}/routes`)
  .forEach((file) => {
    require(path.join(`${__dirname}/routes`, file))(app);
  });

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
