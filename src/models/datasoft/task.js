module.exports = (sequelize, DataTypes) =>
  sequelize.define('Task_DS', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    project: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    version: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Tasks_DS',
  });
