const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

async function hashPassword (user) {
  const SALT_FACTOR = 8;

  if (!user.changed('password')) {
    return;
  }

  const hash = await bcrypt.hash(user.password, SALT_FACTOR);
  user.setDataValue('password', hash);
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        const space = this.lastName ? ' ' : ''
        return `${this.firstName}${space}${this.lastName}`;
      },
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    locale: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
  }, {
    timestamps: false,
    hooks: {
      // beforeCreate: hashPassword,
      // beforeUpdate: hashPassword,
      beforeSave: hashPassword,
    }
  });

  user.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
}
