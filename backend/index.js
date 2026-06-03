require('dotenv').config(); // for .env file
const cors = require('cors');
const express = require('express');
const app = express();

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:");
    console.error(err);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:");
    console.error(err);
});

console.log("INDEX FILE LOADED");
const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

// CORS configuration
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const sequelize = require('./config/db.js'); // import sequelize

// Import models to establish relationships
const User = require('./models/userModel.js');
const Todo = require('./models/todoModel.js');

// Set up model relationships
User.hasMany(Todo, { foreignKey: 'userId' });
Todo.belongsTo(User, { foreignKey: 'userId' });


const userRoutes = require('./routes/userRoutes.js'); // import routes
const todoRoutes = require('./routes/todoRoutes.js'); // import routes todo
const aiRoutes = require('./routes/aiRoutes.js'); // import AI routes
const adminRoutes = require('./routes/adminRoutes.js'); // import admin routes


app.use(express.json()); 

app.use('/api', userRoutes);
app.use('/api', todoRoutes);


app.use('/api/users', aiRoutes); // use AI routes
app.use('/api/admin', adminRoutes); // admin routes


app.post('/hello', (req, res) => {
    res.json({
        success: true,
        message: 'Hello route works'
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!'); 
}); 

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();