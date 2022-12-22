module.exports = (sequelize, DataTypes) =>
  sequelize.define('Task', {
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
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    hours: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Tasks',
  });
