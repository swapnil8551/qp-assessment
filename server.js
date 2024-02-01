const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false,
  },
  {
    pool: {
      max: 10, // Maximum number of connections
      min: 0, // Minimum number of connections
      acquire: 30000, // Maximum time (ms) to acquire a connection
      idle: 10000, // Maximum time (ms) a connection can be idle
    },
  },
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    // await sequelize.sync({ force: true }).then(() => {
    //   console.log('Database synchronized');
    // })
    // .catch(err => {
    //   console.error('Error synchronizing database:', err);
    // });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { connectDB, sequelize, Sequelize, DataTypes };
