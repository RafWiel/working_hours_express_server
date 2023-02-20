const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require("helmet");
const morganMiddleware = require("./middleware/logger");

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

module.exports = app;

// must be called after export
require("./routes");






