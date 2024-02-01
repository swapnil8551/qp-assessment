const { sequelize, DataTypes } = require('../server');

const Enduser = sequelize.define('Enduser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    set(email) {
      this.setDataValue('email', email.toLowerCase());
    },
    validate: {
      isEmail: true,
    },
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Enduser', 'Vendor'),
    allowNull: false
  }
},
{
    freezeTableName: true,
  });

module.exports = Enduser;
