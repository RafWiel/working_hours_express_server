module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
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

  Project.associate = function(models) {
    Project.hasMany(models.Task, {
      as: 'tasks',
      foreignKey: 'projectId',
      onDelete: 'cascade',
      //hooks: true,
    })
  };

  return Project;
}
