const express = require("express");

console.log("AI Routes Loaded");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const { testAI, generateTasks, getDailySummary } = require("../controllers/aiController");

router.post("/test", testAI);
router.post("/generate-tasks", generateTasks);
router.get("/daily-summary", authMiddleware, getDailySummary);

module.exports = router;