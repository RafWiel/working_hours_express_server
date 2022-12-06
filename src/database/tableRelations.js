const {Task_DS} = require('../models');
const {Client_DS} = require('../models');

//Jesli jest blad to wyremuj na chwile. Musi istniec tabela

Client_DS.hasMany(Task_DS, {
  as: 'tasks',
  foreignKey: 'clientId',
  onDelete: 'SET NULL',
});
Task_DS.belongsTo(Client_DS, {
  as: 'client',
  foreignKey: 'clientId',
});

