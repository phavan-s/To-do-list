const bcrypt = require('bcrypt');
const User = require('../models/userModel');    
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const checkUser = await User.findOne(
        { 
            where: { email } 
    });
    
    if (checkUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create(
        {   name, 
            email, 
            password: hashedPassword 
        });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
};
    

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne(
    {
        where: { email }
    });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
                                                                    //password check
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

    const accessToken = jwt.sign(
    {
        id: user.id,
        role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
    );
    console.log("Access Token:", accessToken);
    const refreshToken = jwt.sign(
    {
        id: user.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
    );
    console.log("Refresh Token:", refreshToken);
    res.json({
        message: "Login successful",    
        accessToken,
        refreshToken
    });
};

const getUser = async (req, res) => { 
    const users = await User.findAll();
    res.json(users);
};  

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(id);   
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }   

    user.name = name || user.name;
    user.email = email || user.email;   

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
};

const deleteUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const adminUser = await User.findByPk(decoded.id);
    
    if (adminUser.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can delete users' });
    }
    
    const { id } = req.params;
    const result = await User.destroy({ where: { id } });
    
    if (result === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
};
module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser };

