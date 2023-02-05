const {Task} = require('../models');
const {Client} = require('../models');
const {Project} = require('../models');
const {logger} = require("../misc/logger");

//Jesli jest blad to wyremuj na chwile. Musi istniec tabela

logger.info('Creating table relations...');

//client
Task.belongsTo(Client, {
  as: 'client',
  foreignKey: 'clientId',
});
Client.hasMany(Task, {
  as: 'tasks',
  foreignKey: 'clientId',
  onDelete: 'SET NULL',
});

//project
Task.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
});
Project.hasMany(Task, {
  as: 'tasks',
  foreignKey: 'projectId',
  onDelete: 'SET NULL',
});

