const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createTodo, getTodos, updateTodo, deleteTodo } = require("../controllers/todoController");

router.post("/todos", authMiddleware, createTodo);
router.get("/todos", authMiddleware, getTodos);
router.put("/todos/:id", authMiddleware, updateTodo);
router.delete("/todos/:id", authMiddleware, deleteTodo);

module.exports = router;

