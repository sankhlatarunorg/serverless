
const {Sequelize,DataTypes} = require('sequelize');
require('dotenv').config();
console.log("DB_name:",process.env.DB_NAME );
console.log("DB_USER:",process.env.DB_USER );
console.log("DB_PASSWORD:",process.env.DB_PASSWORD );
console.log("DB_HOST:",process.env.DB_HOST );


const sequelize = new Sequelize(
    process.env.DB_NAME || 'webapp',
    process.env.DB_USER || 'webapp',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    }
);

sequelize.authenticate().then(() => {
    console.log(`Database connected to discover`);
}).catch((err) => {
    console.log(`Database connection failed: `+err);
})

const database = {}
database.Sequelize = Sequelize
database.sequelize = sequelize
database.DataTypes = DataTypes

//connecting to model
database.users = require('./userModel') (sequelize, DataTypes,Sequelize)

//exporting the module
module.exports = database
