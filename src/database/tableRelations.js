const {Task} = require('../models');
const {Client} = require('../models');
const {Project} = require('../models');

//Jesli jest blad to wyremuj na chwile. Musi istniec tabela

//client
Client.hasMany(Task, {
  as: 'tasks',
  foreignKey: 'clientId',
  onDelete: 'SET NULL',
});
Task.belongsTo(Client, {
  as: 'client',
  foreignKey: 'clientId',
});

//project
Project.hasMany(Task, {
  as: 'tasks',
  foreignKey: 'projectId',
  onDelete: 'SET NULL',
});
Task.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
});

