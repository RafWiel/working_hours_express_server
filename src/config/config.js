const path = require('path');
const dotenv = require('dotenv');

if (process.pkg) {
  const envPath = path.join(__dirname, '../../.env.production');
  dotenv.config({ path: envPath });
}
else dotenv.config();

module.exports = {
  port: process.env.PORT,
  db: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      dialect: 'mysql',
      host: process.env.HOST,
    },
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET
  },
}
