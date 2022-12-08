module.exports = (sequelize, DataTypes) =>
  sequelize.define('Project', {
    taskType: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Projects',
  });
