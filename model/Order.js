const { sequelize, DataTypes } = require('../server');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_date_epoc: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  payment_mode: {
    type: DataTypes.ENUM('UPI', 'cash', 'card'),
    allowNull: false,
},
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'inprogress'),
    allowNull: false,
    defaultValue: 'pending'
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

  Order.beforeCreate((instance, options) => {
    instance.created_by = options.currentUserUUID;
    instance.updated_by = options.currentUserUUID;
  });
  
  Order.beforeUpdate((instance, options) => {
    instance.updated_by = options.currentUserUUID;
  });

module.exports = Order;
