const Todo = require("../models/todoModel");

const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
        const newTodo = await Todo.create({ title, description, userId });
        res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: "Error creating todo", error: error.message });
    }
};

const getTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        const todos = await Todo.findAll({ where: { userId } });
        res.json({ todos });
    } catch (error) {
        res.status(500).json({ message: "Error fetching todos", error: error.message });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const userId = req.user.id;
        const todo = await Todo.findOne({ where: { id, userId } });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        todo.status = status || todo.status;
        await todo.save();
        res.json({ message: "Todo updated successfully", todo });
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error: error.message });
    }
};

const getUserTodos = async (req, res) => {

  try {

    const userId = req.params.id;

    const todos = await Todo.findAll({
      where: {
        userId
      }
    });

    res.json(todos);

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const todo = await Todo.findOne({ where: { id, userId } });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        if (todo.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this todo" });
        }
        
        await todo.destroy();
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo", error: error.message });
    }
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo, getUserTodos };



