require('dotenv').config(); // for .env file
const cors = require('cors');
const express = require('express');
const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const sequelize = require('./config/db.js'); // import sequelize

// Import models to establish relationships
const User = require('./models/userModel.js');
const Todo = require('./models/todoModel.js');
const userRoutes = require('./routes/userRoutes.js'); // import routes
const todoRoutes = require('./routes/todoRoutes.js'); // import routes todo

app.use(express.json()); 
app.use('/api', userRoutes);
app.use('/api', todoRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!'); 
}); 

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();