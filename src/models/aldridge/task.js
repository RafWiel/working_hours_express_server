module.exports = (sequelize, DataTypes) =>
  sequelize.define('Task_AD', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    project: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    version: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    hoursCount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Tasks_AD',
  });
