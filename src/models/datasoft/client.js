module.exports = (sequelize, DataTypes) =>
  sequelize.define('Client_DS', {
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Clients_DS',
  });
