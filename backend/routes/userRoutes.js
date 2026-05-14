console.log("UserRoutes file loaded");

const express = require('express');
const router = express.Router();

const  authMiddleware  = require('../middlewares/authMiddleware');

// 1 - to register a user
const { registerUser } = require('../controllers/userController');
// 2 - to get all users
const { getUser } = require('../controllers/userController');
// 3 - to update a user
const { updateUser } = require('../controllers/userController');
// 4 - to delete a user
const { deleteUser } = require('../controllers/userController');

const { loginUser } = require('../controllers/userController');



router.get('/users', getUser);
router.post('/register', registerUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);
router.post('/login', loginUser);
module.exports = router;

