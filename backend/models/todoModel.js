const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const todo = sequelize.define('todo', {
    title: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending"
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = todo;