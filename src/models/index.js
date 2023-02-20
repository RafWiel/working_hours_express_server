const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config');
const sortDir = require('../misc/sortDir');
const db = {};

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);

const basename  = path.basename(module.filename);
const filePaths = sortDir(__dirname, basename);

filePaths.forEach((filePath) => {
  const model = require(filePath)(sequelize, Sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
