const { sequelize, DataTypes } = require('../server');

const GroceryItem = sequelize.define('GroceryItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expdate_epoc: {
    type: DataTypes.BIGINT,
      allowNull: false, // use epocs only in seconds
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  inventory_level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Enduser',
      key: 'id',
    },
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Enduser',
      key: 'id',
    },
  },
},{
    freezeTableName: true,
  },);

  GroceryItem.beforeCreate((instance, options) => {
    instance.created_by = options.currentUserUUID;
    instance.updated_by = options.currentUserUUID;
  });
  
  GroceryItem.beforeUpdate((instance, options) => {
    instance.updated_by = options.currentUserUUID;
  });

module.exports = GroceryItem;
