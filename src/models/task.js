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
      type: DataTypes.INTEGER,
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

  Task.addHook('afterCreate', 'Create', (task) => {
    console.log('hook afterCreate called', task.id)
  });

  // Task.addHook('beforeDestroy', 'Destroy1', (task) => {
  //   console.log('hook beforeDestroy called', task.id);
  // });

  Task.addHook('afterDestroy', 'Destroy2', (task) => {
    console.log('hook afterDestroy called', task.id);
  });

  Task.addHook('beforeBulkDestroy', 'Destroy', (options) => {
    console.log('hook beforeBulkDestroy called');
    //console.log(options);
    options.individualHooks = true;
    return options;
  });

  // Task.addHook('afterBulkDestroy', 'Destroy', (options) => {
  //   console.log('hook afterBulkDestroy called');
  //   //console.log(options);
  //   options.individualHooks = true;
  //   return options;
  // });

  return Task;
}
