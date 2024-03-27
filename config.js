
const {Sequelize,DataTypes} = require('sequelize');
const logger = require('../Logger');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'user',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    }
);

sequelize.authenticate().then(() => {
    logger.info(`Database connected to discover`);
}).catch((err) => {
    logger.error(`Database connection failed: `+err);
})

const database = {}
database.Sequelize = Sequelize
database.sequelize = sequelize
database.DataTypes = DataTypes

//connecting to model
database.users = require('./userModel') (sequelize, DataTypes,Sequelize)

//exporting the module
module.exports = database
