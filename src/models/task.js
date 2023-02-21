//const { Project } = require('../models/project');

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    settlementDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    version: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    hours: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Tasks',
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
      hooks: true,
    });

    Task.belongsTo(models.Client, {
      as: 'client',
      foreignKey: 'clientId',
      //hooks: true,
    });
  };

  Task.addHook('beforeBulkDestroy', 'beforeBulkDestroy', (options) => {
    console.log('hook beforeBulkDestroy called');

    options.individualHooks = true;
    return options;
  });

  Task.addHook('afterDestroy', 'afterDestroy', (task) => {
    verifyDeleteClients(Task, sequelize.models.Client, task.clientId);
    verifyDeleteProjects(Task, sequelize.models.Project, task.projectId);

  });

  return Task;
}

async function verifyDeleteClients(Task, Client, clientId) {
  if (!clientId) return;

  const count = await Task.count({
    where: { clientId },
  });

  console.log('hook afterDestroy Client: ', count);

  if (count > 0) return;

  Client.destroy({
    where: { id: clientId }
  });
}

async function verifyDeleteProjects(Task, Project, projectId) {
  const count = await Task.count({
    where: { projectId },
  });

  console.log('hook afterDestroy Project: ', count);

  if (count > 0) return;

  Project.destroy({
    where: { id: projectId }
  });
}


