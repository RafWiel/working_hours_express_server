module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Clients',
  });

  Client.associate = function(models) {
    Client.hasMany(models.Task, {
      as: 'tasks',
      foreignKey: 'clientId',
      onDelete: 'set null',
      // hooks: true,
    });

    Client.hasMany(models.Project, {
      as: 'projects',
      foreignKey: 'projectId',
      onDelete: 'set null',
    });
  };

  return Client;
}
