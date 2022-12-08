module.exports = (sequelize, DataTypes) =>
  sequelize.define('Client', {
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Clients',
  });
