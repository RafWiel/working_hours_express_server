const {Task_DS} = require('../models');
const {Client_DS} = require('../models');
const {Task} = require('../models');
const {Client} = require('../models');
const {Project} = require('../models');

//Jesli jest blad to wyremuj na chwile. Musi istniec tabela

//usun
Client_DS.hasMany(Task_DS, {
  as: 'tasks',
  foreignKey: 'clientId',
  onDelete: 'SET NULL',
});
Task_DS.belongsTo(Client_DS, {
  as: 'client',
  foreignKey: 'clientId',
});




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

