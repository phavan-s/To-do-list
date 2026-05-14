const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  


const User = sequelize.define('User', {
    name: DataTypes.STRING, 
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
  type: DataTypes.STRING,
  defaultValue: "user"
}
});

const Todo = require("./todoModel");

User.hasMany(Todo, { foreignKey: 'userId' });
Todo.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;