const { sequelize, DataTypes } = require('../server');
const Order = require('./Order')
const GroceryItem = require('./GroceryItem');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Order',
            key: 'id',
        },
    },
    grocery_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'GroceryItem',
            key: 'id',
        },
    },
    quantity: {
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
},
{
    freezeTableName: true,
}
);
OrderDetail.belongsTo(Order, {
    foreignKey: 'order_id',
});

OrderDetail.belongsTo(GroceryItem, {
    foreignKey: 'grocery_item_id',
});


OrderDetail.beforeCreate((instance, options) => {
    instance.created_by = options.currentUserUUID;
    instance.updated_by = options.currentUserUUID;
  });
  
  OrderDetail.beforeUpdate((instance, options) => {
    instance.updated_by = options.currentUserUUID;
  });


module.exports = OrderDetail;
